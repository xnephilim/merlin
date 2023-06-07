import { createSlice } from '@reduxjs/toolkit'
import { createApi } from '@reduxjs/toolkit/dist/query/react'
import type { AccountId, AssetId } from '@xblackfury/caip'
import { ASSET_NAMESPACE, ethChainId, fromAccountId, toAssetId } from '@xblackfury/caip'
import type { Transaction } from '@xblackfury/chain-adapters'
import type { UtxoAccountType } from '@xblackfury/types'
import difference from 'lodash/difference'
import identity from 'lodash/identity'
import orderBy from 'lodash/orderBy'
import { PURGE } from 'redux-persist'
import { getChainAdapterManager } from 'context/PluginProvider/chainAdapterSingleton'
import type { RebaseHistory } from 'lib/investor/investor-merlinx'
import { merlinxAddresses } from 'lib/investor/investor-merlinx'
import type { PartialRecord } from 'lib/utils'
import { deepUpsertArray, isSome } from 'lib/utils'
import { BASE_RTK_CREATE_API_CONFIG } from 'state/apis/const'
import { getMerlinxApi } from 'state/apis/merlinx/merlinxApiSingleton'
import type { State } from 'state/apis/types'
import type { Nominal } from 'types/common'

import { getRelatedAssetIds, serializeTxIndex, UNIQUE_TX_ID_DELIMITER } from './utils'

export type TxId = Nominal<string, 'TxId'>
export type Tx = Transaction & { accountType?: UtxoAccountType }

export type TxHistoryById = {
  [k: TxId]: Tx
}

/* this is a one to many relationship of an account and asset id to tx id
 *
 * e.g. an account with a single trade of MERLIN to USDC will produce the following
 * three related assets
 *
 * {
 *   0xfoobaraccount: {
 *     merlinAssetId: [txid] // sell asset
 *     usdcAssetId: [txid] // buy asset
 *     ethAssetId: [txid] // fee asset
 *   }
 * }
 *
 * where txid is the same txid related to all the above assets, as the
 * sell asset, buy asset, and fee asset respectively
 *
 * this allows us to O(1) select all related transactions to a given asset
 *
 * note - we persist this data structure to disk across page refresh, and wallet disconnections
 * and use the accountIds from the connected wallet to index into it
 */

export type TxIdsByAssetId = PartialRecord<AssetId, TxId[]>
export type TxIdsByAccountIdAssetId = PartialRecord<AccountId, TxIdsByAssetId>

export type RebaseId = Nominal<string, 'RebaseId'>
type RebaseById = PartialRecord<RebaseId, RebaseHistory>

type RebaseIdsByAssetId = PartialRecord<AssetId, RebaseId[]>
export type RebaseIdsByAccountIdAssetId = PartialRecord<AccountId, RebaseIdsByAssetId>

export type TxsState = {
  byId: TxHistoryById
  byAccountIdAssetId: TxIdsByAccountIdAssetId
  ids: TxId[]
}

export type RebasesState = {
  byAccountIdAssetId: RebaseIdsByAccountIdAssetId
  ids: RebaseId[]
  byId: RebaseById
}

export type TxHistory = {
  txs: TxsState
  rebases: RebasesState
}

export type TxMessage = { payload: { message: Tx; accountId: AccountId } }
export type TxsMessage = {
  payload: { txs: Transaction[]; accountId: AccountId }
}

const initialState: TxHistory = {
  txs: {
    byAccountIdAssetId: {},
    byId: {},
    ids: [], // sorted, newest first
  },
  rebases: {
    byAccountIdAssetId: {},
    ids: [],
    byId: {},
  },
}

/**
 * Manage state of the txHistory slice
 *
 * If transaction already exists, update the value, otherwise add the new transaction
 */

const updateOrInsertTx = (txHistory: TxHistory, tx: Tx, accountId: AccountId) => {
  const { txs } = txHistory
  const txIndex = serializeTxIndex(accountId, tx.txid, tx.address, tx.data)

  const isNew = !txs.byId[txIndex]

  // update or insert tx
  txs.byId[txIndex] = tx

  // add id to ordered set for new tx
  if (isNew) {
    const orderedTxs = orderBy(txs.byId, 'blockTime', ['desc'])
    const index = orderedTxs.findIndex(
      tx => serializeTxIndex(accountId, tx.txid, tx.address, tx.data) === txIndex,
    )
    txs.ids.splice(index, 0, txIndex)
  }

  // for a given tx, find all the related assetIds, and keep an index of
  // txids related to each asset id
  getRelatedAssetIds(tx).forEach(relatedAssetId =>
    deepUpsertArray(txs.byAccountIdAssetId, accountId, relatedAssetId, txIndex),
  )
}

type UpdateOrInsertRebase = (txState: TxHistory, data: RebaseHistoryPayload['payload']) => void

const updateOrInsertRebase: UpdateOrInsertRebase = (txState, payload) => {
  const { accountId, assetId } = payload
  const { rebases } = txState
  payload.data.forEach(rebase => {
    const rebaseId = makeRebaseId({ accountId, assetId, rebase })
    const isNew = !txState.rebases.byId[rebaseId]

    rebases.byId[rebaseId] = rebase

    if (isNew) {
      const orderedRebases = orderBy(rebases.byId, 'blockTime', ['desc']).filter(isSome)
      const index = orderedRebases.findIndex(
        rebase => makeRebaseId({ accountId, assetId, rebase }) === rebaseId,
      )
      rebases.ids.splice(index, 0, rebaseId)
    }

    deepUpsertArray(rebases.byAccountIdAssetId, accountId, assetId, rebaseId)
  })
}

type MakeRebaseIdArgs = {
  accountId: AccountId
  assetId: AssetId
  rebase: RebaseHistory
}

type MakeRebaseId = (args: MakeRebaseIdArgs) => string

const makeRebaseId: MakeRebaseId = ({ accountId, assetId, rebase }) =>
  [accountId, assetId, rebase.blockTime].join(UNIQUE_TX_ID_DELIMITER)

type RebaseHistoryPayload = {
  payload: {
    accountId: AccountId
    assetId: AssetId
    data: RebaseHistory[]
  }
}

export const txHistory = createSlice({
  name: 'txHistory',
  initialState,
  reducers: {
    clear: () => {
      return initialState
    },
    onMessage: (txState, { payload }: TxMessage) =>
      updateOrInsertTx(txState, payload.message, payload.accountId),
    upsertTxs: (txState, { payload }: TxsMessage) => {
      for (const tx of payload.txs) updateOrInsertTx(txState, tx, payload.accountId)
    },
    upsertRebaseHistory: (txState, { payload }: RebaseHistoryPayload) =>
      updateOrInsertRebase(txState, payload),
  },
  extraReducers: builder => builder.addCase(PURGE, () => initialState),
})

type RebaseTxHistoryArgs = {
  accountId: AccountId
  portfolioAssetIds: AssetId[]
}

export const txHistoryApi = createApi({
  ...BASE_RTK_CREATE_API_CONFIG,
  reducerPath: 'txHistoryApi',
  endpoints: build => ({
    getMerlinxRebaseHistoryByAccountId: build.query<RebaseHistory[], RebaseTxHistoryArgs>({
      queryFn: ({ accountId, portfolioAssetIds }, { dispatch }) => {
        const { chainId, account: userAddress } = fromAccountId(accountId)
        // merlinx is only on eth mainnet, and [] is a valid return type and won't upsert anything
        if (chainId !== ethChainId) return { data: [] }
        // merlinx contract address, note not assetIds
        const merlinxTokenContractAddress = (() => {
          const contractAddress = merlinxAddresses[0].merlinx.toLowerCase()
          if (portfolioAssetIds.some(id => id.includes(contractAddress))) return contractAddress
        })()

        // don't do anything below if we don't have MERLINy as a portfolio AssetId
        if (!merlinxTokenContractAddress) return { data: [] }

        // setup merlinx api
        const merlinxApi = getMerlinxApi()

        ;(async () => {
          const rebaseHistoryArgs = { userAddress, tokenContractAddress: merlinxTokenContractAddress }
          const data = await merlinxApi.getRebaseHistory(rebaseHistoryArgs)
          const assetReference = merlinxTokenContractAddress
          const assetNamespace = ASSET_NAMESPACE.erc20
          const assetId = toAssetId({ chainId, assetNamespace, assetReference })
          const upsertPayload = { accountId, assetId, data }
          if (data.length) dispatch(txHistory.actions.upsertRebaseHistory(upsertPayload))
        })()
        return { data: [] }
      },
    }),
    getAllTxHistory: build.query<Transaction[], AccountId>({
      queryFn: async (accountId, { dispatch, getState }) => {
        const { chainId, account: pubkey } = fromAccountId(accountId)
        const adapter = getChainAdapterManager().get(chainId)
        if (!adapter)
          return {
            error: {
              data: `getAllTxHistory: no adapter available for chainId ${chainId}`,
              status: 400,
            },
          }

        let currentCursor: string = ''
        try {
          do {
            const { cursor, transactions } = await adapter.getTxHistory({
              cursor: currentCursor,
              pubkey,
              pageSize: 100,
            })

            currentCursor = cursor

            const state = getState() as State
            const txState = state.txHistory.txs

            const existingTxIndexes = Object.values(
              txState?.byAccountIdAssetId?.[accountId] ?? {},
            ).flatMap(identity)

            // freshly fetched - hightable returns latest txs first
            const fetchedTxIndexes: TxId[] = transactions.map(tx =>
              serializeTxIndex(accountId, tx.txid, tx.address, tx.data),
            )
            // diff the two - if we haven't seen any of these txs before, upsert them
            const diffedTxIds = difference(fetchedTxIndexes, existingTxIndexes)
            if (diffedTxIds.length) {
              // new txs to upsert
              dispatch(txHistory.actions.upsertTxs({ txs: transactions, accountId }))
            } else {
              // we've previously fetched all txs for this account, don't keep paginating
              break
            }
          } while (currentCursor)
        } catch (err) {
          console.error(err)
        }

        return { data: [] }
      },
    }),
  }),
})

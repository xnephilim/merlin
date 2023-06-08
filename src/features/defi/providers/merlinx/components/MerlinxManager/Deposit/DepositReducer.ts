import { KnownChainIds } from '@xblackfury/types'
import { bn } from 'lib/bignumber/bignumber'
import { DefiType } from 'state/slices/opportunitiesSlice/types'

import type { MerlinxDepositActions, MerlinxDepositState } from './DepositCommon'
import { MerlinxDepositActionType } from './DepositCommon'

export const initialState: MerlinxDepositState = {
  txid: null,
  merlinxOpportunity: {
    contractAddress: '',
    stakingToken: '',
    provider: '',
    chain: KnownChainIds.EthereumMainnet,
    type: DefiType.Staking,
    expired: false,
    version: '',
    rewardToken: '',
    tvl: bn(0),
    apy: '',
  },
  loading: false,
  approve: {},
  pricePerShare: '',
  deposit: {
    fiatAmount: '',
    cryptoAmount: '',
    slippage: '',
    txStatus: 'pending',
    usedGasFeeCryptoBaseUnit: '',
  },
  isExactAllowance: false,
}

export const reducer = (state: MerlinxDepositState, action: MerlinxDepositActions) => {
  switch (action.type) {
    case MerlinxDepositActionType.SET_OPPORTUNITY:
      return { ...state, merlinxOpportunity: { ...state.merlinxOpportunity, ...action.payload } }
    case MerlinxDepositActionType.SET_APPROVE:
      return { ...state, approve: action.payload }
    case MerlinxDepositActionType.SET_DEPOSIT:
      return { ...state, deposit: { ...state.deposit, ...action.payload } }
    case MerlinxDepositActionType.SET_LOADING:
      return { ...state, loading: action.payload }
    case MerlinxDepositActionType.SET_TXID:
      return { ...state, txid: action.payload }
    case MerlinxDepositActionType.SET_IS_EXACT_ALLOWANCE:
      return { ...state, isExactAllowance: action.payload }
    default:
      return state
  }
}

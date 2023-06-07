import { KnownChainIds, WithdrawType } from '@shapeshiftoss/types'
import { bn } from 'lib/bignumber/bignumber'
import { DefiType } from 'state/slices/opportunitiesSlice/types'

import type { MerlinxWithdrawActions, MerlinxWithdrawState } from './WithdrawCommon'
import { MerlinxWithdrawActionType } from './WithdrawCommon'

export const initialState: MerlinxWithdrawState = {
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
  withdraw: {
    fiatAmount: '',
    cryptoAmount: '',
    slippage: '',
    txStatus: 'pending',
    usedGasFeeCryptoBaseUnit: '',
    withdrawType: WithdrawType.DELAYED,
  },
  merlinxFeePercentage: '',
}

export const reducer = (state: MerlinxWithdrawState, action: MerlinxWithdrawActions) => {
  switch (action.type) {
    case MerlinxWithdrawActionType.SET_OPPORTUNITY:
      return { ...state, merlinxOpportunity: { ...state.merlinxOpportunity, ...action.payload } }
    case MerlinxWithdrawActionType.SET_APPROVE:
      return { ...state, approve: action.payload }
    case MerlinxWithdrawActionType.SET_WITHDRAW:
      return { ...state, withdraw: { ...state.withdraw, ...action.payload } }
    case MerlinxWithdrawActionType.SET_LOADING:
      return { ...state, loading: action.payload }
    case MerlinxWithdrawActionType.SET_TXID:
      return { ...state, txid: action.payload }
    case MerlinxWithdrawActionType.SET_MERLINX_FEE:
      return { ...state, merlinxFeePercentage: action.payload }
    default:
      return state
  }
}

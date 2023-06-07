import type { MerlinFarmingWithdrawActions, MerlinFarmingWithdrawState } from './WithdrawCommon'
import { MerlinFarmingWithdrawActionType } from './WithdrawCommon'

export const initialState: MerlinFarmingWithdrawState = {
  txid: null,
  loading: false,
  approve: {},
  withdraw: {
    lpAmount: '',
    fiatAmount: '',
    txStatus: 'pending',
    usedGasFeeCryptoPrecision: '',
    isExiting: false,
  },
}

export const reducer = (
  state: MerlinFarmingWithdrawState,
  action: MerlinFarmingWithdrawActions,
): MerlinFarmingWithdrawState => {
  switch (action.type) {
    case MerlinFarmingWithdrawActionType.SET_WITHDRAW:
      return { ...state, withdraw: { ...state.withdraw, ...action.payload } }
    case MerlinFarmingWithdrawActionType.SET_LOADING:
      return { ...state, loading: action.payload }
    case MerlinFarmingWithdrawActionType.SET_APPROVE:
      return { ...state, approve: action.payload }
    case MerlinFarmingWithdrawActionType.SET_TXID:
      return { ...state, txid: action.payload }
    default:
      return state
  }
}

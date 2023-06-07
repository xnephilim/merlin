import type { MerlinFarmingDepositActions, MerlinFarmingDepositState } from './DepositCommon'
import { MerlinFarmingDepositActionType } from './DepositCommon'

export const initialState: MerlinFarmingDepositState = {
  txid: null,
  loading: false,
  approve: {},
  deposit: {
    fiatAmount: '',
    cryptoAmount: '',
    txStatus: 'pending',
    usedGasFeeCryptoPrecision: '',
  },
}

export const reducer = (
  state: MerlinFarmingDepositState,
  action: MerlinFarmingDepositActions,
): MerlinFarmingDepositState => {
  switch (action.type) {
    case MerlinFarmingDepositActionType.SET_APPROVE:
      return { ...state, approve: action.payload }
    case MerlinFarmingDepositActionType.SET_DEPOSIT:
      return { ...state, deposit: { ...state.deposit, ...action.payload } }
    case MerlinFarmingDepositActionType.SET_LOADING:
      return { ...state, loading: action.payload }
    case MerlinFarmingDepositActionType.SET_TXID:
      return { ...state, txid: action.payload }
    default:
      return state
  }
}

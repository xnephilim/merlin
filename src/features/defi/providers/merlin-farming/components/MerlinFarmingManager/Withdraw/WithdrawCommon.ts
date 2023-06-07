type EstimatedGas = {
  estimatedGasCryptoPrecision?: string
}

type WithdrawValues = {
  lpAmount: string
  fiatAmount: string
}

type MerlinFarmingWithdrawValues = WithdrawValues &
  EstimatedGas & {
    txStatus: string
    usedGasFeeCryptoPrecision: string
    isExiting: boolean
  }

export type MerlinFarmingWithdrawState = {
  approve: EstimatedGas
  withdraw: MerlinFarmingWithdrawValues
  loading: boolean
  txid: string | null
}

export enum MerlinFarmingWithdrawActionType {
  SET_WITHDRAW = 'SET_WITHDRAW',
  SET_LOADING = 'SET_LOADING',
  SET_APPROVE = 'SET_APPROVE',
  SET_TXID = 'SET_TXID',
  SET_TX_STATUS = 'SET_TX_STATUS',
}

type SetWithdraw = {
  type: MerlinFarmingWithdrawActionType.SET_WITHDRAW
  payload: Partial<MerlinFarmingWithdrawValues>
}

type SetLoading = {
  type: MerlinFarmingWithdrawActionType.SET_LOADING
  payload: boolean
}

type SetTxid = {
  type: MerlinFarmingWithdrawActionType.SET_TXID
  payload: string
}

type SetApprove = {
  type: MerlinFarmingWithdrawActionType.SET_APPROVE
  payload: EstimatedGas
}

export type MerlinFarmingWithdrawActions = SetWithdraw | SetApprove | SetLoading | SetTxid

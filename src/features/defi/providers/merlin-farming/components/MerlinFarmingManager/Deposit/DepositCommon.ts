type EstimatedGas = {
  estimatedGasCryptoPrecision?: string
}

type DepositValues = {
  fiatAmount: string
  cryptoAmount: string
}

type MerlinFarmingDepositValues = DepositValues &
  EstimatedGas & {
    txStatus: string
    usedGasFeeCryptoPrecision: string
  }

export type MerlinFarmingDepositState = {
  approve: EstimatedGas
  deposit: MerlinFarmingDepositValues
  loading: boolean
  txid: string | null
}

export enum MerlinFarmingDepositActionType {
  SET_APPROVE = 'SET_APPROVE',
  SET_DEPOSIT = 'SET_DEPOSIT',
  SET_LOADING = 'SET_LOADING',
  SET_TXID = 'SET_TXID',
}

type SetApprove = {
  type: MerlinFarmingDepositActionType.SET_APPROVE
  payload: EstimatedGas
}

type SetDeposit = {
  type: MerlinFarmingDepositActionType.SET_DEPOSIT
  payload: Partial<MerlinFarmingDepositValues>
}

type SetLoading = {
  type: MerlinFarmingDepositActionType.SET_LOADING
  payload: boolean
}

type SetTxid = {
  type: MerlinFarmingDepositActionType.SET_TXID
  payload: string
}

export type MerlinFarmingDepositActions = SetApprove | SetDeposit | SetLoading | SetTxid

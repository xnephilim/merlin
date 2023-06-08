import type { ChainId } from '@shapeshiftoss/caip'
import type { WithdrawType } from '@xblackfury/types'
import type { WithdrawValues } from 'features/defi/components/Withdraw/Withdraw'
import type { BigNumber } from 'lib/bignumber/bignumber'
import type { DefiType } from 'state/slices/opportunitiesSlice/types'

type SupportedMerlinxOpportunity = {
  type: DefiType
  provider: string
  version: string
  contractAddress: string
  rewardToken: string
  stakingToken: string
  chain: ChainId
  tvl: BigNumber
  apy: string
  expired: boolean
}

type EstimatedGas = {
  estimatedGasCryptoBaseUnit?: string
}

type MerlinxWithdrawValues = WithdrawValues &
  EstimatedGas & {
    txStatus: string
    usedGasFeeCryptoBaseUnit: string
    withdrawType: WithdrawType
  }

export type MerlinxWithdrawState = {
  merlinxOpportunity: SupportedMerlinxOpportunity
  approve: EstimatedGas
  withdraw: MerlinxWithdrawValues
  loading: boolean
  txid: string | null
  merlinxFeePercentage: string
}
export enum MerlinxWithdrawActionType {
  SET_OPPORTUNITY = 'SET_OPPORTUNITY',
  SET_WITHDRAW = 'SET_WITHDRAW',
  SET_APPROVE = 'SET_APPROVE',
  SET_LOADING = 'SET_LOADING',
  SET_TXID = 'SET_TXID',
  SET_TX_STATUS = 'SET_TX_STATUS',
  SET_MERLINX_FEE = 'SET_MERLINX_FEE',
}

type SetVaultAction = {
  type: MerlinxWithdrawActionType.SET_OPPORTUNITY
  payload: SupportedMerlinxOpportunity | null
}

type SetApprove = {
  type: MerlinxWithdrawActionType.SET_APPROVE
  payload: EstimatedGas
}

type SetWithdraw = {
  type: MerlinxWithdrawActionType.SET_WITHDRAW
  payload: Partial<MerlinxWithdrawValues>
}

type SetLoading = {
  type: MerlinxWithdrawActionType.SET_LOADING
  payload: boolean
}

type SetTxid = {
  type: MerlinxWithdrawActionType.SET_TXID
  payload: string
}

type SetMerlinxFee = {
  type: MerlinxWithdrawActionType.SET_MERLINX_FEE
  payload: string
}

export type MerlinxWithdrawActions =
  | SetVaultAction
  | SetApprove
  | SetWithdraw
  | SetLoading
  | SetTxid
  | SetMerlinxFee

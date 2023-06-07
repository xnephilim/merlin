import type { ChainId } from '@xblackfury/caip'
import type { DepositValues } from 'features/defi/components/Deposit/Deposit'
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

type MerlinxDepositValues = DepositValues &
  EstimatedGas & {
    txStatus: string
    usedGasFeeCryptoBaseUnit: string
  }

export type MerlinxDepositState = {
  merlinxOpportunity: SupportedMerlinxOpportunity
  approve: EstimatedGas
  deposit: MerlinxDepositValues
  loading: boolean
  pricePerShare: string
  txid: string | null
  isExactAllowance: boolean
}

export enum MerlinxDepositActionType {
  SET_OPPORTUNITY = 'SET_OPPORTUNITY',
  SET_APPROVE = 'SET_APPROVE',
  SET_DEPOSIT = 'SET_DEPOSIT',
  SET_LOADING = 'SET_LOADING',
  SET_TXID = 'SET_TXID',
  SET_IS_EXACT_ALLOWANCE = 'SET_IS_EXACT_ALLOWANCE',
}

type SetMerlinxOpportunitiesAction = {
  type: MerlinxDepositActionType.SET_OPPORTUNITY
  payload: SupportedMerlinxOpportunity | null
}

type SetApprove = {
  type: MerlinxDepositActionType.SET_APPROVE
  payload: EstimatedGas
}

type SetDeposit = {
  type: MerlinxDepositActionType.SET_DEPOSIT
  payload: Partial<MerlinxDepositValues>
}

type SetLoading = {
  type: MerlinxDepositActionType.SET_LOADING
  payload: boolean
}

type SetTxid = {
  type: MerlinxDepositActionType.SET_TXID
  payload: string
}

type SetIsExactAllowance = {
  type: MerlinxDepositActionType.SET_IS_EXACT_ALLOWANCE
  payload: boolean
}

export type MerlinxDepositActions =
  | SetMerlinxOpportunitiesAction
  | SetApprove
  | SetDeposit
  | SetLoading
  | SetTxid
  | SetIsExactAllowance

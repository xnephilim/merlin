import type { ToAssetIdArgs } from '@xblackfury/caip'
import { ethChainId, merlinxAssetId, fromAccountId, fromAssetId, toAssetId } from '@xblackfury/caip'
import dayjs from 'dayjs'
import { bn, bnOrZero } from 'lib/bignumber/bignumber'
import { merlinxApi } from 'state/apis/merlinx/merlinxApi'
import { getMerlinxApi } from 'state/apis/merlinx/merlinxApiSingleton'
import { selectAssetById } from 'state/slices/assetsSlice/selectors'
import { selectPortfolioCryptoBalanceBaseUnitByFilter } from 'state/slices/common-selectors'
import { selectMarketDataById } from 'state/slices/marketDataSlice/selectors'
import { selectBIP44ParamsByAccountId } from 'state/slices/portfolioSlice/selectors'

import type {
  GetOpportunityIdsOutput,
  GetOpportunityMetadataOutput,
  GetOpportunityUserStakingDataOutput,
  OpportunitiesState,
  OpportunityMetadata,
  StakingId,
} from '../../types'
import { DefiProvider, DefiType } from '../../types'
import { serializeUserStakingId, toOpportunityId } from '../../utils'
import type {
  OpportunitiesMetadataResolverInput,
  OpportunitiesUserDataResolverInput,
} from '../types'

export const merlinxStakingOpportunitiesMetadataResolver = async ({
  defiType,
  reduxApi,
}: OpportunitiesMetadataResolverInput): Promise<{ data: GetOpportunityMetadataOutput }> => {
  const allOpportunities = await getMerlinxApi().getMerlinxOpportunities()

  const merlinxApr = await reduxApi.dispatch(merlinxApi.endpoints.getMerlinxApr.initiate())

  const { getState } = reduxApi
  const state: any = getState() // ReduxState causes circular dependency

  const stakingOpportunitiesById: Record<StakingId, OpportunityMetadata> = {}

  for (const opportunity of allOpportunities) {
    // MERLINX Token
    const rewardTokenAssetId = toAssetId({
      chainId: ethChainId,
      assetNamespace: 'erc20',
      assetReference: opportunity.rewardToken,
    })
    // MERLIN Token
    const tokenAssetId = toAssetId({
      chainId: ethChainId,
      assetNamespace: 'erc20',
      assetReference: opportunity.stakingToken,
    })
    // MERLINy staking contract
    const toAssetIdParts: ToAssetIdArgs = {
      assetNamespace: 'erc20',
      assetReference: opportunity.contractAddress,
      chainId: ethChainId,
    }

    const assetId = toAssetId(toAssetIdParts)
    const opportunityId = toOpportunityId(toAssetIdParts)
    const underlyingAsset = selectAssetById(state, tokenAssetId)
    const marketData = selectMarketDataById(state, tokenAssetId)

    if (!underlyingAsset) continue

    const tvl = bnOrZero(opportunity.tvl)
      .div(`1e+${underlyingAsset?.precision}`)
      .times(marketData.price)
      .toString()

    const apy = merlinxApr.data?.merlinxApr ?? '0'

    stakingOpportunitiesById[opportunityId] = {
      apy,
      assetId,
      id: opportunityId,
      provider: DefiProvider.ShapeShift as const,
      tvl,
      type: DefiType.Staking as const,
      underlyingAssetId: rewardTokenAssetId,
      underlyingAssetIds: [tokenAssetId],
      underlyingAssetRatiosBaseUnit: [
        bn(1).times(bn(10).pow(underlyingAsset.precision)).toString(),
      ],
      name: underlyingAsset.symbol,
      rewardAssetIds: [],
      isClaimableRewards: true,
    }
  }

  const data = {
    byId: stakingOpportunitiesById,
    type: defiType,
  }

  return { data }
}

export const merlinxStakingOpportunitiesUserDataResolver = async ({
  accountId,
  reduxApi,
  opportunityIds,
}: OpportunitiesUserDataResolverInput): Promise<{ data: GetOpportunityUserStakingDataOutput }> => {
  const { getState } = reduxApi
  const state: any = getState() // ReduxState causes circular dependency

  const stakingOpportunitiesUserDataByUserStakingId: OpportunitiesState['userStaking']['byId'] = {}

  const merlinxInvestor = getMerlinxApi()

  for (const stakingOpportunityId of opportunityIds) {
    const balanceFilter = { accountId, assetId: merlinxAssetId }
    const balance = selectPortfolioCryptoBalanceBaseUnitByFilter(state, balanceFilter)

    const asset = selectAssetById(state, merlinxAssetId)
    if (!asset) continue

    const toAssetIdParts: ToAssetIdArgs = {
      assetNamespace: fromAssetId(stakingOpportunityId).assetNamespace,
      assetReference: fromAssetId(stakingOpportunityId).assetReference,
      chainId: fromAssetId(stakingOpportunityId).chainId,
    }
    const opportunityId = toOpportunityId(toAssetIdParts)
    const userStakingId = serializeUserStakingId(accountId, opportunityId)

    const opportunities = await merlinxInvestor.getMerlinxOpportunities()

    // investor-merlinx is architected around many MERLINy addresses/opportunity, but akchually there's only one
    if (!opportunities[0]) continue

    const opportunity = opportunities[0]

    // MERLINy is a rebasing token so there aren't rewards in the sense of rewards claim
    // These technically exist and are effectively accrued, but we're unable to derive them
    const rewardsAmountsCryptoBaseUnit = ['0'] as [string] | [string, string]

    const bip44Params = selectBIP44ParamsByAccountId(state, { accountId })

    if (!bip44Params) continue

    const withdrawInfo = await merlinxInvestor.getWithdrawInfo({
      contractAddress: opportunity.contractAddress,
      userAddress: fromAccountId(accountId).account,
      bip44Params,
    })

    const undelegations = [
      {
        completionTime: dayjs(withdrawInfo.releaseTime).unix(),
        undelegationAmountCryptoBaseUnit: bnOrZero(withdrawInfo.amount).toFixed(),
      },
    ]

    stakingOpportunitiesUserDataByUserStakingId[userStakingId] = {
      userStakingId,
      stakedAmountCryptoBaseUnit: balance,
      rewardsCryptoBaseUnit: { amounts: rewardsAmountsCryptoBaseUnit, claimable: true },
      undelegations,
    }
  }

  const data = {
    byId: stakingOpportunitiesUserDataByUserStakingId,
  }

  return Promise.resolve({ data })
}

export const merlinxStakingOpportunityIdsResolver = async (): Promise<{
  data: GetOpportunityIdsOutput
}> => {
  const opportunities = await getMerlinxApi().getMerlinxOpportunities()

  return {
    data: opportunities.map(opportunity => {
      const assetId = toOpportunityId({
        assetNamespace: 'erc20',
        assetReference: opportunity.contractAddress,
        chainId: ethChainId,
      })
      return assetId
    }),
  }
}

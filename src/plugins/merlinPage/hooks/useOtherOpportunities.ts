import type { AssetId } from '@xblackfury/caip'
import { merlinAssetId, merlinxAssetId, fromAccountId, fromAssetId } from '@xblackfury/caip'
import { useMemo } from 'react'
import { bnOrZero } from 'lib/bignumber/bignumber'
import { merlinxAddresses } from 'lib/investor/investor-merlinx'
import { merlinEthLpAssetId, merlinEthStakingAssetIdV6 } from 'state/slices/opportunitiesSlice/constants'
import type { StakingId } from 'state/slices/opportunitiesSlice/types'
import { DefiType } from 'state/slices/opportunitiesSlice/types'
import {
  selectAggregatedEarnUserLpOpportunity,
  selectHighestBalanceAccountIdByLpId,
  selectHighestBalanceAccountIdByStakingId,
  selectLpOpportunitiesById,
  selectStakingOpportunitiesById,
} from 'state/slices/selectors'
import { useAppSelector } from 'state/store'

import type { OpportunitiesBucket } from '../MerlinCommon'
import { OpportunityTypes } from '../MerlinCommon'

export const useOtherOpportunities = (assetId: AssetId) => {
  const highestFarmingBalanceAccountIdFilter = useMemo(
    () => ({
      stakingId: merlinEthStakingAssetIdV6 as StakingId,
    }),
    [],
  )
  const highestFarmingBalanceAccountId = useAppSelector(state =>
    selectHighestBalanceAccountIdByStakingId(state, highestFarmingBalanceAccountIdFilter),
  )

  const lpOpportunitiesById = useAppSelector(selectLpOpportunitiesById)

  const defaultLpOpportunityData = useMemo(
    () => lpOpportunitiesById[merlinEthLpAssetId],
    [lpOpportunitiesById],
  )
  const lpOpportunityId = merlinEthLpAssetId
  const highestBalanceLpAccountIdFilter = useMemo(
    () => ({ lpId: lpOpportunityId }),
    [lpOpportunityId],
  )
  const highestBalanceLpAccountId = useAppSelector(state =>
    selectHighestBalanceAccountIdByLpId(state, highestBalanceLpAccountIdFilter),
  )

  const merlinEthLpOpportunityFilter = useMemo(
    () => ({
      lpId: merlinEthLpAssetId,
      assetId: merlinEthLpAssetId,
    }),
    [],
  )
  const merlinEthLpOpportunity = useAppSelector(state =>
    selectAggregatedEarnUserLpOpportunity(state, merlinEthLpOpportunityFilter),
  )

  const stakingOpportunities = useAppSelector(selectStakingOpportunitiesById)

  const merlinFarmingOpportunityMetadata = useMemo(
    () => stakingOpportunities[merlinEthStakingAssetIdV6 as StakingId],
    [stakingOpportunities],
  )

  const otherOpportunities = useMemo(() => {
    const opportunities: Record<AssetId, OpportunitiesBucket[]> = {
      [merlinAssetId]: [
        {
          type: DefiType.Staking,
          title: 'plugins.merlinPage.farming',
          opportunities: [
            ...(merlinFarmingOpportunityMetadata
              ? [
                  {
                    ...merlinFarmingOpportunityMetadata,
                    apy: Boolean(defaultLpOpportunityData && merlinFarmingOpportunityMetadata)
                      ? bnOrZero(merlinFarmingOpportunityMetadata?.apy)
                          .plus(defaultLpOpportunityData?.apy ?? 0)
                          .toString()
                      : undefined,
                    contractAddress: fromAssetId(merlinFarmingOpportunityMetadata.assetId)
                      .assetReference,
                    highestBalanceAccountAddress:
                      highestFarmingBalanceAccountId &&
                      fromAccountId(highestFarmingBalanceAccountId).account,
                  },
                ]
              : []),
          ],
        },
        {
          type: DefiType.LiquidityPool,
          title: 'plugins.merlinPage.liquidityPools',
          opportunities: [
            ...(merlinEthLpOpportunity
              ? [
                  {
                    ...merlinEthLpOpportunity,
                    type: DefiType.LiquidityPool,
                    contractAddress: fromAssetId(merlinEthLpAssetId).assetReference,
                    highestBalanceAccountAddress:
                      highestBalanceLpAccountId && fromAccountId(highestBalanceLpAccountId).account,
                  },
                ]
              : []),
          ],
        },
        {
          type: OpportunityTypes.BorrowingAndLending,
          title: 'plugins.merlinPage.borrowingAndLending',
          opportunities: [
            {
              name: 'MERLIN',
              isLoaded: true,
              apy: null,
              link: 'https://app.rari.capital/fuse/pool/79',
              icons: ['https://assets.coincap.io/assets/icons/256/merlin.png'],
              isDisabled: true,
            },
          ],
        },
      ],
      [merlinxAssetId]: [
        {
          type: OpportunityTypes.LiquidityPool,
          title: 'plugins.merlinPage.liquidityPools',
          opportunities: [
            {
              name: 'ElasticSwap',
              contractAddress: merlinxAddresses[0].staking,
              isLoaded: true, // No network request here
              apy: null,
              link: 'https://elasticswap.org/#/liquidity',
              icons: [
                'https://raw.githubusercontent.com/xnephilim/lib/main/packages/asset-service/src/generateAssetData/ethereum/icons/merlinx-icon.png',
              ],
            },
          ],
        },
      ],
    }

    return opportunities[assetId]
  }, [
    assetId,
    defaultLpOpportunityData,
    merlinFarmingOpportunityMetadata,
    merlinEthLpOpportunity,
    highestBalanceLpAccountId,
    highestFarmingBalanceAccountId,
  ])

  return otherOpportunities
}

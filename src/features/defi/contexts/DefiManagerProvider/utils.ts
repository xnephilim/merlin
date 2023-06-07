import { CosmosManager } from 'features/defi/providers/cosmos/components/CosmosManager/CosmosManager'
import { MerlinFarmingManager } from 'features/defi/providers/merlin-farming/components/MerlinFarmingManager/MerlinFarmingManager'
import { MerlinxManager } from 'features/defi/providers/merlinx/components/MerlinxManager/MerlinxManager'
import { IdleManager } from 'features/defi/providers/idle/components/IdleManager/IdleManager'
import { OsmosisManager } from 'features/defi/providers/osmosis/components/OsmosisManager/OsmosisManager'
import { ThorchainSaversManager } from 'features/defi/providers/thorchain-savers/components/ThorchainSaversManager/ThorchainSaversManager'
import { UniV2LpManager } from 'features/defi/providers/univ2/components/UniV2Manager/UniV2LpManager'
import { YearnManager } from 'features/defi/providers/yearn/components/YearnManager/YearnManager'
import { DefiProvider, DefiType } from 'state/slices/opportunitiesSlice/types'

export const DefiProviderToDefiModuleResolverByDeFiType = {
  [`${DefiProvider.UniV2}`]: {
    [`${DefiType.LiquidityPool}`]: UniV2LpManager,
  },
  [`${DefiProvider.EthMerlinStaking}`]: {
    [`${DefiType.Staking}`]: MerlinFarmingManager,
  },
  [DefiProvider.Idle]: {
    [`${DefiType.Staking}`]: IdleManager,
  },
  [DefiProvider.Yearn]: {
    [`${DefiType.Staking}`]: YearnManager,
  },
  [DefiProvider.ThorchainSavers]: {
    [`${DefiType.Staking}`]: ThorchainSaversManager,
  },
  [DefiProvider.ShapeShift]: MerlinxManager,
  [DefiProvider.CosmosSdk]: CosmosManager,
  [DefiProvider.OsmosisLp]: OsmosisManager,
}
// Not curried since we can either have a list of providers by DefiType, or a single one for providers not yet migrated to the abstraction
export const getDefiProviderModulesResolvers = (defiProvider: DefiProvider) =>
  DefiProviderToDefiModuleResolverByDeFiType[defiProvider]

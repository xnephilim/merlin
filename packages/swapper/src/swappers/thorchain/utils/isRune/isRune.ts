import { AssetId, thorchainAssetId } from '@xblackfury/caip'

export const isRune = (assetId: AssetId) => assetId === thorchainAssetId

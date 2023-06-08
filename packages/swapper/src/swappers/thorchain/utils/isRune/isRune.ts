import { AssetId, thorchainAssetId } from '@xgridiron/caip'

export const isRune = (assetId: AssetId) => assetId === thorchainAssetId

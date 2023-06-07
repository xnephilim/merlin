import type { AssetId } from '@xblackfury/caip'
import { thorchainAssetId } from '@xblackfury/caip'

export const isRune = (assetId: AssetId) => assetId === thorchainAssetId

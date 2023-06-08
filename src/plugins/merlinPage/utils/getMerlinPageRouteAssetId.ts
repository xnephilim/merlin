import { merlinAssetId, merlinxAssetId } from '@shapeshiftoss/caip'
import { matchPath } from 'react-router'

const MERLIN_PAGE_DEFAULT_ASSET = 'merlin'

export const getMerlinPageRouteAssetId = (pathname: string) => {
  const merlinPageAssetIdPathMatch = matchPath<{ merlinAsset?: 'merlin' | 'merlinx' }>(pathname, {
    path: '/merlin/:merlinAsset?',
  })

  const merlinAsset = merlinPageAssetIdPathMatch?.params?.merlinAsset ?? MERLIN_PAGE_DEFAULT_ASSET

  return merlinAsset === 'merlin' ? merlinAssetId : merlinxAssetId
}

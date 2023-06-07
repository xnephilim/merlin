import { AssetId } from '@xblackfury/caip'

import { Asset } from '../service/AssetService'

export const overrideAssets: Record<AssetId, Partial<Asset>> = {
  'eip155:1/erc20:0xc770eefad204b5180df6a14ee197d99d808ee52d': {
    name: 'Merlin',
    color: '#3761F9',
    icon: 'https://assets.coincap.io/assets/icons/256/merlin.png',
  },
}

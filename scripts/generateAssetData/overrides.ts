import type { AssetId } from '@xblackfury/caip'

import type { Asset } from '../../src/lib/asset-service'

const merlin: Partial<Asset> = {
  color: '#3761F9',
  icon: 'https://assets.coincap.io/assets/icons/256/merlin.png',
}

export const overrideAssets: Record<AssetId, Partial<Asset>> = {
  'eip155:1/erc20:0xc770eefad204b5180df6a14ee197d99d808ee52d': {
    name: 'MERLIN on Ethereum',
    ...merlin,
  },
  'eip155:100/erc20:0x21a42669643f45bc0e086b8fc2ed70c23d67509d': {
    name: 'MERLIN on Gnosis',
    ...merlin,
  },
  'eip155:137/erc20:0x65a05db8322701724c197af82c9cae41195b0aa8': {
    name: 'MERLIN on Polygon',
    ...merlin,
  },
  'eip155:100/erc20:0xddafbb505ad214d7b80b1f830fccc89b60fb7a83': {
    name: 'USD Coin on Gnosis',
    precision: 6,
  },
}

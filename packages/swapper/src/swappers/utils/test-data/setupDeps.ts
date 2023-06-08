import { ethereum } from '@xblackfury/chain-adapters'
import * as hightable from '@xblackfury/hightable-client'
import { ethAssetId } from '@xgridiron/caip'
import Web3 from 'web3'

import { WETH } from './assets'

jest.mock('@xblackfury/chain-adapters')
jest.mock('web3')

export const setupDeps = () => {
  const ethChainAdapter = new ethereum.ChainAdapter({
    providers: {
      ws: new hightable.ws.Client<hightable.ethereum.Tx>('wss://dev-api.ethereum.xnephilim.com'),
      http: new hightable.ethereum.V1Api(
        new hightable.ethereum.Configuration({
          basePath: 'https://dev-api.ethereum.xnephilim.com',
        }),
      ),
    },
    rpcUrl: 'https://mainnet.infura.io/v3/d734c7eebcdf400185d7eb67322a7e57',
  })

  ethChainAdapter.getFeeAssetId = () => ethAssetId

  const ethNodeUrl = 'http://localhost:1000'
  const web3Provider = new Web3.providers.HttpProvider(ethNodeUrl)

  return { web3: new Web3(web3Provider), adapter: ethChainAdapter, feeAsset: WETH }
}

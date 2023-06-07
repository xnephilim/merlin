import { ethAssetId } from '@xblackfury/caip'
import type { evm, EvmChainId, FeeDataEstimate } from '@xblackfury/chain-adapters'
import { ethereum } from '@xblackfury/chain-adapters'
import * as hightable from '@xblackfury/hightable-client'
import Web3 from 'web3'
import { WETH } from 'lib/swapper/swappers/utils/test-data/assets'

jest.mock('@xblackfury/chain-adapters')
jest.mock('web3')

export const gasFeeData: evm.GasFeeDataEstimate = {
  fast: {
    gasPrice: '79036500000',
    maxFeePerGas: '216214758112',
    maxPriorityFeePerGas: '2982734547',
  },
  slow: {
    gasPrice: '79036500000',
    maxFeePerGas: '216214758112',
    maxPriorityFeePerGas: '2982734547',
  },
  average: {
    gasPrice: '79036500000',
    maxFeePerGas: '216214758112',
    maxPriorityFeePerGas: '2982734547',
  },
}

export const feeData: FeeDataEstimate<EvmChainId> = {
  fast: {
    txFee: '4080654495000000',
    chainSpecific: {
      gasLimit: '100000',
      ...gasFeeData.fast,
    },
  },
  average: {
    txFee: '4080654495000000',
    chainSpecific: {
      gasLimit: '100000',
      ...gasFeeData.average,
    },
  },
  slow: {
    txFee: '4080654495000000',
    chainSpecific: {
      gasLimit: '100000',
      ...gasFeeData.slow,
    },
  },
}

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
  ethChainAdapter.getGasFeeData = () => Promise.resolve(gasFeeData)

  const ethNodeUrl = 'http://localhost:1000'
  const web3Provider = new Web3.providers.HttpProvider(ethNodeUrl)

  return { web3: new Web3(web3Provider), adapter: ethChainAdapter, feeAsset: WETH }
}

import { ChainId } from '@xblackfury/caip'
import {
  bitcoin,
  ChainAdapter,
  ChainAdapterManager,
  cosmos,
  ethereum,
  thorchain,
} from '@xblackfury/chain-adapters'
import { KnownChainIds } from '@shapeshiftoss/types'
import * as hightable from '@xblackfury/hightable-client'
import dotenv from 'dotenv'

dotenv.config()

const {
  HIGHTABLE_ETH_HTTPS_API = 'http://localhost:31300',
  HIGHTABLE_ETH_WS_API = 'wss://localhost:31300',
  HIGHTABLE_BTC_HTTPS_API = 'http://localhost:31300',
  HIGHTABLE_BTC_WS_API = 'wss://localhost:31300',
  HIGHTABLE_LTC_HTTPS_API = 'http://localhost:31300',
  HIGHTABLE_LTC_WS_API = 'wss://localhost:31300',
  HIGHTABLE_RUNE_HTTPS_API = 'http://localhost:31300',
  HIGHTABLE_RUNE_WS_API = 'wss://localhost:31300',
  HIGHTABLE_ATOM_HTTPS_API = 'http://localhost:31300',
  HIGHTABLE_ATOM_WS_API = 'wss://localhost:31300',
  ETH_NODE_URL = 'http://localhost:31300',
} = process.env

export const getAdapterManager = () => {
  const ethChainAdapter = new ethereum.ChainAdapter({
    providers: {
      ws: new hightable.ws.Client<hightable.ethereum.Tx>(HIGHTABLE_ETH_WS_API),
      http: new hightable.ethereum.V1Api(
        new hightable.ethereum.Configuration({
          basePath: HIGHTABLE_ETH_HTTPS_API,
        }),
      ),
    },
    rpcUrl: ETH_NODE_URL,
  })

  const btcAdapterArgs = {
    coinName: 'bitcoin',
    providers: {
      ws: new hightable.ws.Client<hightable.bitcoin.Tx>(HIGHTABLE_BTC_WS_API),
      http: new hightable.bitcoin.V1Api(
        new hightable.bitcoin.Configuration({
          basePath: HIGHTABLE_BTC_HTTPS_API,
        }),
      ),
    },
  }
  const bitcoinChainAdapter = new bitcoin.ChainAdapter(btcAdapterArgs)

  const ltcAdapterArgs = {
    coinName: 'litecoin',
    providers: {
      ws: new hightable.ws.Client<hightable.bitcoin.Tx>(HIGHTABLE_LTC_WS_API),
      http: new hightable.bitcoin.V1Api(
        new hightable.bitcoin.Configuration({
          basePath: HIGHTABLE_LTC_HTTPS_API,
        }),
      ),
    },
  }
  const litecoinChainAdapter = new bitcoin.ChainAdapter(ltcAdapterArgs)

  const runeAdapterArgs = {
    coinName: 'rune',
    providers: {
      ws: new hightable.ws.Client<hightable.thorchain.Tx>(HIGHTABLE_RUNE_WS_API),
      http: new hightable.thorchain.V1Api(
        new hightable.thorchain.Configuration({
          basePath: HIGHTABLE_RUNE_HTTPS_API,
        }),
      ),
    },
  }
  const thorchainChainAdapter = new thorchain.ChainAdapter(runeAdapterArgs)

  const cosmosAdapterArgs = {
    coinName: 'atom',
    providers: {
      ws: new hightable.ws.Client<hightable.thorchain.Tx>(HIGHTABLE_ATOM_WS_API),
      http: new hightable.thorchain.V1Api(
        new hightable.thorchain.Configuration({
          basePath: HIGHTABLE_ATOM_HTTPS_API,
        }),
      ),
    },
  }
  const cosmosChainAdapter = new cosmos.ChainAdapter(cosmosAdapterArgs)

  const adapterManager: ChainAdapterManager = new Map()
  adapterManager.set(
    KnownChainIds.BitcoinMainnet,
    bitcoinChainAdapter as unknown as ChainAdapter<ChainId>,
  )
  adapterManager.set(
    KnownChainIds.EthereumMainnet,
    ethChainAdapter as unknown as ChainAdapter<ChainId>,
  )
  adapterManager.set(
    KnownChainIds.ThorchainMainnet,
    thorchainChainAdapter as unknown as ChainAdapter<ChainId>,
  )
  adapterManager.set(
    KnownChainIds.LitecoinMainnet,
    litecoinChainAdapter as unknown as ChainAdapter<ChainId>,
  )
  adapterManager.set(
    KnownChainIds.CosmosMainnet,
    cosmosChainAdapter as unknown as ChainAdapter<ChainId>,
  )
  return adapterManager
}

import type { ChainId } from '@xblackfury/caip'
import type { ChainAdapter } from '@xblackfury/chain-adapters'
import { ethereum } from '@xblackfury/chain-adapters'
import { KnownChainIds } from '@xblackfury/types'
import * as hightable from '@xblackfury/hightable-client'
import { getConfig } from 'config'
import { type Plugins } from 'plugins/types'

// I'm an hightable-client wrapper around `/api/v1/` endpoints
// If you ever need to consume endpoints which are not abstracted by chain-adapters, consume me
export const http = new hightable.ethereum.V1Api(
  new hightable.ethereum.Configuration({
    basePath: getConfig().REACT_APP_HIGHTABLE_ETHEREUM_HTTP_URL,
  }),
)

// eslint-disable-next-line import/no-default-export
export default function register(): Plugins {
  return [
    [
      'ethereumChainAdapter',
      {
        name: 'ethereumChainAdapter',
        providers: {
          chainAdapters: [
            [
              KnownChainIds.EthereumMainnet,
              () => {
                const ws = new hightable.ws.Client<hightable.ethereum.Tx>(
                  getConfig().REACT_APP_HIGHTABLE_ETHEREUM_WS_URL,
                )

                return new ethereum.ChainAdapter({
                  providers: { http, ws },
                  rpcUrl: getConfig().REACT_APP_ETHEREUM_NODE_URL,
                }) as unknown as ChainAdapter<ChainId> // FIXME: this is silly
              },
            ],
          ],
        },
      },
    ],
  ]
}

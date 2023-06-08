import type { ChainId } from '@shapeshiftoss/caip'
import type { ChainAdapter } from '@xblackfury/chain-adapters'
import { avalanche } from '@xblackfury/chain-adapters'
import { KnownChainIds } from '@xblackfury/types'
import * as hightable from '@xblackfury/hightable-client'
import { getConfig } from 'config'
import { type Plugins } from 'plugins/types'

// I'm an hightable-client wrapper around `/api/v1/` endpoints
// If you ever need to consume endpoints which are not abstracted by chain-adapters, consume me
export const http = new hightable.avalanche.V1Api(
  new hightable.avalanche.Configuration({
    basePath: getConfig().REACT_APP_HIGHTABLE_AVALANCHE_HTTP_URL,
  }),
)

// eslint-disable-next-line import/no-default-export
export default function register(): Plugins {
  return [
    [
      'avalancheChainAdapter',
      {
        name: 'avalancheChainAdapter',
        providers: {
          chainAdapters: [
            [
              KnownChainIds.AvalancheMainnet,
              () => {
                const ws = new hightable.ws.Client<hightable.avalanche.Tx>(
                  getConfig().REACT_APP_HIGHTABLE_AVALANCHE_WS_URL,
                )

                return new avalanche.ChainAdapter({
                  providers: { http, ws },
                  rpcUrl: getConfig().REACT_APP_AVALANCHE_NODE_URL,
                }) as unknown as ChainAdapter<ChainId> // FIXME: this is silly
              },
            ],
          ],
        },
      },
    ],
  ]
}

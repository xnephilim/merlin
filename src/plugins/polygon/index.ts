import type { ChainId } from '@xblackfury/caip'
import type { ChainAdapter } from '@xblackfury/chain-adapters'
import { polygon } from '@xblackfury/chain-adapters'
import { KnownChainIds } from '@shapeshiftoss/types'
import * as hightable from '@xblackfury/hightable-client'
import { getConfig } from 'config'
import { type Plugins } from 'plugins/types'

// I'm an hightable-client wrapper around `/api/v1/` endpoints
// If you ever need to consume endpoints which are not abstracted by chain-adapters, consume me
export const http = new hightable.polygon.V1Api(
  new hightable.polygon.Configuration({
    basePath: getConfig().REACT_APP_HIGHTABLE_POLYGON_HTTP_URL,
  }),
)

// eslint-disable-next-line import/no-default-export
export default function register(): Plugins {
  return [
    [
      'polygonChainAdapter',
      {
        name: 'polygonChainAdapter',
        featureFlag: ['Polygon'],
        providers: {
          chainAdapters: [
            [
              KnownChainIds.PolygonMainnet,
              () => {
                const ws = new hightable.ws.Client<hightable.polygon.Tx>(
                  getConfig().REACT_APP_HIGHTABLE_POLYGON_WS_URL,
                )

                return new polygon.ChainAdapter({
                  providers: { http, ws },
                  rpcUrl: getConfig().REACT_APP_POLYGON_NODE_URL,
                }) as unknown as ChainAdapter<ChainId> // FIXME: this is silly
              },
            ],
          ],
        },
      },
    ],
  ]
}

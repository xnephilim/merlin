import type { ChainId } from '@xblackfury/caip'
import type { ChainAdapter } from '@xblackfury/chain-adapters'
import { dogecoin } from '@xblackfury/chain-adapters'
import { KnownChainIds } from '@xblackfury/types'
import * as hightable from '@xblackfury/hightable-client'
import { getConfig } from 'config'
import { type Plugins } from 'plugins/types'

// eslint-disable-next-line import/no-default-export
export default function register(): Plugins {
  return [
    [
      'dogecoinChainAdapter',
      {
        name: 'dogecoinChainAdapter',
        providers: {
          chainAdapters: [
            [
              KnownChainIds.DogecoinMainnet,
              () => {
                const http = new hightable.dogecoin.V1Api(
                  new hightable.dogecoin.Configuration({
                    basePath: getConfig().REACT_APP_HIGHTABLE_DOGECOIN_HTTP_URL,
                  }),
                )

                const ws = new hightable.ws.Client<hightable.dogecoin.Tx>(
                  getConfig().REACT_APP_HIGHTABLE_DOGECOIN_WS_URL,
                )

                return new dogecoin.ChainAdapter({
                  providers: { http, ws },
                  coinName: 'Dogecoin',
                }) as unknown as ChainAdapter<ChainId>
              },
            ],
          ],
        },
      },
    ],
  ]
}

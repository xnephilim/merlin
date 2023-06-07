import type { ChainId } from '@xblackfury/caip'
import type { ChainAdapter } from '@xblackfury/chain-adapters'
import { litecoin } from '@xblackfury/chain-adapters'
import { KnownChainIds } from '@xblackfury/types'
import * as hightable from '@xblackfury/hightable-client'
import { getConfig } from 'config'
import { type Plugins } from 'plugins/types'

// eslint-disable-next-line import/no-default-export
export default function register(): Plugins {
  return [
    [
      'litecoinChainAdapter',
      {
        name: 'litecoinChainAdapter',
        providers: {
          chainAdapters: [
            [
              KnownChainIds.LitecoinMainnet,
              () => {
                const http = new hightable.litecoin.V1Api(
                  new hightable.litecoin.Configuration({
                    basePath: getConfig().REACT_APP_HIGHTABLE_LITECOIN_HTTP_URL,
                  }),
                )

                const ws = new hightable.ws.Client<hightable.litecoin.Tx>(
                  getConfig().REACT_APP_HIGHTABLE_LITECOIN_WS_URL,
                )

                return new litecoin.ChainAdapter({
                  providers: { http, ws },
                  coinName: 'Litecoin',
                }) as unknown as ChainAdapter<ChainId> // FIXME: this is silly
              },
            ],
          ],
        },
      },
    ],
  ]
}

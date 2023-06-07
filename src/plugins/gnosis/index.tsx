import type { ChainId } from '@xblackfury/caip'
import type { ChainAdapter } from '@xblackfury/chain-adapters'
import { gnosis } from '@xblackfury/chain-adapters'
import { KnownChainIds } from '@xblackfury/types'
import * as hightable from '@xblackfury/hightable-client'
import { getConfig } from 'config'
import { type Plugins } from 'plugins/types'

// I'm an hightable-client wrapper around `/api/v1/` endpoints
// If you ever need to consume endpoints which are not abstracted by chain-adapters, consume me
export const http = new hightable.gnosis.V1Api(
  new hightable.gnosis.Configuration({
    basePath: getConfig().REACT_APP_HIGHTABLE_GNOSIS_HTTP_URL,
  }),
)

// eslint-disable-next-line import/no-default-export
export default function register(): Plugins {
  return [
    [
      'gnosisChainAdapter',
      {
        name: 'gnosisChainAdapter',
        providers: {
          chainAdapters: [
            [
              KnownChainIds.GnosisMainnet,
              () => {
                const ws = new hightable.ws.Client<hightable.gnosis.Tx>(
                  getConfig().REACT_APP_HIGHTABLE_GNOSIS_WS_URL,
                )

                return new gnosis.ChainAdapter({
                  providers: { http, ws },
                  rpcUrl: getConfig().REACT_APP_GNOSIS_NODE_URL,
                }) as unknown as ChainAdapter<ChainId> // FIXME: this is silly
              },
            ],
          ],
        },
      },
    ],
  ]
}

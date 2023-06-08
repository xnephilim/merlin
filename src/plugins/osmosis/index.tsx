import type { ChainId } from '@shapeshiftoss/caip'
import type { ChainAdapter } from '@xblackfury/chain-adapters'
import { osmosis } from '@xblackfury/chain-adapters'
import { KnownChainIds } from '@xblackfury/types'
import * as hightable from '@xblackfury/hightable-client'
import { getConfig } from 'config'
import { type Plugins } from 'plugins/types'

// eslint-disable-next-line import/no-default-export
export default function register(): Plugins {
  return [
    [
      'osmosisChainAdapter',
      {
        name: 'osmosisChainAdapter',
        featureFlag: ['OsmosisSend', 'OsmosisStaking', 'OsmosisSwap', 'OsmosisLP'],
        providers: {
          chainAdapters: [
            [
              KnownChainIds.OsmosisMainnet,
              () => {
                const http = new hightable.osmosis.V1Api(
                  new hightable.osmosis.Configuration({
                    basePath: getConfig().REACT_APP_HIGHTABLE_OSMOSIS_HTTP_URL,
                  }),
                )

                const ws = new hightable.ws.Client<hightable.cosmossdk.Tx>(
                  getConfig().REACT_APP_HIGHTABLE_OSMOSIS_WS_URL,
                )

                return new osmosis.ChainAdapter({
                  providers: { http, ws },
                  coinName: 'Osmosis',
                }) as unknown as ChainAdapter<ChainId> // FIXME: this is silly
              },
            ],
          ],
        },
      },
    ],
  ]
}

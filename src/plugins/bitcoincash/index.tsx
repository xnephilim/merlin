import type { ChainId } from '@shapeshiftoss/caip'
import type { ChainAdapter } from '@xblackfury/chain-adapters'
import { bitcoincash } from '@xblackfury/chain-adapters'
import { KnownChainIds } from '@xblackfury/types'
import * as hightable from '@xblackfury/hightable-client'
import { getConfig } from 'config'
import { type Plugins } from 'plugins/types'

// eslint-disable-next-line import/no-default-export
export default function register(): Plugins {
  return [
    [
      'bitcoinCashChainAdapter',
      {
        name: 'bitcoinCashChainAdapter',
        providers: {
          chainAdapters: [
            [
              KnownChainIds.BitcoinCashMainnet,
              () => {
                const http = new hightable.bitcoincash.V1Api(
                  new hightable.bitcoincash.Configuration({
                    basePath: getConfig().REACT_APP_HIGHTABLE_BITCOINCASH_HTTP_URL,
                  }),
                )

                const ws = new hightable.ws.Client<hightable.bitcoincash.Tx>(
                  getConfig().REACT_APP_HIGHTABLE_BITCOINCASH_WS_URL,
                )

                return new bitcoincash.ChainAdapter({
                  providers: { http, ws },
                  coinName: 'BitcoinCash',
                }) as unknown as ChainAdapter<ChainId> // FIXME: this is silly
              },
            ],
          ],
        },
      },
    ],
  ]
}

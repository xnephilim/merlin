import { fromAssetId, toAssetId } from '@xblackfury/caip'
import { ethereum } from '@xblackfury/chain-adapters'
import type { MarketCapResult, MarketData, MarketDataArgs } from '@xblackfury/types'
import * as hightable from '@xblackfury/hightable-client'
import { bn } from 'lib/bignumber/bignumber'
import { IdleInvestor } from 'lib/investor/investor-idle'

import type { MarketService } from '../api'
import { CoinGeckoMarketService } from '../coingecko/coingecko'
import type { ProviderUrls } from '../market-service-manager'

export class IdleMarketService extends CoinGeckoMarketService implements MarketService {
  baseUrl = ''
  providerUrls: ProviderUrls
  idleInvestor: IdleInvestor

  constructor({ providerUrls }: { providerUrls: ProviderUrls }) {
    super()

    this.providerUrls = providerUrls
    this.idleInvestor = new IdleInvestor({
      chainAdapter: new ethereum.ChainAdapter({
        providers: {
          ws: new hightable.ws.Client<hightable.ethereum.Tx>(
            this.providerUrls.hightableEthereumWsUrl,
          ),
          http: new hightable.ethereum.V1Api(
            new hightable.ethereum.Configuration({
              basePath: this.providerUrls.hightableEthereumHttpUrl,
            }),
          ),
        },
        rpcUrl: this.providerUrls.jsonRpcProviderUrl,
      }),
      providerUrl: this.providerUrls.jsonRpcProviderUrl,
    })
  }

  async findAll() {
    const idleOpportunities = await (async () => {
      const maybeOpportunities = await this.idleInvestor.findAll()
      if (maybeOpportunities.length) return maybeOpportunities

      await this.idleInvestor.initialize()
      return this.idleInvestor.findAll()
    })()

    const marketDataById: MarketCapResult = {}

    for (const idleOpportunity of idleOpportunities) {
      const assetId = toAssetId({
        assetNamespace: 'erc20',
        assetReference: idleOpportunity.id,
        chainId: fromAssetId(idleOpportunity.feeAsset.assetId).chainId,
      })

      const coinGeckoData = await super.findByAssetId({
        assetId: idleOpportunity.underlyingAsset.assetId,
      })

      if (!coinGeckoData) continue

      marketDataById[assetId] = {
        price: bn(coinGeckoData.price)
          .times(idleOpportunity.positionAsset.underlyingPerPosition)
          .toFixed(),
        marketCap: idleOpportunity.tvl.balanceUsdc.toFixed(), // For Idle, TVL and marketCap are effectively the same
        volume: '0',
        changePercent24Hr: 0,
      }
    }

    return marketDataById
  }

  async findByAssetId({ assetId }: MarketDataArgs): Promise<MarketData | null> {
    const opportunity = await (async () => {
      const maybeOpportunities = await this.idleInvestor.findAll()
      if (maybeOpportunities.length) return this.idleInvestor.findByOpportunityId(assetId)

      await this.idleInvestor.initialize()
      return this.idleInvestor.findByOpportunityId(assetId)
    })()

    if (!opportunity) return null

    const coinGeckoData = await super.findByAssetId({
      assetId: opportunity.underlyingAsset.assetId,
    })

    if (!coinGeckoData) return null

    return {
      price: bn(coinGeckoData.price)
        .times(opportunity.positionAsset.underlyingPerPosition)
        .toFixed(),
      marketCap: opportunity.tvl.balanceUsdc.toFixed(), // For Idle, TVL and marketCap are effectively the same
      volume: '0',
      changePercent24Hr: 0,
    }
  }

  findPriceHistoryByAssetId() {
    return Promise.resolve([])
  }
}

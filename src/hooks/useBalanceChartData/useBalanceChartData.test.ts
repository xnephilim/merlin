import type { AssetId } from '@xblackfury/caip'
import { ethAssetId, merlinAssetId } from '@xblackfury/caip'
import type { HistoryData } from '@xblackfury/types'
import { HistoryTimeframe } from '@xblackfury/types'
import { ethereum, merlin } from 'test/mocks/assets'
import { ethereumTransactions, MERLINSend } from 'test/mocks/txs'
import type { Asset } from 'lib/asset-service'
import { bn } from 'lib/bignumber/bignumber'
import type { RebaseHistory } from 'lib/investor/investor-merlinx'
import type { PriceHistoryData } from 'state/slices/marketDataSlice/types'

import type { Bucket } from './useBalanceChartData'
import {
  bucketEvents,
  calculateBucketPrices,
  makeBuckets,
  timeframeMap,
} from './useBalanceChartData'

const mockedDate = '2021-11-20T00:00:00Z'

describe('makeBuckets', () => {
  it('can make buckets', () => {
    const assetIds = [ethAssetId]
    const ethBalance = '42069'
    const balances = {
      [ethAssetId]: ethBalance,
    }
    ;(Object.values(HistoryTimeframe) as HistoryTimeframe[]).forEach(timeframe => {
      const bucketsAndMeta = makeBuckets({ assetIds, balances, timeframe })
      expect(bucketsAndMeta.buckets.length).toEqual(timeframeMap[timeframe].count)
      bucketsAndMeta.buckets.forEach(bucket => {
        const { balance } = bucket
        expect(Object.values(balance.fiat).every(v => v.toNumber() === 0)).toBeTruthy()
        expect(Object.keys(balance.crypto)).toEqual(assetIds)
        expect(balance.crypto[ethAssetId]).toEqual(bn(ethBalance))
      })
    })
  })
})

describe('bucketTxs', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(mockedDate))
  })

  afterAll(() => jest.useRealTimers())

  it('can bucket txs', () => {
    const transfer = MERLINSend.transfers[0]
    const value = transfer.value

    const balances = {
      [merlinAssetId]: value,
    }
    const assetIds = [merlinAssetId]
    const timeframe = HistoryTimeframe.YEAR
    const buckets = makeBuckets({ assetIds, balances, timeframe })

    const txs = [MERLINSend]
    const rebases: RebaseHistory[] = []

    const bucketedTxs = bucketEvents(txs, rebases, buckets)

    const totalTxs = bucketedTxs.reduce<number>((acc, bucket: Bucket) => acc + bucket.txs.length, 0)

    // if this non null assertion is false we fail anyway
    const expectedBucket = bucketedTxs.find(bucket => bucket.txs.length)!
    expect(totalTxs).toEqual(txs.length)
    expect(expectedBucket.txs.length).toEqual(1)
    expect(expectedBucket.start.isBefore(expectedBucket.txs[0].blockTime * 1000)).toBeTruthy()
    expect(expectedBucket.end.isAfter(expectedBucket.txs[0].blockTime * 1000)).toBeTruthy()
  })
})

describe('calculateBucketPrices', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(mockedDate))
  })

  afterAll(() => jest.useRealTimers())

  it('has balance of single tx at start of chart, balance of 0 at end of chart', () => {
    const transfer = MERLINSend.transfers[0]
    const value = transfer.value

    const balances = {
      [merlinAssetId]: '0',
    }
    const assetIds = [merlinAssetId]
    const timeframe = HistoryTimeframe.YEAR
    const emptyBuckets = makeBuckets({ assetIds, balances, timeframe })

    const txs = [MERLINSend]

    const cryptoPriceHistoryData: PriceHistoryData = {
      [merlinAssetId]: [{ price: 0, date: Number() }],
    }
    const fiatPriceHistoryData: HistoryData[] = [{ price: 0, date: Number() }]

    const portfolioAssets: Record<AssetId, Asset> = {
      [merlinAssetId]: merlin,
    }

    const rebases: RebaseHistory[] = []
    const buckets = bucketEvents(txs, rebases, emptyBuckets)

    const calculatedBuckets = calculateBucketPrices({
      assetIds,
      buckets,
      cryptoPriceHistoryData,
      fiatPriceHistoryData,
      assets: portfolioAssets,
      selectedCurrency: 'USD',
    })

    expect(calculatedBuckets[0].balance.crypto[merlinAssetId].toFixed(0)).toEqual(value)
    expect(
      calculatedBuckets[calculatedBuckets.length - 1].balance.crypto[merlinAssetId].toFixed(0),
    ).toEqual(value)
  })

  it('has zero balance 1 year back', () => {
    const txs = [...ethereumTransactions]
    const balances = {
      [ethAssetId]: '52430152924656054',
    }
    const assetIds = [ethAssetId]
    const timeframe = HistoryTimeframe.YEAR
    const cryptoPriceHistoryData: PriceHistoryData = {
      [ethAssetId]: [{ price: 0, date: Number() }],
    }
    const fiatPriceHistoryData: HistoryData[] = [{ price: 0, date: Number() }]
    const portfolioAssets: Record<AssetId, Asset> = {
      [ethAssetId]: ethereum,
    }
    const emptyBuckets = makeBuckets({ assetIds, balances, timeframe })
    const rebases: RebaseHistory[] = []
    const buckets = bucketEvents(txs, rebases, emptyBuckets)

    const calculatedBuckets = calculateBucketPrices({
      assetIds,
      buckets,
      cryptoPriceHistoryData,
      fiatPriceHistoryData,
      assets: portfolioAssets,
      selectedCurrency: 'USD',
    })
    expect(calculatedBuckets[0].balance.crypto[ethAssetId].toNumber()).toEqual(0)
  })
})

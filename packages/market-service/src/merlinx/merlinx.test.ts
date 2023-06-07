import { HistoryTimeframe } from '@shapeshiftoss/types'
import axios from 'axios'

import { bn } from '../utils/bignumber'
import { MERLINX_ASSET_ID, MerlinxMarketService } from './merlinx'
import { merlin, mockMerlinxMarketData } from './merlinxMockData'

const merlinxMarketService = new MerlinxMarketService({
  coinGeckoAPIKey: 'secret',
  providerUrls: {
    jsonRpcProviderUrl: 'dummy',
    hightableEthereumHttpUrl: '',
    hightableEthereumWsUrl: '',
    osmosisMarketDataUrl: '',
    osmosisPoolMetadataUrl: '',
  },
})

jest.mock('axios')

const mockTotalSupply = jest.fn().mockReturnValue(bn('502526240759422886301171305'))
const mockTvl = jest.fn().mockReturnValue(bn('52018758965754575223841191'))
jest.mock('@xblackfury/investor-merlinx', () => ({
  MerlinxApi: jest.fn().mockImplementation(() => ({
    totalSupply: mockTotalSupply,
    tvl: mockTvl,
  })),
  merlinxAddresses: [{ merlinx: '0xAddress' }],
}))

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('merlinx market service', () => {
  describe('getMarketCap', () => {
    it('can return merlin market data', async () => {
      mockedAxios.get.mockResolvedValue({ data: { data: [{ market_data: merlin }] } })
      const result = await merlinxMarketService.findAll()
      expect(Object.keys(result).length).toEqual(1)
    })

    it('can handle api errors', async () => {
      mockedAxios.get.mockRejectedValue({ error: 'foo' })
      const result = await merlinxMarketService.findAll()
      expect(Object.keys(result).length).toEqual(0)
    })

    it('can handle rate limiting', async () => {
      mockedAxios.get.mockRejectedValue({ status: 429 })
      const result = await merlinxMarketService.findAll()
      expect(Object.keys(result).length).toEqual(0)
    })
  })

  describe('findByAssetId', () => {
    const args = {
      assetId: MERLINX_ASSET_ID,
    }

    it('should return market data for MERLINy', async () => {
      mockedAxios.get.mockResolvedValue({ data: { market_data: merlin } })
      expect(await merlinxMarketService.findByAssetId(args)).toEqual(mockMerlinxMarketData)
    })

    it('should return null on network error', async () => {
      mockedAxios.get.mockRejectedValue(Error)
      jest.spyOn(console, 'warn').mockImplementation(() => void 0)
      await expect(merlinxMarketService.findByAssetId(args)).rejects.toEqual(
        new Error('MerlinxMarketService(findByAssetId): error fetching market data'),
      )
    })
  })

  describe('findPriceHistoryByAssetId', () => {
    const args = {
      assetId: MERLINX_ASSET_ID,
      timeframe: HistoryTimeframe.HOUR,
    }

    it('should return market data for MERLINy', async () => {
      const mockHistoryData = {
        prices: [
          [1631664000000, 0.480621954029937],
          [1631577600000, 0.48541321175453755],
          [1631491200000, 0.4860349080635926],
          [1631404800000, 0.46897407484696146],
        ],
      }

      const expected = [
        { date: new Date('2021-09-15T00:00:00.000Z').valueOf(), price: 0.480621954029937 },
        { date: new Date('2021-09-14T00:00:00.000Z').valueOf(), price: 0.48541321175453755 },
        { date: new Date('2021-09-13T00:00:00.000Z').valueOf(), price: 0.4860349080635926 },
        { date: new Date('2021-09-12T00:00:00.000Z').valueOf(), price: 0.46897407484696146 },
      ]
      mockedAxios.get.mockResolvedValue({ data: mockHistoryData })
      expect(await merlinxMarketService.findPriceHistoryByAssetId(args)).toEqual(expected)
    })

    it('should return null on network error', async () => {
      mockedAxios.get.mockRejectedValue(Error)
      jest.spyOn(console, 'warn').mockImplementation(() => void 0)
      await expect(merlinxMarketService.findPriceHistoryByAssetId(args)).rejects.toEqual(
        new Error('MerlinxMarketService(findPriceHistoryByAssetId): error fetching price history'),
      )
    })
  })
})

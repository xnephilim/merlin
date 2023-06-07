import { Asset } from '@xblackfury/asset-service'
import { ethereum, FeeDataEstimate } from '@xblackfury/chain-adapters'
import { KnownChainIds } from '@shapeshiftoss/types'
import Web3 from 'web3'

import { GetTradeQuoteInput, SwapperName, TradeQuote } from '../../../api'
import { ETH, MERLIN, WETH } from '../../utils/test-data/assets'
import { CowSwapperDeps } from '../CowSwapper'
import { DEFAULT_APP_DATA } from '../utils/constants'
import { cowService } from '../utils/cowService'
import { CowSwapSellQuoteApiInput } from '../utils/helpers/helpers'
import { getCowSwapTradeQuote } from './getCowSwapTradeQuote'

jest.mock('@xblackfury/chain-adapters')
jest.mock('../utils/cowService')
jest.mock('../utils/helpers/helpers', () => {
  return {
    getNowPlusThirtyMinutesTimestamp: () => 1656797787,
    getUsdRate: (_args: CowSwapperDeps, input: Asset) => {
      if (input.assetId === WETH.assetId || input.assetId === ETH.assetId) {
        return Promise.resolve('1233.65940923824103061992')
      }

      if (input.assetId === MERLIN.assetId) {
        return Promise.resolve('0.0873')
      }

      return Promise.resolve('20978.38')
    },
  }
})

jest.mock('../../utils/helpers/helpers', () => {
  return {
    ...jest.requireActual('../../utils/helpers/helpers'),
    getApproveContractData: () => '0xABCDEFGH',
  }
})

jest.mock('../getCowSwapMinMax/getCowSwapMinMax', () => {
  return {
    getCowSwapMinMax: (_args: CowSwapperDeps, sellAsset: Asset) => {
      if (sellAsset.assetId === MERLIN.assetId) {
        return { minimum: '229.09507445589919816724', maximum: '100000000000000000000000000' }
      }

      return { minimum: '0.011624', maximum: '100000000000000000000000000' }
    },
  }
})

const feeData: FeeDataEstimate<KnownChainIds.EthereumMainnet> = {
  fast: {
    txFee: '4080654495000000',
    chainSpecific: {
      gasLimit: '100000',
      gasPrice: '79036500000',
      maxFeePerGas: '216214758112',
      maxPriorityFeePerGas: '2982734547',
    },
  },
  slow: {
    txFee: '4080654495000000',
    chainSpecific: {
      gasLimit: '100000',
      gasPrice: '79036500000',
      maxFeePerGas: '216214758112',
      maxPriorityFeePerGas: '2982734547',
    },
  },
  average: {
    txFee: '4080654495000000',
    chainSpecific: {
      gasLimit: '100000',
      gasPrice: '79036500000',
      maxFeePerGas: '216214758112',
      maxPriorityFeePerGas: '2982734547',
    },
  },
}

const expectedApiInputWethToMerlin: CowSwapSellQuoteApiInput = {
  appData: DEFAULT_APP_DATA,
  buyToken: '0xc770eefad204b5180df6a14ee197d99d808ee52d',
  from: '0x0000000000000000000000000000000000000000',
  kind: 'sell',
  partiallyFillable: false,
  receiver: '0x0000000000000000000000000000000000000000',
  sellAmountBeforeFee: '1000000000000000000',
  sellToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  validTo: 1656797787,
}

const expectedApiInputSmallAmountWethToMerlin: CowSwapSellQuoteApiInput = {
  appData: DEFAULT_APP_DATA,
  buyToken: '0xc770eefad204b5180df6a14ee197d99d808ee52d',
  from: '0x0000000000000000000000000000000000000000',
  kind: 'sell',
  partiallyFillable: false,
  receiver: '0x0000000000000000000000000000000000000000',
  sellAmountBeforeFee: '11624000000000000',
  sellToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  validTo: 1656797787,
}

const expectedApiInputMerlinToEth: CowSwapSellQuoteApiInput = {
  appData: DEFAULT_APP_DATA,
  buyToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  from: '0x0000000000000000000000000000000000000000',
  kind: 'sell',
  partiallyFillable: false,
  receiver: '0x0000000000000000000000000000000000000000',
  sellAmountBeforeFee: '1000000000000000000000',
  sellToken: '0xc770eefad204b5180df6a14ee197d99d808ee52d',
  validTo: 1656797787,
}

const expectedTradeQuoteWethToMerlin: TradeQuote<KnownChainIds.EthereumMainnet> = {
  rate: '14716.04718939437505555958', // 14716 MERLIN per WETH
  minimumCryptoHuman: '0.011624',
  maximum: '100000000000000000000000000',
  feeData: {
    chainSpecific: {
      estimatedGas: '100000',
      gasPriceCryptoBaseUnit: '79036500000',
      approvalFeeCryptoBaseUnit: '7903650000000000',
    },
    buyAssetTradeFeeUsd: '0',
    sellAssetTradeFeeUsd: '17.95954294012756741283729339486489192096',
    networkFeeCryptoBaseUnit: '0',
  },
  sellAmountBeforeFeesCryptoBaseUnit: '1000000000000000000',
  buyAmountCryptoBaseUnit: '14501811818247595090576', // 14501 MERLIN
  sources: [{ name: SwapperName.CowSwap, proportion: '1' }],
  allowanceContract: '0xc92e8bdf79f0507f65a392b0ab4667716bfe0110',
  buyAsset: MERLIN,
  sellAsset: WETH,
  accountNumber: 0,
}

const expectedTradeQuoteMerlinToEth: TradeQuote<KnownChainIds.EthereumMainnet> = {
  rate: '0.00004995640398295996',
  minimumCryptoHuman: '229.09507445589919816724',
  maximum: '100000000000000000000000000',
  feeData: {
    chainSpecific: {
      estimatedGas: '100000',
      gasPriceCryptoBaseUnit: '79036500000',
      approvalFeeCryptoBaseUnit: '7903650000000000',
    },
    buyAssetTradeFeeUsd: '0',
    sellAssetTradeFeeUsd: '5.3955565850972847808512',
    networkFeeCryptoBaseUnit: '0',
  },
  sellAmountBeforeFeesCryptoBaseUnit: '1000000000000000000000',
  buyAmountCryptoBaseUnit: '46868859830863283',
  sources: [{ name: SwapperName.CowSwap, proportion: '1' }],
  allowanceContract: '0xc92e8bdf79f0507f65a392b0ab4667716bfe0110',
  buyAsset: ETH,
  sellAsset: MERLIN,
  accountNumber: 0,
}

const expectedTradeQuoteSmallAmountWethToMerlin: TradeQuote<KnownChainIds.EthereumMainnet> = {
  rate: '14716.04718939437523468382', // 14716 MERLIN per WETH
  minimumCryptoHuman: '0.011624',
  maximum: '100000000000000000000000000',
  feeData: {
    chainSpecific: {
      estimatedGas: '100000',
      gasPriceCryptoBaseUnit: '79036500000',
      approvalFeeCryptoBaseUnit: '7903650000000000',
    },
    buyAssetTradeFeeUsd: '0',
    sellAssetTradeFeeUsd: '1.79595429401274711874033728120645035672',
    networkFeeCryptoBaseUnit: '0',
  },
  sellAmountBeforeFeesCryptoBaseUnit: '1000000000000',
  buyAmountCryptoBaseUnit: '0', // 0 MERLIN
  sources: [{ name: SwapperName.CowSwap, proportion: '1' }],
  allowanceContract: '0xc92e8bdf79f0507f65a392b0ab4667716bfe0110',
  buyAsset: MERLIN,
  sellAsset: WETH,
  accountNumber: 0,
}

const deps: CowSwapperDeps = {
  apiUrl: 'https://api.cow.fi/mainnet/api',
  adapter: {
    getAddress: jest.fn(() => Promise.resolve('address11')),
    getFeeData: jest.fn<Promise<FeeDataEstimate<KnownChainIds.EthereumMainnet>>, []>(() =>
      Promise.resolve(feeData),
    ),
  } as unknown as ethereum.ChainAdapter,
  web3: {} as Web3,
}

describe('getCowTradeQuote', () => {
  it('should throw an exception if both assets are not erc20s', async () => {
    const input: GetTradeQuoteInput = {
      chainId: KnownChainIds.EthereumMainnet,
      sellAsset: ETH,
      buyAsset: MERLIN,
      sellAmountBeforeFeesCryptoBaseUnit: '11111',
      sendMax: true,
      accountNumber: 0,
      receiveAddress: '',
    }

    await expect(getCowSwapTradeQuote(deps, input)).rejects.toThrow(
      '[getCowSwapTradeQuote] - Sell asset needs to be ERC-20 to use CowSwap',
    )
  })

  it('should call cowService with correct parameters, handle the fees and return the correct trade quote when selling WETH', async () => {
    const input: GetTradeQuoteInput = {
      chainId: KnownChainIds.EthereumMainnet,
      sellAsset: WETH,
      buyAsset: MERLIN,
      sellAmountBeforeFeesCryptoBaseUnit: '1000000000000000000',
      sendMax: true,
      accountNumber: 0,
      receiveAddress: '',
    }

    ;(cowService.post as jest.Mock<unknown>).mockReturnValue(
      Promise.resolve({
        data: {
          quote: {
            ...expectedApiInputWethToMerlin,
            sellAmountBeforeFee: undefined,
            sellAmount: '985442057341242012',
            buyAmount: '14501811818247595090576',
            feeAmount: '14557942658757988',
            sellTokenBalance: 'erc20',
            buyTokenBalance: 'erc20',
          },
        },
      }),
    )

    const trade = await getCowSwapTradeQuote(deps, input)

    expect(trade).toEqual(expectedTradeQuoteWethToMerlin)
    expect(cowService.post).toHaveBeenCalledWith(
      'https://api.cow.fi/mainnet/api/v1/quote/',
      expectedApiInputWethToMerlin,
    )
  })

  it('should call cowService with correct parameters, handle the fees and return the correct trade quote when buying ETH', async () => {
    const input: GetTradeQuoteInput = {
      chainId: KnownChainIds.EthereumMainnet,
      sellAsset: MERLIN,
      buyAsset: ETH,
      sellAmountBeforeFeesCryptoBaseUnit: '1000000000000000000000',
      sendMax: true,
      accountNumber: 0,
      receiveAddress: '',
    }

    ;(cowService.post as jest.Mock<unknown>).mockReturnValue(
      Promise.resolve({
        data: {
          quote: {
            ...expectedApiInputMerlinToEth,
            sellAmountBeforeFee: undefined,
            sellAmount: '938195228120306016256',
            buyAmount: '46868859830863283',
            feeAmount: '61804771879693983744',
            sellTokenBalance: 'erc20',
            buyTokenBalance: 'erc20',
          },
        },
      }),
    )

    const trade = await getCowSwapTradeQuote(deps, input)

    expect(trade).toEqual(expectedTradeQuoteMerlinToEth)
    expect(cowService.post).toHaveBeenCalledWith(
      'https://api.cow.fi/mainnet/api/v1/quote/',
      expectedApiInputMerlinToEth,
    )
  })

  it('should call cowService with correct parameters and return quote with original sellAmount when selling a very small amount of WETH', async () => {
    const input: GetTradeQuoteInput = {
      chainId: KnownChainIds.EthereumMainnet,
      sellAsset: WETH,
      buyAsset: MERLIN,
      sellAmountBeforeFeesCryptoBaseUnit: '1000000000000',
      sendMax: true,
      accountNumber: 0,
      receiveAddress: '',
    }

    ;(cowService.post as jest.Mock<unknown>).mockReturnValue(
      Promise.resolve({
        data: {
          quote: {
            ...expectedApiInputSmallAmountWethToMerlin,
            sellAmountBeforeFee: undefined,
            sellAmount: '9854420573412420',
            buyAmount: '145018118182475950905',
            feeAmount: '1455794265875791',
            sellTokenBalance: 'erc20',
            buyTokenBalance: 'erc20',
          },
        },
      }),
    )

    const trade = await getCowSwapTradeQuote(deps, input)

    expect(trade).toEqual(expectedTradeQuoteSmallAmountWethToMerlin)
    expect(cowService.post).toHaveBeenCalledWith(
      'https://api.cow.fi/mainnet/api/v1/quote/',
      expectedApiInputSmallAmountWethToMerlin,
    )
  })
})

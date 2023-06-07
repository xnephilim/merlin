import { isEvmChainId } from '@xblackfury/chain-adapters'
import type { Result } from '@sniptt/monads'
import { Err, Ok } from '@sniptt/monads'
import type { Asset } from 'lib/asset-service'
import { bn, bnOrZero } from 'lib/bignumber/bignumber'
import type { SwapErrorRight } from 'lib/swapper/api'
import { makeSwapErrorRight, SwapErrorType } from 'lib/swapper/api'
import { selectSellAssetUsdRate } from 'state/zustand/swapperStore/amountSelectors'
import { swapperStore } from 'state/zustand/swapperStore/useSwapperStore'

import { MIN_ONEINCH_VALUE_USD } from '../utils/constants'

export const getMinimumAmountCryptoHuman = (
  sellAsset: Asset,
  buyAsset: Asset,
): Result<string, SwapErrorRight> => {
  if (
    !(
      isEvmChainId(sellAsset.chainId) &&
      isEvmChainId(buyAsset.chainId) &&
      buyAsset.chainId === sellAsset.chainId
    )
  ) {
    return Err(
      makeSwapErrorRight({
        message: '[getMinimumAmountCryptoHuman]',
        code: SwapErrorType.UNSUPPORTED_PAIR,
      }),
    )
  }

  const sellAssetUsdRate = selectSellAssetUsdRate(swapperStore.getState())
  const minimumAmountCryptoHuman = bn(MIN_ONEINCH_VALUE_USD)
    .dividedBy(bnOrZero(sellAssetUsdRate))
    .toString() // $1 worth of the sell token.

  return Ok(minimumAmountCryptoHuman)
}

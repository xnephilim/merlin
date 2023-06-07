import { isEvmChainId } from '@xblackfury/chain-adapters'
import type { GetEvmTradeQuoteInput, GetTradeQuoteInput } from 'lib/swapper/api'

export const isGetEvmTradeQuoteInput = (
  input: GetTradeQuoteInput,
): input is GetEvmTradeQuoteInput => {
  return isEvmChainId(input.chainId)
}

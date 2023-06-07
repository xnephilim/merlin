import type { ChainId, ChainReference } from '@xblackfury/caip'
import { CHAIN_NAMESPACE, toChainId } from '@xblackfury/caip'

export const lifiChainIdToChainId = (lifiChainId: number): ChainId => {
  return toChainId({
    chainNamespace: CHAIN_NAMESPACE.Evm,
    chainReference: lifiChainId.toString() as ChainReference,
  })
}

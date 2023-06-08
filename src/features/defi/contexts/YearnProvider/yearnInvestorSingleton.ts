import type { ChainAdapter } from '@xblackfury/chain-adapters'
import { KnownChainIds } from '@xblackfury/types'
import { getConfig } from 'config'
import { getChainAdapterManager } from 'context/PluginProvider/chainAdapterSingleton'
import { YearnInvestor } from 'lib/investor/investor-yearn'

let maybeYearnInvestor: YearnInvestor | undefined
export const getYearnInvestor = () => {
  if (maybeYearnInvestor) return maybeYearnInvestor

  maybeYearnInvestor = new YearnInvestor({
    chainAdapter: getChainAdapterManager().get(
      KnownChainIds.EthereumMainnet,
    ) as ChainAdapter<KnownChainIds.EthereumMainnet>,
    providerUrl: getConfig().REACT_APP_ETHEREUM_NODE_URL,
  })

  return maybeYearnInvestor
}

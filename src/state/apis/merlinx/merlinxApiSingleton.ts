import type { EvmBaseAdapter } from '@xblackfury/chain-adapters'
import { KnownChainIds } from '@xblackfury/types'
import { getConfig } from 'config'
import { getChainAdapterManager } from 'context/PluginProvider/chainAdapterSingleton'
import { merlinxAddresses, MerlinxApi } from 'lib/investor/investor-merlinx'

// don't export me, access me through the getter
let _merlinxApi: MerlinxApi | undefined = undefined

// we need to be able to access this outside react
export const getMerlinxApi = (): MerlinxApi => {
  // Infura requests are origin restricted upstream to *.xnephilim.com
  // Using our own node locally allows MERLINy development, though the balances aren't guaranteed to be accurate
  // since our archival node isn't fully synced yet
  const isLocalhost = window.location.hostname === 'localhost'
  const RPC_PROVIDER_ENV = isLocalhost
    ? 'REACT_APP_ETHEREUM_NODE_URL'
    : 'REACT_APP_ETHEREUM_INFURA_URL'

  if (_merlinxApi) return _merlinxApi

  const merlinxApi = new MerlinxApi({
    adapter: getChainAdapterManager().get(
      KnownChainIds.EthereumMainnet,
    ) as unknown as EvmBaseAdapter<KnownChainIds.EthereumMainnet>,
    providerUrl: getConfig()[RPC_PROVIDER_ENV],
    merlinxAddresses,
  })

  _merlinxApi = merlinxApi

  return _merlinxApi
}

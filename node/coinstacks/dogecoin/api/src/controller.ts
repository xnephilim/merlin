import { Blockbook } from '@xblackfury/blockbook'
import { Service } from '../../../common/api/src/utxo/service'
import { UTXO } from '../../../common/api/src/utxo/controller'

const INDEXER_URL = process.env.INDEXER_URL
const INDEXER_WS_URL = process.env.INDEXER_WS_URL
const RPC_URL = process.env.RPC_URL

if (!INDEXER_URL) throw new Error('INDEXER_URL env var not set')
if (!INDEXER_WS_URL) throw new Error('INDEXER_WS_URL env var not set')
if (!RPC_URL) throw new Error('RPC_URL env var not set')

const blockbook = new Blockbook({ httpURL: INDEXER_URL, wsURL: INDEXER_WS_URL })

const isXpub = (pubkey: string): boolean => {
  return pubkey.startsWith('dgub')
}

export const formatAddress = (address: string): string => address

export const service = new Service({ blockbook, rpcUrl: RPC_URL, isXpub, addressFormatter: formatAddress })

// assign service to be used for all instances of UTXO
UTXO.service = service

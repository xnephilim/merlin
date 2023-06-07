import type { HDWallet } from '@xblackfury/hdwallet-core'
import type { BIP44Params } from '@xblackfury/types'

export type BuildDepositTxInput = {
  memo: string
  value: string
  wallet: HDWallet
  gas: string
  fee: string
  bip44Params: BIP44Params
}

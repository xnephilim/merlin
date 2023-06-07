import type { evm } from '@xblackfury/common-api'

import { StandardTx } from '../../types'
import * as bep20 from '../bnbsmartchain/parser/bep20'
import * as cowswap from '../ethereum/parser/cowswap'
import * as merlinx from '../ethereum/parser/merlinx'
import * as thor from '../ethereum/parser/thor'
import * as uniV2 from '../ethereum/parser/uniV2'
import * as weth from '../ethereum/parser/weth'
import * as yearn from '../ethereum/parser/yearn'
import * as erc20 from '../parser/erc20'
import * as zrx from '../parser/zrx'

export type Tx = evm.Tx

export type TxMetadata =
  | bep20.TxMetadata
  | cowswap.TxMetadata
  | erc20.TxMetadata
  | merlinx.TxMetadata
  | thor.TxMetadata
  | uniV2.TxMetadata
  | weth.TxMetadata
  | yearn.TxMetadata
  | zrx.TxMetadata

export interface ParsedTx extends StandardTx {
  data?: TxMetadata
}

export type TxSpecific = Partial<Pick<ParsedTx, 'trade' | 'transfers' | 'data'>>

export interface SubParser<T extends Tx, U = TxSpecific> {
  parse(tx: T): Promise<U | undefined>
}

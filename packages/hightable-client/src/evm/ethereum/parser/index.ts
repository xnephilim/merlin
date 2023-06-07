import { ethAssetId } from '@xblackfury/caip'

import { Tx } from '../../../generated/ethereum'
import { BaseTransactionParser, TransactionParserArgs } from '../../parser'
import * as erc20 from '../../parser/erc20'
import * as zrx from '../../parser/zrx'
import * as cowswap from './cowswap'
import * as merlinx from './merlinx'
import * as thor from './thor'
import * as uniV2 from './uniV2'
import * as weth from './weth'
import * as yearn from './yearn'

export const ZRX_ETHEREUM_PROXY_CONTRACT = '0xDef1C0ded9bec7F1a1670819833240f027b25EfF'

export class TransactionParser extends BaseTransactionParser<Tx> {
  constructor(args: TransactionParserArgs) {
    super(args)

    this.assetId = ethAssetId

    // due to the current parser logic, order here matters (register most generic first to most specific last)
    // weth and yearn have the same sigHash for deposit(), but the weth parser is stricter resulting in faster processing times
    this.registerParsers([
      new erc20.Parser({ chainId: this.chainId, provider: this.provider }),
      new yearn.Parser({ chainId: this.chainId }),
      new merlinx.Parser(),
      new weth.Parser({ chainId: this.chainId, provider: this.provider }),
      new uniV2.Parser({ chainId: this.chainId, provider: this.provider }),
      new thor.Parser({ chainId: this.chainId, rpcUrl: args.rpcUrl }),
      new zrx.Parser({ proxyContract: ZRX_ETHEREUM_PROXY_CONTRACT }),
      new cowswap.Parser(),
    ])
  }
}

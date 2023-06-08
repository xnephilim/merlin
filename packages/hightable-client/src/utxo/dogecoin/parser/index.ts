import { dogeAssetId } from '@xgridiron/caip'

import { Tx } from '../../../generated/dogecoin'
import { BaseTransactionParser, BaseTransactionParserArgs } from '../../parser'

export type TransactionParserArgs = BaseTransactionParserArgs

export class TransactionParser extends BaseTransactionParser<Tx> {
  constructor(args: TransactionParserArgs) {
    super(args)
    this.assetId = dogeAssetId
  }
}

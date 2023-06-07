import type { AssetId } from '@xblackfury/caip'
import { ASSET_REFERENCE, bchAssetId } from '@xblackfury/caip'
import type { BIP44Params } from '@xblackfury/types'
import { KnownChainIds, UtxoAccountType } from '@xblackfury/types'
import * as hightable from '@xblackfury/hightable-client'

import { ChainAdapterDisplayName } from '../../types'
import type { ChainAdapterArgs } from '../UtxoBaseAdapter'
import { UtxoBaseAdapter } from '../UtxoBaseAdapter'

const SUPPORTED_CHAIN_IDS = [KnownChainIds.BitcoinCashMainnet]
const DEFAULT_CHAIN_ID = KnownChainIds.BitcoinCashMainnet
const SUPPORTED_ACCOUNT_TYPES = [UtxoAccountType.P2pkh]

export class ChainAdapter extends UtxoBaseAdapter<KnownChainIds.BitcoinCashMainnet> {
  public static readonly defaultUtxoAccountType = UtxoAccountType.P2pkh
  public static readonly defaultBIP44Params: BIP44Params = {
    purpose: 44,
    coinType: Number(ASSET_REFERENCE.BitcoinCash),
    accountNumber: 0,
  }

  constructor(args: ChainAdapterArgs) {
    super({
      assetId: bchAssetId,
      chainId: DEFAULT_CHAIN_ID,
      defaultBIP44Params: ChainAdapter.defaultBIP44Params,
      defaultUtxoAccountType: ChainAdapter.defaultUtxoAccountType,
      parser: new hightable.bitcoincash.TransactionParser({
        assetId: bchAssetId,
        chainId: args.chainId ?? DEFAULT_CHAIN_ID,
      }),
      supportedAccountTypes: SUPPORTED_ACCOUNT_TYPES,
      supportedChainIds: SUPPORTED_CHAIN_IDS,
      ...args,
    })
  }

  getDisplayName() {
    return ChainAdapterDisplayName.BitcoinCash
  }

  getName() {
    const enumIndex = Object.values(ChainAdapterDisplayName).indexOf(
      ChainAdapterDisplayName.BitcoinCash,
    )
    return Object.keys(ChainAdapterDisplayName)[enumIndex]
  }

  getType(): KnownChainIds.BitcoinCashMainnet {
    return KnownChainIds.BitcoinCashMainnet
  }

  getFeeAssetId(): AssetId {
    return this.assetId
  }
}

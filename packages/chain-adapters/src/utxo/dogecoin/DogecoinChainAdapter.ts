import type { AssetId } from '@xblackfury/caip'
import { ASSET_REFERENCE, dogeAssetId } from '@xblackfury/caip'
import type { BIP44Params } from '@xblackfury/types'
import { KnownChainIds, UtxoAccountType } from '@xblackfury/types'
import * as hightable from '@xblackfury/hightable-client'

import { ChainAdapterDisplayName } from '../../types'
import type { ChainAdapterArgs } from '../UtxoBaseAdapter'
import { UtxoBaseAdapter } from '../UtxoBaseAdapter'

const SUPPORTED_CHAIN_IDS = [KnownChainIds.DogecoinMainnet]
const DEFAULT_CHAIN_ID = KnownChainIds.DogecoinMainnet
const SUPPORTED_ACCOUNT_TYPES = [UtxoAccountType.P2pkh]

export class ChainAdapter extends UtxoBaseAdapter<KnownChainIds.DogecoinMainnet> {
  public static readonly defaultUtxoAccountType = UtxoAccountType.P2pkh
  public static readonly defaultBIP44Params: BIP44Params = {
    purpose: 44,
    coinType: Number(ASSET_REFERENCE.Dogecoin),
    accountNumber: 0,
  }

  constructor(args: ChainAdapterArgs) {
    super({
      assetId: dogeAssetId,
      chainId: DEFAULT_CHAIN_ID,
      defaultBIP44Params: ChainAdapter.defaultBIP44Params,
      defaultUtxoAccountType: ChainAdapter.defaultUtxoAccountType,
      parser: new hightable.dogecoin.TransactionParser({
        assetId: dogeAssetId,
        chainId: args.chainId ?? DEFAULT_CHAIN_ID,
      }),
      supportedAccountTypes: SUPPORTED_ACCOUNT_TYPES,
      supportedChainIds: SUPPORTED_CHAIN_IDS,
      ...args,
    })
  }

  getDisplayName() {
    return ChainAdapterDisplayName.Dogecoin
  }

  getName() {
    const enumIndex = Object.values(ChainAdapterDisplayName).indexOf(
      ChainAdapterDisplayName.Dogecoin,
    )
    return Object.keys(ChainAdapterDisplayName)[enumIndex]
  }

  getType(): KnownChainIds.DogecoinMainnet {
    return KnownChainIds.DogecoinMainnet
  }

  getFeeAssetId(): AssetId {
    return this.assetId
  }
}

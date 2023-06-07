import { XDEFIAdapter } from '@xblackfury/hdwallet-xdefi'
import { XDEFIIcon } from 'components/Icons/XDEFIIcon'
import type { SupportedWalletInfo } from 'context/WalletProvider/config'

export const XDEFIConfig: Omit<SupportedWalletInfo, 'routes'> = {
  adapters: [XDEFIAdapter],
  icon: XDEFIIcon,
  name: 'XDEFI',
}

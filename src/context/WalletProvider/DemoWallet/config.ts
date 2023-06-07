import { NativeAdapter } from '@xblackfury/hdwallet-native'
import { MerlinIcon } from 'components/Icons/MerlinIcon'
import type { SupportedWalletInfo } from 'context/WalletProvider/config'

export const DemoConfig: Omit<SupportedWalletInfo, 'routes'> = {
  adapters: [NativeAdapter],
  supportsMobile: 'both',
  icon: MerlinIcon,
  name: 'DemoWallet',
}

import { NativeAdapter } from '@xblackfury/hdwallet-native'
import { MerlinIcon } from 'components/Icons/MerlinIcon'
import type { SupportedWalletInfo } from 'context/WalletProvider/config'

export const NativeConfig: Omit<SupportedWalletInfo, 'routes'> = {
  adapters: [NativeAdapter],
  supportsMobile: 'browser',
  icon: MerlinIcon,
  name: 'ShapeShift',
}

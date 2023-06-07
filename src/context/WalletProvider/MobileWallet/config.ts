import { NativeAdapter } from '@xblackfury/hdwallet-native'
import { MerlinIcon } from 'components/Icons/MerlinIcon'
import type { SupportedWalletInfo } from 'context/WalletProvider/config'

export const MobileConfig: Omit<SupportedWalletInfo, 'routes'> = {
  adapters: [NativeAdapter],
  supportsMobile: 'app',
  icon: MerlinIcon,
  name: 'ShapeShift Mobile',
}

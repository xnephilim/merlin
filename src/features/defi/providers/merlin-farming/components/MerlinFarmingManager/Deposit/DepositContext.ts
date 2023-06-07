import { createContext } from 'react'

import type { MerlinFarmingDepositActions, MerlinFarmingDepositState } from './DepositCommon'

interface IDepositContext {
  state: MerlinFarmingDepositState | null
  dispatch: React.Dispatch<MerlinFarmingDepositActions> | null
}

export const DepositContext = createContext<IDepositContext>({ state: null, dispatch: null })

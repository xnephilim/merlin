import { createContext } from 'react'

import type { MerlinFarmingWithdrawActions, MerlinFarmingWithdrawState } from './WithdrawCommon'

interface IWithdrawContext {
  state: MerlinFarmingWithdrawState | null
  dispatch: React.Dispatch<MerlinFarmingWithdrawActions> | null
}

export const WithdrawContext = createContext<IWithdrawContext>({ state: null, dispatch: null })

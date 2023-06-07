import { createContext } from 'react'

import type { MerlinxWithdrawActions, MerlinxWithdrawState } from './WithdrawCommon'

interface IWithdrawContext {
  state: MerlinxWithdrawState | null
  dispatch: React.Dispatch<MerlinxWithdrawActions> | null
}

export const WithdrawContext = createContext<IWithdrawContext>({ state: null, dispatch: null })

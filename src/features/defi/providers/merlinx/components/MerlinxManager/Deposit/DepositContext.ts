import { createContext } from 'react'

import type { MerlinxDepositActions, MerlinxDepositState } from './DepositCommon'

export interface IDepositContext {
  state: MerlinxDepositState | null
  dispatch: React.Dispatch<MerlinxDepositActions> | null
}

export const DepositContext = createContext<IDepositContext>({ state: null, dispatch: null })

import type {
  DefiParams,
  DefiQueryParams,
} from 'features/defi/contexts/DefiManagerProvider/DefiCommon'
import { DefiAction } from 'features/defi/contexts/DefiManagerProvider/DefiCommon'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { SlideTransition } from 'components/SlideTransition'
import { useMerlinEth } from 'context/MerlinEthProvider/MerlinEthProvider'
import { useBrowserRouter } from 'hooks/useBrowserRouter/useBrowserRouter'

import { Claim } from './Claim/Claim'
import { MerlinFarmingDeposit } from './Deposit/MerlinFarmingDeposit'
import { MerlinFarmingOverview } from './Overview/MerlinFarmingOverview'
import { MerlinFarmingWithdraw } from './Withdraw/MerlinFarmingWithdraw'

export const MerlinFarmingManager = () => {
  const { query } = useBrowserRouter<DefiQueryParams, DefiParams>()
  const { modal } = query
  const { farmingAccountId, setFarmingAccountId: handleFarmingAccountIdChange } = useMerlinEth()

  // farmingAccountId isn't a local state field - it is a memoized state field from the <MerlinEthContext /> and will stay hanging
  // This makes sure to clear it on modal close
  useEffect(() => {
    return () => {
      handleFarmingAccountIdChange(undefined)
    }
  }, [handleFarmingAccountIdChange])

  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      {modal === DefiAction.Overview && (
        <SlideTransition key={DefiAction.Overview}>
          <MerlinFarmingOverview
            accountId={farmingAccountId}
            onAccountIdChange={handleFarmingAccountIdChange}
          />
        </SlideTransition>
      )}
      {modal === DefiAction.Deposit && (
        <SlideTransition key={DefiAction.Deposit}>
          <MerlinFarmingDeposit
            accountId={farmingAccountId}
            onAccountIdChange={handleFarmingAccountIdChange}
          />
        </SlideTransition>
      )}
      {modal === DefiAction.Withdraw && (
        <SlideTransition key={DefiAction.Withdraw}>
          <MerlinFarmingWithdraw
            accountId={farmingAccountId}
            onAccountIdChange={handleFarmingAccountIdChange}
          />
        </SlideTransition>
      )}
      {modal === DefiAction.Claim && (
        <SlideTransition key={DefiAction.Claim}>
          <Claim accountId={farmingAccountId} onAccountIdChange={handleFarmingAccountIdChange} />
        </SlideTransition>
      )}
    </AnimatePresence>
  )
}

import { Center } from '@chakra-ui/react'
import type { AccountId } from '@xblackfury/caip'
import { KnownChainIds } from '@xblackfury/types'
import { ethers } from 'ethers'
import { DefiModalContent } from 'features/defi/components/DefiModal/DefiModalContent'
import { DefiModalHeader } from 'features/defi/components/DefiModal/DefiModalHeader'
import type {
  DefiParams,
  DefiQueryParams,
} from 'features/defi/contexts/DefiManagerProvider/DefiCommon'
import { DefiAction, DefiStep } from 'features/defi/contexts/DefiManagerProvider/DefiCommon'
import { useMerlinxQuery } from 'features/defi/providers/merlinx/components/MerlinxManager/useMerlinxQuery'
import qs from 'qs'
import { useEffect, useMemo, useReducer } from 'react'
import { useTranslate } from 'react-polyglot'
import { useSelector } from 'react-redux'
import type { AccountDropdownProps } from 'components/AccountDropdown/AccountDropdown'
import { CircularProgress } from 'components/CircularProgress/CircularProgress'
import type { DefiStepProps } from 'components/DeFi/components/Steps'
import { Steps } from 'components/DeFi/components/Steps'
import { getChainAdapterManager } from 'context/PluginProvider/chainAdapterSingleton'
import { useBrowserRouter } from 'hooks/useBrowserRouter/useBrowserRouter'
import { useWallet } from 'hooks/useWallet/useWallet'
import { bnOrZero } from 'lib/bignumber/bignumber'
import { getMerlinxApi } from 'state/apis/merlinx/merlinxApiSingleton'
import {
  selectBIP44ParamsByAccountId,
  selectMarketDataById,
  selectPortfolioLoading,
} from 'state/slices/selectors'
import { useAppSelector } from 'state/store'

import { Approve } from './components/Approve'
import { Confirm } from './components/Confirm'
import { Status } from './components/Status'
import { Withdraw } from './components/Withdraw'
import { MerlinxWithdrawActionType } from './WithdrawCommon'
import { WithdrawContext } from './WithdrawContext'
import { initialState, reducer } from './WithdrawReducer'

export const MerlinxWithdraw: React.FC<{
  onAccountIdChange: AccountDropdownProps['onChange']
  accountId: AccountId | undefined
}> = ({ onAccountIdChange: handleAccountIdChange, accountId }) => {
  const merlinxApi = getMerlinxApi()
  const translate = useTranslate()
  const [state, dispatch] = useReducer(reducer, initialState)
  const { query, history, location } = useBrowserRouter<DefiQueryParams, DefiParams>()
  const { assetReference: merlinxStakingContractAddress } = query
  const { feeAssetId, underlyingAsset, underlyingAssetId, stakingAsset } = useMerlinxQuery()

  const marketData = useAppSelector(state => selectMarketDataById(state, underlyingAssetId))

  const feeMarketData = useAppSelector(state => selectMarketDataById(state, feeAssetId))
  const accountFilter = useMemo(() => ({ accountId: accountId ?? '' }), [accountId])
  const bip44Params = useAppSelector(state => selectBIP44ParamsByAccountId(state, accountFilter))

  // user info
  const chainAdapterManager = getChainAdapterManager()
  const chainAdapter = chainAdapterManager.get(KnownChainIds.EthereumMainnet)
  const { state: walletState } = useWallet()
  const loading = useSelector(selectPortfolioLoading)

  useEffect(() => {
    ;(async () => {
      try {
        if (
          !(
            walletState.wallet &&
            merlinxStakingContractAddress &&
            chainAdapter &&
            merlinxApi &&
            bip44Params
          )
        )
          return
        const merlinxOpportunity = await merlinxApi.getMerlinxOpportunityByStakingAddress(
          ethers.utils.getAddress(merlinxStakingContractAddress),
        )
        // Get merlinx fee for instant sends
        const merlinxFeePercentage = await merlinxApi.instantUnstakeFee({
          contractAddress: merlinxStakingContractAddress,
        })

        dispatch({
          type: MerlinxWithdrawActionType.SET_MERLINX_FEE,
          payload: bnOrZero(merlinxFeePercentage).toString(),
        })
        dispatch({
          type: MerlinxWithdrawActionType.SET_OPPORTUNITY,
          payload: merlinxOpportunity,
        })
      } catch (error) {
        // TODO: handle client side errors
        console.error(error)
      }
    })()
  }, [merlinxApi, bip44Params, chainAdapter, merlinxStakingContractAddress, walletState.wallet])

  const StepConfig: DefiStepProps = useMemo(() => {
    return {
      [DefiStep.Info]: {
        label: translate('defi.steps.withdraw.info.title'),
        description: translate('defi.steps.withdraw.info.yieldyDescription', {
          asset: stakingAsset.symbol,
        }),
        component: ownProps => (
          <Withdraw {...ownProps} accountId={accountId} onAccountIdChange={handleAccountIdChange} />
        ),
      },
      [DefiStep.Approve]: {
        label: translate('defi.steps.approve.title'),
        component: ownProps => <Approve {...ownProps} accountId={accountId} />,
        props: { contractAddress: merlinxStakingContractAddress },
      },
      [DefiStep.Confirm]: {
        label: translate('defi.steps.confirm.title'),
        component: ownProps => <Confirm {...ownProps} accountId={accountId} />,
      },
      [DefiStep.Status]: {
        label: 'Status',
        component: ownProps => <Status {...ownProps} accountId={accountId} />,
      },
    }
  }, [accountId, handleAccountIdChange, merlinxStakingContractAddress, translate, stakingAsset.symbol])

  const handleBack = () => {
    history.push({
      pathname: location.pathname,
      search: qs.stringify({
        ...query,
        modal: DefiAction.Overview,
      }),
    })
  }

  if (loading || !underlyingAsset || !marketData || !feeMarketData)
    return (
      <Center minW='350px' minH='350px'>
        <CircularProgress />
      </Center>
    )

  return (
    <WithdrawContext.Provider value={{ state, dispatch }}>
      <DefiModalContent>
        <DefiModalHeader
          onBack={handleBack}
          title={translate('modals.withdraw.withdrawFrom', {
            opportunity: `${stakingAsset.symbol} Yieldy`,
          })}
        />
        <Steps steps={StepConfig} />
      </DefiModalContent>
    </WithdrawContext.Provider>
  )
}

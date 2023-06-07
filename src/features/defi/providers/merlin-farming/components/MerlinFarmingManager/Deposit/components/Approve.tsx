import { useToast } from '@chakra-ui/react'
import type { AccountId } from '@xblackfury/caip'
import { supportsETH } from '@shapeshiftoss/hdwallet-core'
import { Approve as ReusableApprove } from 'features/defi/components/Approve/Approve'
import { ApprovePreFooter } from 'features/defi/components/Approve/ApprovePreFooter'
import type {
  DefiParams,
  DefiQueryParams,
} from 'features/defi/contexts/DefiManagerProvider/DefiCommon'
import { DefiAction, DefiStep } from 'features/defi/contexts/DefiManagerProvider/DefiCommon'
import { canCoverTxFees } from 'features/defi/helpers/utils'
import { useMerlinFarming } from 'features/defi/providers/merlin-farming/hooks/useMerlinFarming'
import { useCallback, useContext, useMemo } from 'react'
import { useTranslate } from 'react-polyglot'
import { getChainAdapterManager } from 'context/PluginProvider/chainAdapterSingleton'
import { useBrowserRouter } from 'hooks/useBrowserRouter/useBrowserRouter'
import { useWallet } from 'hooks/useWallet/useWallet'
import { bn, bnOrZero } from 'lib/bignumber/bignumber'
import { trackOpportunityEvent } from 'lib/mixpanel/helpers'
import { MixPanelEvents } from 'lib/mixpanel/types'
import { poll } from 'lib/poll/poll'
import { isSome } from 'lib/utils'
import { assertIsMerlinEthStakingContractAddress } from 'state/slices/opportunitiesSlice/constants'
import { toOpportunityId } from 'state/slices/opportunitiesSlice/utils'
import {
  selectAggregatedEarnUserStakingOpportunityByStakingId,
  selectAssetById,
  selectAssets,
  selectMarketDataById,
} from 'state/slices/selectors'
import { useAppSelector } from 'state/store'

import { MerlinFarmingDepositActionType } from '../DepositCommon'
import { DepositContext } from '../DepositContext'

type MerlinFarmingApproveProps = {
  accountId: AccountId | undefined
  onNext: (arg: DefiStep) => void
}

export const Approve: React.FC<MerlinFarmingApproveProps> = ({ accountId, onNext }) => {
  const { state, dispatch } = useContext(DepositContext)
  const estimatedGasCryptoPrecision = state?.approve.estimatedGasCryptoPrecision
  const translate = useTranslate()
  const { query } = useBrowserRouter<DefiQueryParams, DefiParams>()
  const { assetNamespace, chainId, contractAddress } = query

  const feeAssetId = getChainAdapterManager().get(chainId)?.getFeeAssetId()
  if (!feeAssetId) throw new Error(`Cannot get fee AssetId for chainId ${chainId}`)
  const feeAsset = useAppSelector(state => selectAssetById(state, feeAssetId))
  if (!feeAsset) throw new Error(`Fee asset not found for AssetId ${feeAssetId}`)

  const merlinFarmingOpportunityFilter = useMemo(
    () => ({
      stakingId: toOpportunityId({
        assetNamespace,
        assetReference: contractAddress,
        chainId,
      }),
    }),
    [assetNamespace, chainId, contractAddress],
  )
  const merlinFarmingOpportunity = useAppSelector(state =>
    selectAggregatedEarnUserStakingOpportunityByStakingId(state, merlinFarmingOpportunityFilter),
  )
  assertIsMerlinEthStakingContractAddress(contractAddress)

  const { allowance, approve, getStakeFeeData } = useMerlinFarming(contractAddress)

  const assets = useAppSelector(selectAssets)

  const asset = useAppSelector(state =>
    selectAssetById(state, merlinFarmingOpportunity?.underlyingAssetId ?? ''),
  )
  const feeMarketData = useAppSelector(state => selectMarketDataById(state, feeAssetId))

  // user info
  const {
    state: { wallet },
  } = useWallet()

  // notify
  const toast = useToast()

  const handleApprove = useCallback(async () => {
    if (
      !state?.deposit.cryptoAmount ||
      !dispatch ||
      !merlinFarmingOpportunity ||
      !wallet ||
      !supportsETH(wallet)
    )
      return

    try {
      if (!asset) return
      dispatch({ type: MerlinFarmingDepositActionType.SET_LOADING, payload: true })
      await approve()
      await poll({
        fn: () => allowance(),
        validate: (result: string) => {
          const allowance = bnOrZero(result).div(bn(10).pow(asset.precision))
          return bnOrZero(allowance).gte(bnOrZero(state?.deposit.cryptoAmount))
        },
        interval: 15000,
        maxAttempts: 30,
      })
      // Get deposit gas estimate
      const feeData = await getStakeFeeData(state.deposit.cryptoAmount)
      if (!feeData) return
      const estimatedGasCryptoPrecision = bnOrZero(feeData.txFee)
        .div(bn(10).pow(feeAsset.precision))
        .toPrecision()
      dispatch({
        type: MerlinFarmingDepositActionType.SET_DEPOSIT,
        payload: { estimatedGasCryptoPrecision },
      })

      onNext(DefiStep.Confirm)
      trackOpportunityEvent(
        MixPanelEvents.DepositApprove,
        {
          opportunity: merlinFarmingOpportunity,
          fiatAmounts: [],
          cryptoAmounts: [],
        },
        assets,
      )
    } catch (error) {
      console.error(error)
      toast({
        position: 'top-right',
        description: translate('common.transactionFailedBody'),
        title: translate('common.transactionFailed'),
        status: 'error',
      })
    } finally {
      dispatch({ type: MerlinFarmingDepositActionType.SET_LOADING, payload: false })
    }
  }, [
    state?.deposit.cryptoAmount,
    dispatch,
    merlinFarmingOpportunity,
    wallet,
    asset,
    approve,
    getStakeFeeData,
    feeAsset.precision,
    onNext,
    assets,
    allowance,
    toast,
    translate,
  ])

  const hasEnoughBalanceForGas = useMemo(
    () =>
      isSome(estimatedGasCryptoPrecision) &&
      isSome(accountId) &&
      canCoverTxFees({
        feeAsset,
        estimatedGasCryptoPrecision,
        accountId,
      }),
    [accountId, feeAsset, estimatedGasCryptoPrecision],
  )

  const preFooter = useMemo(
    () => (
      <ApprovePreFooter
        accountId={accountId}
        action={DefiAction.Deposit}
        feeAsset={feeAsset}
        estimatedGasCryptoPrecision={estimatedGasCryptoPrecision}
      />
    ),
    [accountId, feeAsset, estimatedGasCryptoPrecision],
  )
  if (!state || !dispatch || !merlinFarmingOpportunity || !asset) return null

  return (
    <ReusableApprove
      asset={asset}
      spenderName={merlinFarmingOpportunity.provider}
      feeAsset={feeAsset}
      icons={merlinFarmingOpportunity.icons}
      estimatedGasFeeCryptoPrecision={bnOrZero(state.approve.estimatedGasCryptoPrecision).toFixed(
        5,
      )}
      disabled={!hasEnoughBalanceForGas}
      fiatEstimatedGasFee={bnOrZero(state.approve.estimatedGasCryptoPrecision)
        .times(feeMarketData.price)
        .toFixed(2)}
      loading={state.loading}
      loadingText={translate('common.approve')}
      preFooter={preFooter}
      providerIcon='https://assets.coincap.io/assets/icons/256/merlin.png'
      learnMoreLink='https://xnephilim.zendesk.com/hc/en-us/articles/360018501700'
      onCancel={() => onNext(DefiStep.Info)}
      onConfirm={handleApprove}
      spenderContractAddress={merlinFarmingOpportunity?.contractAddress ?? ''}
    />
  )
}

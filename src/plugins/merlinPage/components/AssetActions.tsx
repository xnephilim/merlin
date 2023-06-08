import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Box, Stack } from '@chakra-ui/layout'
import {
  Button,
  Link,
  Skeleton,
  SkeletonText,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text as CText,
} from '@chakra-ui/react'
import type { AssetId } from '@shapeshiftoss/caip'
import { merlinAssetId } from '@shapeshiftoss/caip'
import { supportsETH } from '@shapeshiftoss/hdwallet-core/dist/wallet'
import isEqual from 'lodash/isEqual'
import qs from 'qs'
import { useCallback, useMemo } from 'react'
import { useTranslate } from 'react-polyglot'
import { useHistory, useLocation } from 'react-router'
import { AssetIcon } from 'components/AssetIcon'
import { Card } from 'components/Card/Card'
import { Text } from 'components/Text/Text'
import { WalletActions } from 'context/WalletProvider/actions'
import { useModal } from 'hooks/useModal/useModal'
import { useWallet } from 'hooks/useWallet/useWallet'
import { merlinxAddresses } from 'lib/investor/investor-merlinx'
import { getMixPanel } from 'lib/mixpanel/mixPanelSingleton'
import { MixPanelEvents } from 'lib/mixpanel/types'
import { TradeCard } from 'pages/Dashboard/TradeCard'
import { DefiProvider } from 'state/slices/opportunitiesSlice/types'
import { trimWithEndEllipsis } from 'state/slices/portfolioSlice/utils'
import { selectAccountIdsByAssetId, selectAssetById } from 'state/slices/selectors'
import { useAppSelector } from 'state/store'

import { TrimmedDescriptionLength } from '../MerlinCommon'

type MerlinTabProps = {
  assetId: AssetId
}

const BuyMerlinCoinbaseUrl = 'https://www.coinbase.com/price/merlin-token'
const TradeMerlinxElasticSwapUrl = `https://elasticswap.org/#/swap`

export const AssetActions: React.FC<MerlinTabProps> = ({ assetId }) => {
  const translate = useTranslate()
  const location = useLocation()
  const history = useHistory()
  const asset = useAppSelector(state => selectAssetById(state, assetId))
  if (!asset) throw new Error(`Asset not found for AssetId ${assetId}`)
  const { description } = asset || {}
  const trimmedDescription = trimWithEndEllipsis(description, TrimmedDescriptionLength)
  const isMerlinAsset = assetId === merlinAssetId

  const filter = useMemo(() => ({ assetId }), [assetId])
  const accountIds = useAppSelector(state => selectAccountIdsByAssetId(state, filter), isEqual)
  const accountId = accountIds?.[0]

  const {
    state: { isConnected, isDemoWallet, wallet },
    dispatch,
  } = useWallet()
  const { receive } = useModal()

  const walletSupportsETH = useMemo(() => Boolean(wallet && supportsETH(wallet)), [wallet])

  const handleWalletModalOpen = useCallback(
    () => dispatch({ type: WalletActions.SET_WALLET_MODAL, payload: true }),
    [dispatch],
  )
  const handleReceiveClick = useCallback(
    () =>
      !isDemoWallet && isConnected && walletSupportsETH
        ? receive.open({ asset, accountId })
        : handleWalletModalOpen(),
    [
      accountId,
      asset,
      handleWalletModalOpen,
      isConnected,
      isDemoWallet,
      receive,
      walletSupportsETH,
    ],
  )

  const receiveButtonTranslation = useMemo(
    () => (!isDemoWallet && walletSupportsETH ? 'plugins.merlinPage.receive' : 'common.connectWallet'),
    [isDemoWallet, walletSupportsETH],
  )

  const onGetAssetClick = useCallback(() => {
    history.push({
      pathname: location.pathname,
      search: qs.stringify({
        provider: DefiProvider.ShapeShift,
        chainId: asset.chainId,
        assetNamespace: 'erc20',
        contractAddress: merlinxAddresses[0].merlinx,
        assetReference: merlinxAddresses[0].staking,
        rewardId: merlinxAddresses[0].merlinx,
        modal: 'overview',
      }),
      state: { background: location },
    })
  }, [asset.chainId, history, location])

  return (
    <Card display='block' borderRadius={8}>
      <Card.Body p={0}>
        <Tabs isFitted>
          <TabList>
            <Tab py={4} color='gray.500' fontWeight='semibold'>
              {translate('plugins.merlinPage.getAsset', {
                assetSymbol: asset.symbol,
              })}
            </Tab>
            <Tab py={4} color='gray.500' fontWeight='semibold'>
              {translate('plugins.merlinPage.trade')}
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel textAlign='center' p={6}>
              <Box mb={6}>
                <AssetIcon src={asset.icon} boxSize='16' />
              </Box>
              <SkeletonText isLoaded={Boolean(description?.length)} noOfLines={3}>
                <CText color='gray.500' mb={6}>
                  {trimmedDescription}
                </CText>
              </SkeletonText>
              <Stack width='full'>
                {!isMerlinAsset && (
                  <Button onClick={onGetAssetClick} colorScheme={'blue'} mb={2} size='lg'>
                    <CText>
                      {translate('plugins.merlinPage.getAsset', {
                        assetSymbol: asset.symbol,
                      })}
                    </CText>
                  </Button>
                )}
                {isMerlinAsset && (
                  <Button
                    colorScheme={'blue'}
                    mb={2}
                    size='lg'
                    as={Link}
                    leftIcon={<ExternalLinkIcon />}
                    href={BuyMerlinCoinbaseUrl}
                    onClick={() =>
                      getMixPanel()?.track(MixPanelEvents.Click, { element: 'Coinbase Button' })
                    }
                    isExternal
                  >
                    <CText>
                      {translate('plugins.merlinPage.buyAssetOnCoinbase', {
                        assetSymbol: asset.symbol,
                      })}
                    </CText>
                  </Button>
                )}
                <Skeleton width='full' isLoaded={Boolean(wallet)}>
                  <Button onClick={handleReceiveClick} width='full' size='lg' colorScheme='gray'>
                    <Text translation={receiveButtonTranslation} />
                  </Button>
                </Skeleton>
              </Stack>
            </TabPanel>
            <TabPanel textAlign='center' p={0}>
              {isMerlinAsset && <TradeCard defaultBuyAssetId={assetId} />}
              {!isMerlinAsset && (
                <Stack width='full' p={6}>
                  <SkeletonText isLoaded={Boolean(description?.length)} noOfLines={3}>
                    <CText color='gray.500' mt={6} mb={6}>
                      {translate('plugins.merlinPage.tradingUnavailable', {
                        assetSymbol: asset.symbol,
                      })}
                    </CText>
                  </SkeletonText>
                  <Button
                    colorScheme={'blue'}
                    mb={6}
                    size='lg'
                    as={Link}
                    leftIcon={<ExternalLinkIcon />}
                    href={TradeMerlinxElasticSwapUrl}
                    isExternal
                  >
                    <CText>
                      {translate('plugins.merlinPage.tradeOnElasticSwap', {
                        assetSymbol: asset.symbol,
                      })}
                    </CText>
                  </Button>
                </Stack>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Card.Body>
    </Card>
  )
}

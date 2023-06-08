import { Button, Flex } from '@chakra-ui/react'
import { merlinAssetId } from '@shapeshiftoss/caip'
import { useCallback } from 'react'
import { useTranslate } from 'react-polyglot'
import { useHistory } from 'react-router'
import { AssetIcon } from 'components/AssetIcon'
import { Card } from 'components/Card/Card'
import { FiatRampAction } from 'components/Modals/FiatRamps/FiatRampsCommon'
import { Text } from 'components/Text'
import { AssetClickAction } from 'components/Trade/hooks/useTradeRoutes/types'
import { useModal } from 'hooks/useModal/useModal'
import { getMixPanel } from 'lib/mixpanel/mixPanelSingleton'
import { MixPanelEvents } from 'lib/mixpanel/types'
import { selectAssetById } from 'state/slices/selectors'
import { useAppSelector } from 'state/store'
import { useSwapperStore } from 'state/zustand/swapperStore/useSwapperStore'

import { ArkeoCard } from './ArkeoCard'

export const MerlinTokenHolders = () => {
  const history = useHistory()
  const translate = useTranslate()
  const { fiatRamps } = useModal()

  const clearAmounts = useSwapperStore(state => state.clearAmounts)
  const handleAssetSelection = useSwapperStore(state => state.handleAssetSelection)
  const merlinAsset = useAppSelector(state => selectAssetById(state, merlinAssetId))

  const handleClick = useCallback(() => {
    // set the trade input to merlin buy
    if (merlinAsset) {
      handleAssetSelection({ asset: merlinAsset, action: AssetClickAction.Buy })
      clearAmounts()
    }

    getMixPanel()?.track(MixPanelEvents.Click, { element: 'Merlin Token Holders Button' })
    history.push('/trade/eip155:1/erc20:0xc770eefad204b5180df6a14ee197d99d808ee52d')
  }, [history, clearAmounts, handleAssetSelection, merlinAsset])

  const handleBuySellClick = useCallback(() => {
    fiatRamps.open({
      assetId: merlinAssetId,
      fiatRampAction: FiatRampAction.Buy,
    })
  }, [fiatRamps])

  return (
    <ArkeoCard>
      <Card.Body display='flex' flexDir='column' gap={4} height='100%'>
        <Flex>
          <AssetIcon assetId={merlinAssetId} />
        </Flex>
        <Text fontSize='xl' fontWeight='bold' translation={'arkeo.merlinTokenHolders.title'} />
        <Text color='gray.500' translation={'arkeo.merlinTokenHolders.body'} />
        <Flex mt='auto' gap={4}>
          <Button width='full' colorScheme='blue' onClick={handleClick}>
            {translate('arkeo.merlinTokenHolders.cta')}
          </Button>
          <Button onClick={handleBuySellClick} width='full' colorScheme='blue' variant='link'>
            {translate('arkeo.merlinTokenHolders.secondary')}
          </Button>
        </Flex>
      </Card.Body>
    </ArkeoCard>
  )
}

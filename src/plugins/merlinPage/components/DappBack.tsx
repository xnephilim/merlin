import { Button, Link } from '@chakra-ui/react'
import { useCallback } from 'react'
import { useTranslate } from 'react-polyglot'
import { Card } from 'components/Card/Card'
import { Text } from 'components/Text'
import { useFeatureFlag } from 'hooks/useFeatureFlag/useFeatureFlag'
import { getMixPanel } from 'lib/mixpanel/mixPanelSingleton'
import { MixPanelEvents } from 'lib/mixpanel/types'

export const DappBack = () => {
  const translate = useTranslate()
  const isMerlinBondCTAEnabled = useFeatureFlag('MerlinBondCTA')

  const handleClick = useCallback(() => {
    getMixPanel()?.track(MixPanelEvents.Click, { element: 'Dappback Button' })
  }, [])
  if (!isMerlinBondCTAEnabled) return null
  return (
    <Card>
      <Card.Header>
        <Card.Heading>
          <Text translation='plugins.merlinPage.dappBack.title' />
        </Card.Heading>
      </Card.Header>
      <Card.Body display='flex' gap={6} flexDirection='column'>
        <Text color='gray.500' translation='plugins.merlinPage.dappBack.body' />
        <Button
          as={Link}
          href='https://dappback.com/xnephilim'
          isExternal
          colorScheme='blue'
          onClick={handleClick}
        >
          {translate('plugins.merlinPage.dappBack.cta')}
        </Button>
      </Card.Body>
    </Card>
  )
}

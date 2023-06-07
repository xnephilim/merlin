import { Button, Skeleton, Stack, Text as CText } from '@chakra-ui/react'
import { DefiModalContent } from 'features/defi/components/DefiModal/DefiModalContent'
import { EmptyOverview } from 'features/defi/components/EmptyOverview/EmptyOverview'
import { Amount } from 'components/Amount/Amount'
import { Text } from 'components/Text'
import type { Asset } from 'lib/asset-service'

type MerlinxEmptyProps = {
  assets: Asset[]
  apy: string | undefined
  onClick?: () => void
}

export const MerlinxEmpty = ({ assets, apy, onClick }: MerlinxEmptyProps) => {
  return (
    <DefiModalContent>
      <EmptyOverview
        assets={assets}
        footer={
          <Button width='full' colorScheme='blue' onClick={onClick}>
            <Text translation='defi.modals.merlinxOverview.cta' />
          </Button>
        }
      >
        <Stack direction='row' flexWrap='wrap' spacing={1} justifyContent='center' mb={4}>
          <Text translation='defi.modals.merlinxOverview.header' />
          <CText color='green.500'>
            <Skeleton isLoaded={Boolean(apy)}>
              <Amount.Percent value={apy ?? ''} suffix='APR' />
            </Skeleton>
          </CText>
        </Stack>
        <Text color='gray.500' translation='defi.modals.merlinxOverview.body' />
        <Text color='gray.500' translation='defi.modals.merlinxOverview.rewards' />
      </EmptyOverview>
    </DefiModalContent>
  )
}

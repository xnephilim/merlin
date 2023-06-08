import { Badge, Box, Flex } from '@chakra-ui/layout'
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  useColorModeValue,
} from '@chakra-ui/react'
import { useMemo } from 'react'
import { useTranslate } from 'react-polyglot'
import type { DefiType } from 'state/slices/opportunitiesSlice/types'

import type { ExternalOpportunity, OpportunityTypes } from '../../MerlinCommon'
import { MerlinOtherOpportunityPanelRow } from './MerlinOtherOpportunityPanelRow'

type MerlinOtherOpportunityPanelProps = {
  opportunities: ExternalOpportunity[]
  title: string
  type: OpportunityTypes | DefiType
}

export const MerlinOtherOpportunityPanel: React.FC<MerlinOtherOpportunityPanelProps> = ({
  opportunities,
  title,
}) => {
  const translate = useTranslate()
  const borderColor = useColorModeValue('gray.150', 'gray.700')

  const renderRows = useMemo(() => {
    return opportunities?.map((opportunity, index) => (
      <MerlinOtherOpportunityPanelRow opportunity={opportunity} key={index} />
    ))
  }, [opportunities])

  return (
    <AccordionItem borderColor={borderColor} _last={{ borderBottomWidth: 0 }}>
      <AccordionButton px={6} py={4}>
        <Box flex='1' textAlign='left' fontWeight='semibold'>
          {translate(title)}
        </Box>
        <Flex>
          <Badge
            colorScheme='blue'
            display='flex'
            alignItems='center'
            px={2}
            py={'2px'}
            borderRadius='md'
            mr={4}
          >
            {opportunities.length}
          </Badge>
          <AccordionIcon color='gray.500' />
        </Flex>
      </AccordionButton>
      <AccordionPanel pb={8} pt={5} px={2} my={-4}>
        {renderRows}
      </AccordionPanel>
    </AccordionItem>
  )
}
import { Box, chakra, Container, DarkMode, Heading, Stack } from '@chakra-ui/react'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
import { useMemo } from 'react'
import { useTranslate } from 'react-polyglot'
import MerlinMissionsBg from 'assets/merlin-missions-bg.jpg'
import MerlinArmyBg from 'assets/merlinarmy-bg.png'
import MerlinAtarBg from 'assets/merlinatar-card-bg.png'
import SponsorBg from 'assets/mission-sponsor-bg.jpg'
import OptimismBg from 'assets/op-card-bg.png'
import YatBg from 'assets/yat-mission-bg.png'
import { Main } from 'components/Layout/Main'
import { SEO } from 'components/Layout/Seo'
import { ScrollCarousel } from 'components/ScrollCarousel/ScrollCarousel'
import { RawText } from 'components/Text'
import { MERLIN_MISSION_REQUEST_PAGE } from 'pages/Missions/constants'

import type { MissionProps } from './Mission'
import { Mission } from './Mission'

dayjs.extend(timezone)
dayjs.extend(customParseFormat)
// Timezone is MST for dates
dayjs.tz.setDefault('America/Denver')
const dateFormat = 'YYYY-MM-DD hh:mm A'

export const Missions = () => {
  const translate = useTranslate()
  const missionItems: MissionProps[] = useMemo(() => {
    return [
      {
        title: translate('missions.merlinatar.title'),
        subtitle: translate('missions.merlinatar.subtitle'),
        buttonText: translate('missions.merlinatar.cta'),
        coverImage: MerlinAtarBg,
        onClick: () => window.open('https://app.mercle.xyz/xnephilim/events'),
      },
      {
        title: translate('missions.optimism.title'),
        subtitle: translate('missions.optimism.subtitle'),
        buttonText: translate('missions.optimism.cta'),
        coverImage: OptimismBg,
        onClick: () => window.open('https://rewards.xnephilim.com/optimistic-merlin-1'),
        endDate: '2023-06-30 08:00 AM',
      },
      {
        title: translate('missions.merlinArmy.title'),
        subtitle: translate('missions.merlinArmy.subtitle'),
        buttonText: translate('missions.merlinArmy.cta'),
        coverImage: MerlinArmyBg,
        onClick: () => window.open('https://x.postmint.xyz/'),
        startDate: '2023-06-06 11:00 AM',
        endDate: '2023-06-13 11:00 AM',
      },
      {
        title: translate('missions.yat.title'),
        subtitle: translate('missions.yat.subtitle'),
        buttonText: translate('missions.yat.cta'),
        coverImage: YatBg,
        onClick: () => window.open('https://fantasy.y.at/invite/yduad7mm'),
      },
    ]
  }, [translate])

  const renderMissions = useMemo(() => {
    const now = dayjs()
    const groupedMissions: {
      future: MissionProps[]
      past: MissionProps[]
      active: MissionProps[]
    } = missionItems.reduce(
      (groups, mission) => {
        const start = dayjs(mission.startDate, dateFormat)
        const end = dayjs(mission.endDate, dateFormat)
        if (now.isBefore(start) || !mission.onClick) {
          groups.future.push(mission)
        } else if (now.isAfter(end)) {
          groups.past.push(mission)
        } else {
          groups.active.push(mission)
        }
        return groups
      },
      { future: [] as MissionProps[], past: [] as MissionProps[], active: [] as MissionProps[] },
    )

    return (
      <Container maxWidth='full' display='flex' flexDir='column' gap={12} px={{ base: 0, md: 6 }}>
        {groupedMissions.active.length > 0 && (
          <Stack spacing={6}>
            <Heading as='h5' px={4}>
              {translate('missions.activeMissions')}
            </Heading>
            <ScrollCarousel>
              {groupedMissions.active.map(mission => (
                <Mission key={mission.title} {...mission} />
              ))}
            </ScrollCarousel>
          </Stack>
        )}

        <Stack spacing={6}>
          <Heading as='h5' px={4}>
            {translate('missions.comingSoon')}
          </Heading>
          <ScrollCarousel>
            {groupedMissions.future.map(mission => (
              <Mission key={mission.title} {...mission} />
            ))}
            <Mission
              key='sponsored'
              title={translate('missions.getListed.title')}
              subtitle={translate('missions.getListed.subtitle')}
              onClick={() => window.open(MERLIN_MISSION_REQUEST_PAGE)}
              buttonText={translate('missions.getListed.cta')}
              coverImage={SponsorBg}
            />
          </ScrollCarousel>
        </Stack>

        {groupedMissions.past.length > 0 && (
          <Stack spacing={6}>
            <Heading as='h5' px={4}>
              {translate('missions.endedMissions')}
            </Heading>
            <ScrollCarousel>
              {groupedMissions.past.map(mission => (
                <Mission key={mission.title} {...mission} />
              ))}
            </ScrollCarousel>
          </Stack>
        )}
      </Container>
    )
  }, [missionItems, translate])
  return (
    <DarkMode>
      <SEO title={translate('missions.subtitle')} />
      <Main
        pt={0}
        px={0}
        pb={12}
        display='flex'
        flexDir='column'
        bg='gray.800'
        flex={1}
        width='full'
        hideBreadcrumbs
      >
        <Box
          mt='-4.5rem'
          bgImage={MerlinMissionsBg}
          backgroundSize={{ base: 'contain', md: 'cover' }}
          backgroundRepeat='no-repeat'
          backgroundPosition={{ base: 'center -12em', md: 'center 110%' }}
          pt='22%'
        >
          <Container textAlign='center' maxWidth='container.md' py={16}>
            <Heading textShadow='0 2px rgba(0,0,0,.4)' as='h4' color='white'>
              {translate('missions.subtitle')}
            </Heading>
            <Heading
              color='white'
              fontSize={{ base: '3xl', md: '5xl' }}
              lineHeight='none'
              letterSpacing='-0.015em'
            >
              <chakra.span textShadow='0 4px 15px #000'>
                {translate('missions.title.1')}{' '}
              </chakra.span>
              <chakra.span
                backgroundImage='linear-gradient(97.53deg, #F7F2F4 5.6%, #7B61FF 59.16%, #46F4C8 119.34%)'
                backgroundClip='text'
                data-text={translate('missions.title.2')}
                position='relative'
                zIndex='1'
                _after={{
                  content: 'attr(data-text)',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  textShadow: '0 4px 15px #000',
                  zIndex: -1,
                  display: { base: 'none', md: 'inline' },
                }}
              >
                {translate('missions.title.2')}
              </chakra.span>
            </Heading>
            <RawText
              textShadow='0 3px rgba(0,0,0,.4)'
              fontSize={{ base: 'xl', md: '2xl' }}
              letterSpacing='0.012em'
              mt={4}
              mx={4}
              color='white'
            >
              {translate('missions.body')}
            </RawText>
          </Container>
        </Box>
        {renderMissions}
      </Main>
    </DarkMode>
  )
}

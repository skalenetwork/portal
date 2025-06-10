/**
 * @license
 * SKALE portal
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @file Home.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Stack, Box, Grid, Button } from '@mui/material'
import { cmn, cls, SkPaper } from '@skalenetwork/metaport'
import { type types } from '@/core'

import { useApps } from '../useApps'

import Headline from '../components/Headline'
import PageCard from '../components/PageCard'
import CategoryCardsGrid from '../components/ecosystem/CategoryCardsGrid'
import NewApps from '../components/ecosystem/tabs/NewApps'
import TrendingApps from '../components/ecosystem/tabs/TrendingApps'

import { SKALE_SOCIAL_LINKS } from '../core/constants'
import { SECTION_ICONS, EXPLORE_CARDS } from '../components/HomeComponents'
import SocialButtons from '../components/ecosystem/Socials'
import UserRecommendations from '../components/ecosystem/UserRecommendations'

interface HomeProps {
  skaleNetwork: types.SkaleNetwork
  chainsMeta: types.ChainsMetadataMap
  metrics: types.IMetrics | null
  loadData: () => Promise<void>
}

export default function Home({
  skaleNetwork,
  chainsMeta,
  metrics,
  loadData
}: HomeProps): JSX.Element {
  const { newApps, trendingApps, } = useApps(chainsMeta, metrics)

  useEffect(() => {
    loadData()
  }, [])

  return (
    <Container maxWidth="md" className="paddBott60">
      <Stack spacing={0}>
        <h2 className={cls(cmn.nom)}>Welcome to SKALE</h2>
        <Headline
          text="Explore Portal"
          icon={SECTION_ICONS.explore}
          className={cls(cmn.mbott10, cmn.mtop20)}
        />
        <ExploreSection />
        <UserRecommendations
          skaleNetwork={skaleNetwork}
          chainsMeta={chainsMeta}
          metrics={metrics}
        />
        <AppSection
          title="New dApps on SKALE"
          icon={SECTION_ICONS.new}
          linkTo="/ecosystem?tab=1"
          component={
            <NewApps
              newApps={newApps}
              skaleNetwork={skaleNetwork}
              chainsMeta={chainsMeta}
              useCarousel={true}
              trendingApps={trendingApps}
            />
          }
        />
        <AppSection
          title="Trending dApps on SKALE"
          icon={SECTION_ICONS.trending}
          linkTo="/ecosystem?tab=2"
          component={
            <TrendingApps
              chainsMeta={chainsMeta}
              skaleNetwork={skaleNetwork}
              newApps={newApps}
              filteredApps={trendingApps}
              useCarousel
            />
          }
        />
      </Stack>
      <Headline
        text="Top Categories"
        icon={SECTION_ICONS.categories}
        className={cls(cmn.mbott10, cmn.mtop20, cmn.ptop20)}
      />
      <CategoryCardsGrid chainsMeta={chainsMeta} />
      <div className={cls(cmn.flex, cmn.mtop20, cmn.ptop20)}>
        <div className={cls(cmn.flexg)}></div>
        <SkPaper gray className={cls(cmn.mtop20)}>
          <SocialButtons social={SKALE_SOCIAL_LINKS} size="md" className="m-ri-min10" />
        </SkPaper>
        <div className={cls(cmn.flexg)}></div>
      </div>
    </Container>
  )
}

function ExploreSection(): JSX.Element {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {EXPLORE_CARDS.map((card, index) => (
          <Grid key={index} className="fl-centered dappCard" item lg={6} md={6} sm={6} xs={12}>
            <PageCard {...card} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

interface AppSectionProps {
  title: string
  icon: JSX.Element
  linkTo: string
  component: JSX.Element
}

function AppSection({ title, icon, linkTo, component }: AppSectionProps): JSX.Element {
  return (
    <>
      <div className={cls(cmn.flex, cmn.flexcv, cmn.mbott10, cmn.mtop20, cmn.ptop20)}>
        <Headline text={title} icon={icon} />
        <Link to={linkTo}>
          <Button className={cls('btn btnSm bg', cmn.pPrim)}>See all</Button>
        </Link>
      </div>
      {component}
    </>
  )
}

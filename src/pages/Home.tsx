import { Link } from 'react-router-dom'
import { Container, Stack, Box, Grid, Button } from '@mui/material'
import { cmn, cls } from '@skalenetwork/metaport'
import { type types } from '@/core'

import { useApps } from '../useApps'

import Headline from '../components/Headline'
import PageCard from '../components/PageCard'
import CategoryCardsGrid from '../components/ecosystem/CategoryCardsGrid'
import NewApps from '../components/ecosystem/NewApps'
import FavoriteApps from '../components/ecosystem/FavoriteApps'
import TrendingApps from '../components/ecosystem/TrendingApps'

import { SECTION_ICONS, EXPLORE_CARDS } from '../components/HomeComponents'

interface HomeProps {
  skaleNetwork: types.SkaleNetwork
  chainsMeta: types.ChainsMetadataMap
}

export default function Home({ skaleNetwork, chainsMeta }: HomeProps): JSX.Element {
  const { newApps, trendingApps, favoriteApps, isSignedIn } = useApps(chainsMeta)

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
        <AppSection
          title="Your Favorites"
          icon={SECTION_ICONS.favorites}
          linkTo="/ecosystem?tab=2"
          component={
            <FavoriteApps
              skaleNetwork={skaleNetwork}
              chainsMeta={chainsMeta}
              useCarousel={true}
              newApps={newApps}
              filteredApps={favoriteApps}
              isSignedIn={isSignedIn}
              error={null}
            />
          }
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
            />
          }
        />
        <AppSection
          title="Trending dApps on SKALE"
          icon={SECTION_ICONS.trending}
          linkTo="/ecosystem?tab=3"
          component={
            <TrendingApps
              chainsMeta={chainsMeta}
              skaleNetwork={skaleNetwork}
              newApps={newApps}
              trendingApps={trendingApps}
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

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
import { Container, Stack, Button } from '@mui/material'
import { SkPaper } from '@skalenetwork/metaport'
import { type types } from '@/core'

import { useApps } from '../useApps'
import Headline from '../components/Headline'
import PageCard from '../components/PageCard'
import CategoryCardsGrid from '../components/ecosystem/CategoryCardsGrid'
import NewApps from '../components/ecosystem/tabs/NewApps'
import TrendingApps from '../components/ecosystem/tabs/TrendingApps'
import FeaturedApps from '../components/ecosystem/tabs/FeaturedApps'
import HomeBanner from '../components/HomeBanner'

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
  const { newApps, trendingApps, featuredApps } = useApps(chainsMeta, metrics)

  useEffect(() => {
    loadData()
  }, [])
  return (
    <Container maxWidth="md" className="paddBott60">
      <Stack spacing={0}>
        <Headline text="Popular Actions" icon={SECTION_ICONS.explore} />
        <HomeBanner />
        <ExploreSection />
        <UserRecommendations
          skaleNetwork={skaleNetwork}
          chainsMeta={chainsMeta}
          metrics={metrics}
        />
        <AppSection
          title="Featured dApps on SKALE"
          icon={SECTION_ICONS.featured}
          linkTo="/ecosystem?tab=1"
          component={
            <FeaturedApps
              featuredApps={featuredApps}
              newApps={newApps}
              skaleNetwork={skaleNetwork}
              chainsMeta={chainsMeta}
              trendingApps={trendingApps}
              useCarousel={true}
            />
          }
        />
        <AppSection
          title="New dApps on SKALE"
          icon={SECTION_ICONS.new}
          linkTo="/ecosystem?tab=2"
          component={
            <NewApps
              newApps={newApps}
              skaleNetwork={skaleNetwork}
              chainsMeta={chainsMeta}
              useCarousel={true}
              trendingApps={trendingApps}
              featuredApps={featuredApps}
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
              featuredApps={featuredApps}
              filteredApps={trendingApps}
              useCarousel
            />
          }
        />
      </Stack>
      <Headline
        text="Top Categories"
        icon={SECTION_ICONS.categories}
        className="mb-2.5 mt-5 pt-5"
      />
      <CategoryCardsGrid chainsMeta={chainsMeta} />
      <div className="flex items-center mt-5 pt-5">
        <div className="flex-grow"></div>
        <SkPaper gray className="mt-5">
          <SocialButtons social={SKALE_SOCIAL_LINKS} size="md" className="m-ri-min10" />
        </SkPaper>
        <div className="flex-grow"></div>
      </div>
    </Container>
  )
}
function ExploreSection(): JSX.Element {
  return (
    <div className="flex-grow">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {EXPLORE_CARDS.map((card, index) => (
          <div key={index} className="flex justify-center items-center dappCard">
            <PageCard {...card} />
          </div>
        ))}
      </div>
    </div>
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
      <div className="flex items-center mb-2.5 mt-5 pt-5">
        <Headline text={title} icon={icon} />
        <Link to={linkTo}>
          <Button className="btn btnSm bg text-primary">See all</Button>
        </Link>
      </div>
      {component}
    </>
  )
}

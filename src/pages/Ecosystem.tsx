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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
/**
 * @file Ecosystem.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Helmet } from 'react-helmet'
import { Container, Stack, Tab, Tabs, Button } from '@mui/material'
import { useSearchParams } from 'react-router-dom'

import { type types } from '@/core'
import { type MetaportCore } from '@skalenetwork/metaport'
import { META_TAGS } from '../core/meta'
import { filterAppsByCategory, filterAppsBySearchTerm } from '../core/ecosystem/apps'
import { useUrlParams } from '../core/ecosystem/urlParamsUtil'
import { SKALE_SOCIAL_LINKS, SUBMIT_PROJECT_URL } from '../core/constants'
import { useApps } from '../useApps'
import FeaturedApps from '../components/ecosystem/tabs/FeaturedApps'
import ScrollToTopButton from '../components/ScrollToTopButton'

import CategoryDisplay from '../components/ecosystem/Categories'
import SearchComponent from '../components/ecosystem/AppSearch'
import SelectedCategories from '../components/ecosystem/SelectedCategories'
import SkStack from '../components/SkStack'
import AllApps from '../components/ecosystem/tabs/AllApps'
import NewApps from '../components/ecosystem/tabs/NewApps'
import TrendingApps from '../components/ecosystem/tabs/TrendingApps'
import SocialButtons from '../components/ecosystem/Socials'
import SkPageInfoIcon from '../components/SkPageInfoIcon'
import { cn } from '../core/ecosystem/utils'

import {
  LayoutGrid,
  Plus
} from 'lucide-react'
import { SECTION_ICONS } from '../components/HomeComponents'

export default function Ecosystem(props: {
  mpc: MetaportCore
  chainsMeta: types.ChainsMetadataMap
  metrics: types.IMetrics | null
  loadData: () => Promise<void>
}) {
  const [searchParams] = useSearchParams()
  const {
    getCheckedItemsFromUrl,
    setCheckedItemsInUrl,
    getTabIndexFromUrl,
    setTabIndexInUrl,
    getSearchTermFromUrl,
    setSearchTermInUrl
  } = useUrlParams()
  const { allApps, newApps, trendingApps, featuredApps } = useApps(props.chainsMeta, props.metrics)

  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const [filteredApps, setFilteredApps] = useState<types.AppWithChainAndName[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [loaded, setLoaded] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    props.loadData()
    const initialCheckedItems = getCheckedItemsFromUrl()
    setCheckedItems(initialCheckedItems)
    const initialTabIndex = getTabIndexFromUrl()
    setActiveTab(initialTabIndex)
    const initialSearchTerm = getSearchTermFromUrl()
    setSearchTerm(initialSearchTerm)
  }, [])

  useEffect(() => {
    const currentTabIndex = getTabIndexFromUrl()
    setActiveTab(currentTabIndex)
  }, [searchParams, getTabIndexFromUrl])

  useEffect(() => {
    const filtered = filterAppsBySearchTerm(
      props.mpc.config.skaleNetwork,
      filterAppsByCategory(allApps, checkedItems),
      searchTerm,
      props.chainsMeta
    )
    setFilteredApps(filtered)
    setLoaded(true)
  }, [allApps, checkedItems, searchTerm, props.chainsMeta])
  const handleSetCheckedItems = (newCheckedItems: string[]) => {
    setCheckedItems(newCheckedItems)
    setCheckedItemsInUrl(newCheckedItems)
  }
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
    setTabIndexInUrl(newValue)
  }
  const handleSetSearchTerm = (value: React.SetStateAction<string>) => {
    const newSearchTerm = typeof value === 'function' ? value(searchTerm) : value
    setSearchTerm(newSearchTerm)
    setSearchTermInUrl(newSearchTerm)
  }
  const getFilteredAppsByTab = useMemo(() => {
    const filterMap = new Map([
      [0, filteredApps],
      [
        1,
        featuredApps.filter((app) =>
          filteredApps.some(
            (filteredApp) => filteredApp.chain === app.chain && filteredApp.appName === app.appName
          )
        )
      ],
      [
        2,
        newApps.filter((app) =>
          filteredApps.some(
            (filteredApp) => filteredApp.chain === app.chain && filteredApp.appName === app.appName
          )
        )
      ],
      [
        3,
        trendingApps.filter((app) =>
          filteredApps.some(
            (filteredApp) => filteredApp.chain === app.chain && filteredApp.appName === app.appName
          )
        )
      ]
    ])

    return (tabIndex: number) => filterMap.get(tabIndex) || filteredApps
  }, [filteredApps, newApps, trendingApps, featuredApps])

  const currentFilteredApps = getFilteredAppsByTab(activeTab)

  return (
    <>
      <Container maxWidth="md" ref={containerRef}>
        <Helmet>
          <title>{META_TAGS.ecosystem.title}</title>
          <meta name="description" content={META_TAGS.ecosystem.description} />
          <meta property="og:title" content={META_TAGS.ecosystem.title} />
          <meta property="og:description" content={META_TAGS.ecosystem.description} />
        </Helmet>
        <Stack spacing={0}>
          <SkStack>
            <div className={cn('grow flex flex-col mb-5')}>
              <h2 className="m-0 text-xl font-bold text-foreground">Ecosystem</h2>
              <p className="text-xs text-secondary-foreground font-semibold">
                Explore dApps across the SKALE ecosystem
              </p>
            </div>
            <div className="flex items-center">
              <SocialButtons social={SKALE_SOCIAL_LINKS} all />
              <div className="ml-2.5">
                <SkPageInfoIcon meta_tag={META_TAGS.ecosystem} />
              </div>
            </div>
          </SkStack>
          <SkStack className="mb-5 flex flex-col gap-2 md:flex-row md:items-center">
            <SearchComponent
              className="grow fullW mt-2 mb-2 md:mt-0 md:mb-0"
              searchTerm={searchTerm}
              setSearchTerm={handleSetSearchTerm}
            />
            <CategoryDisplay
              checkedItems={checkedItems}
              setCheckedItems={handleSetCheckedItems}
            />
          </SkStack>
          <SelectedCategories
            checkedItems={checkedItems}
            setCheckedItems={handleSetCheckedItems}
            filteredAppsCount={currentFilteredApps.length}
          />
          <Tabs
            variant="scrollable"
            scrollButtons="auto"
            value={activeTab}
            onChange={handleTabChange}
            className="skTabs bg-card! rounded-full p-1! mb-5 md:w-fit"
          >
            <Tab
              label="All"
              icon={<LayoutGrid size={14} />}
              iconPosition="start"
              className={`btn btnMd tab fwmobile ${activeTab === 0
                ? 'text-foreground! bg-gray-100! dark:bg-black!'
                : 'bg-card/0! text-muted-foreground!'
                }`}
            />
            <Tab
              label="Featured"
              icon={SECTION_ICONS.featured}
              iconPosition="start"
              className={`btn btnMd tab fwmobile ${activeTab === 1
                ? 'text-foreground! bg-gray-100! dark:bg-black!'
                : 'bg-card/0! text-muted-foreground!'
                }`}
            />
            <Tab
              label="New"
              icon={SECTION_ICONS.new}
              iconPosition="start"
              className={`btn btnMd tab fwmobile ${activeTab === 2
                ? 'text-foreground! bg-gray-100! dark:bg-black!'
                : 'bg-card/0! text-muted-foreground!'
                }`}
            />
            <Tab
              label="Trending"
              icon={SECTION_ICONS.trending}
              iconPosition="start"
              className={`btn btnMd tab fwmobile ${activeTab === 3
                ? 'text-foreground! bg-gray-100! dark:bg-black! shadow-xs!'
                : 'bg-card/0! text-muted-foreground!'
                }`}
            />
          </Tabs>
          <div className={cn('grow', 'fwmobile')}>
            {activeTab === 0 && (
              <AllApps
                apps={currentFilteredApps}
                skaleNetwork={props.mpc.config.skaleNetwork}
                chainsMeta={props.chainsMeta}
                newApps={newApps}
                loaded={loaded}
                trendingApps={trendingApps}
                featuredApps={featuredApps}
              />
            )}
            {activeTab === 1 && (
              <FeaturedApps
                featuredApps={currentFilteredApps}
                newApps={newApps}
                skaleNetwork={props.mpc.config.skaleNetwork}
                chainsMeta={props.chainsMeta}
                trendingApps={trendingApps}
              />
            )}
            {activeTab === 2 && (
              <NewApps
                newApps={currentFilteredApps}
                skaleNetwork={props.mpc.config.skaleNetwork}
                chainsMeta={props.chainsMeta}
                trendingApps={trendingApps}
                featuredApps={featuredApps}
              />
            )}
            {activeTab === 3 && (
              <TrendingApps
                chainsMeta={props.chainsMeta}
                skaleNetwork={props.mpc.config.skaleNetwork}
                newApps={newApps}
                filteredApps={currentFilteredApps}
                featuredApps={featuredApps}
              />
            )}
          </div>
        </Stack>
        <div className="flex mt-5 mb-5">
          <div className="grow"></div>
          <div>
            <a target="_blank" rel="noreferrer" href={SUBMIT_PROJECT_URL} className="undec">
              <Button
                size="medium"
                variant="contained"
                className="btn btnMd text-xs text-accent! bg-foreground!"
                startIcon={<Plus size={17} />}
              >
                Submit Your Project
              </Button>
            </a>
          </div>
          <div className="grow"></div>
        </div>
      </Container>
      <ScrollToTopButton />
    </>
  )
}

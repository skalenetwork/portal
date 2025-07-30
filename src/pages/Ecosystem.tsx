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

import React, { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { Container, Stack, Box, Tab, Tabs, Button } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import AppShortcutIcon from '@mui/icons-material/AppShortcut'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'

import { type types } from '@/core'
import { cmn, cls, type MetaportCore } from '@skalenetwork/metaport'
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
import FavoriteApps from '../components/ecosystem/tabs/FavoriteApps'
import TrendingApps from '../components/ecosystem/tabs/TrendingApps'
import SocialButtons from '../components/ecosystem/Socials'
import SkPageInfoIcon from '../components/SkPageInfoIcon'

export default function Ecosystem(props: {
  mpc: MetaportCore
  chainsMeta: types.ChainsMetadataMap
  metrics: types.IMetrics | null
  isXs: boolean
  loadData: () => Promise<void>
}) {
  const [searchParams] = useSearchParams()
  const { getCheckedItemsFromUrl, setCheckedItemsInUrl, getTabIndexFromUrl, setTabIndexInUrl } =
    useUrlParams()
  const { allApps, newApps, trendingApps, favoriteApps, isSignedIn, featuredApps } = useApps(
    props.chainsMeta,
    props.metrics
  )

  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const [filteredApps, setFilteredApps] = useState<types.AppWithChainAndName[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [loaded, setLoaded] = useState<boolean>(false)

  const handleSetSearchTerm = (value: React.SetStateAction<string>) => {
    const newSearchTerm = typeof value === 'function' ? value(searchTerm) : value
    setSearchTerm(newSearchTerm)
    const newParams = new URLSearchParams(window.location.search)
    if (newSearchTerm) {
      newParams.set('search', newSearchTerm)
    } else {
      newParams.delete('search')
    }
    const newUrl = newParams.toString() ? `${window.location.pathname}?${newParams.toString()}` : window.location.pathname
    window.history.replaceState({}, '', newUrl)
  }

  useEffect(() => {
    props.loadData()
    const initialCheckedItems = getCheckedItemsFromUrl()
    setCheckedItems(initialCheckedItems)
    const initialTabIndex = getTabIndexFromUrl()
    setActiveTab(initialTabIndex)
    
    const urlParams = new URLSearchParams(window.location.search)
    const searchParam = urlParams.get('search')
    if (searchParam) {
      setSearchTerm(searchParam)
    }
  }, [])
  
  useEffect(() => {
    const currentTabIndex = getTabIndexFromUrl()
    setActiveTab(currentTabIndex)
  }, [searchParams, getTabIndexFromUrl])
  
  useEffect(() => {
    const filtered = filterAppsBySearchTerm(
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
  const getFilteredAppsByTab = useMemo(() => {
    const filterMap = new Map([
      [0, filteredApps], // All Apps
      [
        1,
        featuredApps.filter((app) =>
          filteredApps.some(
            (filteredApp) => filteredApp.chain === app.chain && filteredApp.appName === app.appName
          )
        )
      ], // Featured Apps
      [
        2,
        newApps.filter((app) =>
          filteredApps.some(
            (filteredApp) => filteredApp.chain === app.chain && filteredApp.appName === app.appName
          )
        )
      ],
      // New Apps
      [
        3,
        trendingApps.filter((app) =>
          filteredApps.some(
            (filteredApp) => filteredApp.chain === app.chain && filteredApp.appName === app.appName
          )
        )
      ], // Trending Apps
      [
        4,
        isSignedIn
          ? favoriteApps.filter((app) =>
              filteredApps.some(
                (filteredApp) =>
                  filteredApp.chain === app.chain && filteredApp.appName === app.appName
              )
            )
          : []
      ] // Favorite Apps
    ])

    return (tabIndex: number) => filterMap.get(tabIndex) || filteredApps
  }, [filteredApps, newApps, trendingApps, favoriteApps, featuredApps, isSignedIn])

  const currentFilteredApps = getFilteredAppsByTab(activeTab)

  const isFiltersApplied = checkedItems.length !== 0
  return (
    <>
      <Container maxWidth="md">
        <Helmet>
          <title>{META_TAGS.ecosystem.title}</title>
          <meta name="description" content={META_TAGS.ecosystem.description} />
          <meta property="og:title" content={META_TAGS.ecosystem.title} />
          <meta property="og:description" content={META_TAGS.ecosystem.description} />
        </Helmet>
        <Stack spacing={0}>
          <SkStack>
            <div className={cls(cmn.flexg)}>
              <h2 className={cls(cmn.nom)}>Ecosystem</h2>
              <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec)}>
                Explore dApps across the SKALE ecosystem
              </p>
            </div>
            <div className={cls(cmn.flex, cmn.flexcv)}>
              <SocialButtons social={SKALE_SOCIAL_LINKS} all />
              <div className={cls(cmn.mleft10)}>
                <SkPageInfoIcon meta_tag={META_TAGS.ecosystem} />
              </div>
            </div>
          </SkStack>
          <Box sx={{ flexGrow: 1 }} className={cls(cmn.mtop20, 'fwmobile')}>
            <SkStack className={cls(cmn.mbott20, cmn.flex, cmn.flexcv)}>
              <SearchComponent
                className={cls(cmn.flexg, [cmn.mri10, !props.isXs], ['fullW', props.isXs])}
                searchTerm={searchTerm}
                setSearchTerm={handleSetSearchTerm}
              />
              <CategoryDisplay
                checkedItems={checkedItems}
                setCheckedItems={handleSetCheckedItems}
                isXs={props.isXs}
              />
            </SkStack>
            <SelectedCategories
              checkedItems={checkedItems}
              setCheckedItems={handleSetCheckedItems}
              filteredAppsCount={currentFilteredApps.length}
            />
            <Tabs
              variant={props.isXs ? 'scrollable' : 'standard'}
              value={activeTab}
              onChange={handleTabChange}
              scrollButtons="auto"
              className={cls(cmn.mbott20, [cmn.mtop20, isFiltersApplied], 'skTabs', 'fwmobile')}
            >
              <Tab
                label="All"
                icon={<GridViewRoundedIcon />}
                iconPosition="start"
                className={cls('btn', 'btnSm', cmn.mri5, 'tab', 'fwmobile')}
              />
              <Tab
                label="Featured"
                icon={<AppShortcutIcon />}
                iconPosition="start"
                className={cls('btn', 'btnSm', cmn.mri5, cmn.mleft5, 'tab', 'fwmobile')}
              />
              <Tab
                label="New"
                icon={<StarRoundedIcon />}
                iconPosition="start"
                className={cls('btn', 'btnSm', cmn.mri5, cmn.mleft5, 'tab', 'fwmobile')}
              />
              <Tab
                label="Trending"
                icon={<TrendingUpRoundedIcon />}
                iconPosition="start"
                className={cls('btn', 'btnSm', cmn.mri5, cmn.mleft5, 'tab', 'fwmobile')}
              />
              <Tab
                label="Favorites"
                icon={<FavoriteRoundedIcon />}
                iconPosition="start"
                className={cls('btn', 'btnSm', cmn.mri5, cmn.mleft5, 'tab', 'fwmobile')}
              />
            </Tabs>
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
            {activeTab === 4 && (
              <FavoriteApps
                chainsMeta={props.chainsMeta}
                skaleNetwork={props.mpc.config.skaleNetwork}
                newApps={newApps}
                featuredApps={featuredApps}
                filteredApps={currentFilteredApps}
                trendingApps={trendingApps}
                favoriteApps={favoriteApps}
                isSignedIn={isSignedIn}
                error={null}
              />
            )}
          </Box>
        </Stack>
        <div className={cls(cmn.flex, cmn.mtop20, cmn.mbott20)}>
          <div className={cls(cmn.flexg)}></div>
          <div>
            <a target="_blank" rel="noreferrer" href={SUBMIT_PROJECT_URL} className="undec">
              <Button
                size="medium"
                variant="contained"
                className={cls('btn', cmn.mtop20, cmn.mbott20, cmn.pCent)}
                startIcon={<AddCircleOutlineRoundedIcon />}
              >
                Submit Your Project
              </Button>
            </a>
          </div>
          <div className={cls(cmn.flexg)}></div>
        </div>
      </Container>

      {}
      <ScrollToTopButton />
    </>
  )
}

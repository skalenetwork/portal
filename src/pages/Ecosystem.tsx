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
 * @file Ecosystem.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet'

import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import { Tab, Tabs } from '@mui/material'

import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'

import { type types } from '@/core'

import { cmn, cls, type MetaportCore } from '@skalenetwork/metaport'
import { META_TAGS } from '../core/meta'
import CategoryDisplay from '../components/ecosystem/Categories'
import {
  filterAppsByCategory,
  filterAppsBySearchTerm,
  getAllApps,
  sortAppsByAlias
} from '../core/ecosystem/apps'

import SearchComponent from '../components/ecosystem/AppSearch'
import SelectedCategories from '../components/ecosystem/SelectedCategories'
import SkStack from '../components/SkStack'
import { useUrlParams } from '../core/ecosystem/urlParamsUtil'
import { getRecentApps } from '../core/ecosystem/utils'

import AllApps from '../components/ecosystem/AllApps'
import NewApps from '../components/ecosystem/NewApps'
import FavoriteApps from '../components/ecosystem/FavoriteApps'
import TrendingApps from '../components/ecosystem/TrendingApps'
import { MAX_APPS_DEFAULT, SKALE_SOCIAL_LINKS } from '../core/constants'
import SocialButtons from '../components/ecosystem/Socials'

export default function Ecosystem(props: {
  mpc: MetaportCore
  chainsMeta: types.ChainsMetadataMap
  isXs: boolean
}) {
  const { getCheckedItemsFromUrl, setCheckedItemsInUrl, getTabIndexFromUrl, setTabIndexInUrl } =
    useUrlParams()
  const allApps = useMemo(() => sortAppsByAlias(getAllApps(props.chainsMeta)), [props.chainsMeta])
  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const [filteredApps, setFilteredApps] = useState<types.AppWithChainAndName[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [loaded, setLoaded] = useState<boolean>(false)

  const newApps = useMemo(
    () => getRecentApps(props.chainsMeta, MAX_APPS_DEFAULT),
    [props.chainsMeta]
  )

  useEffect(() => {
    const initialCheckedItems = getCheckedItemsFromUrl()
    setCheckedItems(initialCheckedItems)
    const initialTabIndex = getTabIndexFromUrl()
    setActiveTab(initialTabIndex)
  }, [])

  useEffect(() => {
    const filtered = filterAppsBySearchTerm(
      filterAppsByCategory(allApps, checkedItems),
      searchTerm,
      props.chainsMeta
    )
    setFilteredApps(filtered)
    setLoaded(true)
  }, [allApps, checkedItems, searchTerm])

  const handleSetCheckedItems = (newCheckedItems: string[]) => {
    setCheckedItems(newCheckedItems)
    setCheckedItemsInUrl(newCheckedItems)
  }

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
    setTabIndexInUrl(newValue)
  }

  const filteredNewApps = useMemo(() => {
    return newApps.filter((app) =>
      filteredApps.some(
        (filteredApp) => filteredApp.chain === app.chain && filteredApp.appName === app.app
      )
    )
  }, [newApps, filteredApps])

  return (
    <Container maxWidth="md">
      <Helmet>
        <title>{META_TAGS.apps.title}</title>
        <meta name="description" content={META_TAGS.apps.description} />
        <meta property="og:title" content={META_TAGS.apps.title} />
        <meta property="og:description" content={META_TAGS.apps.description} />
      </Helmet>
      <Stack spacing={0}>
        <div className={cls(cmn.flex, cmn.flexcv)}>
          <div className={cls(cmn.flexg)}>
            <h2 className={cls(cmn.nom)}>Ecosystem</h2>
            <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec)}>
              Explore dApps across the SKALE ecosystem
            </p>
          </div>
          <div>
            <SocialButtons social={SKALE_SOCIAL_LINKS} />
          </div>
        </div>
        <Box sx={{ flexGrow: 1 }} className={cls(cmn.mtop20, 'fwmobile')}>
          <SkStack className={cls(cmn.mbott20, cmn.flex, cmn.flexcv)}>
            <SearchComponent
              className={cls(cmn.flexg, [cmn.mri10, !props.isXs], ['fullW', props.isXs])}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
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
            filteredAppsCount={filteredApps.length}
          />
          <Tabs
            variant={props.isXs ? 'scrollable' : 'standard'}
            value={activeTab}
            onChange={handleTabChange}
            scrollButtons="auto"
            className={cls(
              cmn.mbott20,
              [cmn.mtop20, Object.keys(checkedItems).length !== 0],
              'skTabs',
              'fwmobile'
            )}
          >
            <Tab
              label="All"
              icon={<GridViewRoundedIcon />}
              iconPosition="start"
              className={cls('btn', 'btnSm', cmn.mri5, 'tab', 'fwmobile')}
            />
            <Tab
              label="New"
              icon={<StarRoundedIcon />}
              iconPosition="start"
              className={cls('btn', 'btnSm', cmn.mri5, cmn.mleft5, 'tab', 'fwmobile')}
            />
            <Tab
              label="Favorites"
              icon={<FavoriteRoundedIcon />}
              iconPosition="start"
              className={cls('btn', 'btnSm', cmn.mri5, cmn.mleft5, 'tab', 'fwmobile')}
            />
            <Tab
              label="Trending"
              icon={<TimelineRoundedIcon />}
              iconPosition="start"
              className={cls('btn', 'btnSm', cmn.mri5, cmn.mleft5, 'tab', 'fwmobile')}
            />
          </Tabs>

          {activeTab === 0 && (
            <AllApps
              apps={filteredApps}
              skaleNetwork={props.mpc.config.skaleNetwork}
              chainsMeta={props.chainsMeta}
              newApps={newApps}
              loaded={loaded}
            />
          )}
          {activeTab === 1 && (
            <NewApps
              newApps={filteredNewApps}
              skaleNetwork={props.mpc.config.skaleNetwork}
              chainsMeta={props.chainsMeta}
            />
          )}
          {activeTab === 2 && (
            <FavoriteApps
              chainsMeta={props.chainsMeta}
              skaleNetwork={props.mpc.config.skaleNetwork}
              newApps={newApps}
            />
          )}
          {activeTab === 3 && (
            <TrendingApps
              chainsMeta={props.chainsMeta}
              skaleNetwork={props.mpc.config.skaleNetwork}
              newApps={newApps}
            />
          )}
        </Box>
      </Stack>
    </Container>
  )
}

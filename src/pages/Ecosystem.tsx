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
import { Button, Tab, Tabs } from '@mui/material'

import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'

import { type types } from '@/core'

import { cmn, cls, type MetaportCore, styles } from '@skalenetwork/metaport'
import { META_TAGS } from '../core/meta'
import CategoryDisplay from '../components/ecosystem/Categories'
import {
  AppWithChainAndName,
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
import { MAX_APPS_DEFAULT, SUBMIT_PROJECT_URL } from '../core/constants'

export default function Ecosystem(props: {
  mpc: MetaportCore
  chainsMeta: types.ChainsMetadataMap
  isXs: boolean
}) {
  const { getCheckedItemsFromUrl, setCheckedItemsInUrl, getTabIndexFromUrl, setTabIndexInUrl } =
    useUrlParams()
  const allApps = useMemo(() => sortAppsByAlias(getAllApps(props.chainsMeta)), [props.chainsMeta])
  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const [filteredApps, setFilteredApps] = useState<AppWithChainAndName[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState(0)

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
    const filtered = filterAppsBySearchTerm(filterAppsByCategory(allApps, checkedItems), searchTerm)
    setFilteredApps(filtered)
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
        <div className={cls(cmn.flex)}>
          <h2 className={cls(cmn.nom)}>Ecosystem</h2>
        </div>
        <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec)}>
          Explore dApps across the SKALE ecosystem
        </p>
        <Box sx={{ flexGrow: 1 }} className={cls(cmn.mtop20)}>
          <SkStack className={cls(cmn.mbott20, cmn.flex, cmn.flexcv)}>
            <SearchComponent
              className={cls(cmn.flexg, cmn.mri20)}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
            <CategoryDisplay checkedItems={checkedItems} setCheckedItems={handleSetCheckedItems} />
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
            />
          )}
          {activeTab === 1 && (
            <NewApps
              newApps={filteredNewApps}
              skaleNetwork={props.mpc.config.skaleNetwork}
              chainsMeta={props.chainsMeta}
            />
          )}
          {activeTab === 2 && <FavoriteApps />}
          {activeTab === 3 && <TrendingApps />}

          <div className={cls(cmn.flex)}>
            <div className={cls(cmn.flex, cmn.flexg)}></div>
            <div className={cls(cmn.flex, cmn.mtop20, cmn.ptop20, cmn.mbott20)}>
              <a target="_blank" rel="noreferrer" href={SUBMIT_PROJECT_URL} className="undec">
                <Button
                  variant="contained"
                  size="medium"
                  className={cls('btn')}
                  startIcon={<EditRoundedIcon className={cls(styles.chainIconxs)} />}
                >
                  Submit Your Project
                </Button>
              </a>
            </div>
            <div className={cls(cmn.flex, cmn.flexg)}></div>
          </div>
        </Box>
      </Stack>
    </Container>
  )
}

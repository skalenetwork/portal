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
 * @file Start.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { Link } from 'react-router-dom'

import { cmn, cls } from '@skalenetwork/metaport'
import { type types } from '@/core'

import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { Button } from '@mui/material'

import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'

import LabelImportantRoundedIcon from '@mui/icons-material/LabelImportantRounded'
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import PieChartOutlineRoundedIcon from '@mui/icons-material/PieChartOutlineRounded'
import OutboundRoundedIcon from '@mui/icons-material/OutboundRounded'

import PageCard from '../components/PageCard'
import AppCard from '../components/ecosystem/AppCardV2'

import { useEffect, useMemo, useState } from 'react'
import CategoryCardsGrid from '../components/ecosystem/CategoryCardsGrid'
import { getRecentApps } from '../core/ecosystem/utils'
import { MAX_APPS_DEFAULT } from '../core/constants'
import NewApps from '../components/ecosystem/NewApps'
import Carousel from '../components/Carousel'

export default function Start(props: {
  isXs: boolean
  skaleNetwork: types.SkaleNetwork
  topApps: types.IAppId[] | null
  loadData: () => Promise<void>
  chainsMeta: types.ChainsMetadataMap
}) {
  const [_, setIntervalId] = useState<NodeJS.Timeout>()
  const newApps = useMemo(
    () => getRecentApps(props.chainsMeta, MAX_APPS_DEFAULT),
    [props.chainsMeta]
  )

  useEffect(() => {
    props.loadData()
    const intervalId = setInterval(props.loadData, 10000)
    setIntervalId(intervalId)
  }, [])

  let appCards: any = []

  function isLegacyApp(chain: string, app: string): boolean {
    if (props.chainsMeta[chain].apps === undefined) return false
    if (!props.chainsMeta[chain].apps![app]) return false
    return !!props.chainsMeta[chain].apps![app].legacy
  }

  const apps = props.topApps
    ? props.topApps.filter((topApp) => !isLegacyApp(topApp.chain, topApp.app))
    : null

  if (apps) {
    appCards = apps.slice(0, 11).map(
      (
        topApp: types.IAppId // todo: use max apps!
      ) => (
        <AppCard
          key={topApp.chain + topApp.app}
          skaleNetwork={props.skaleNetwork}
          schainName={topApp.chain}
          appName={topApp.app}
          transactions={topApp.totalTransactions}
          chainsMeta={props.chainsMeta}
        />
      )
    )
  }

  return (
    <Container maxWidth="md" className="paddBott60">
      <Stack spacing={0}>
        <h2 className={cls(cmn.nom)}>Welcome to SKALE</h2>
        <div className={cls(cmn.flex, cmn.flexcv, cmn.mbott10, cmn.mtop20)}>
          <RocketLaunchRoundedIcon color="primary" />
          <h3 className={cls(cmn.p, cmn.p600, cmn.pSec, cmn.mleft10)}>Explore Portal</h3>
        </div>

        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3}>
            <Grid className="fl-centered dappCard" item lg={6} md={6} sm={6} xs={12}>
              <PageCard
                name="bridge"
                description="Transfer tokens between 50+ chains"
                icon={<SwapHorizontalCircleOutlinedIcon />}
              />
            </Grid>
            <Grid className="fl-centered dappCard" item lg={6} md={6} sm={6} xs={12}>
              <PageCard
                description="Manage delegations and validators"
                name="stake"
                icon={<PieChartOutlineRoundedIcon />}
              />
            </Grid>
            <Grid className="fl-centered dappCard" item lg={6} md={6} sm={6} xs={12}>
              <PageCard
                description="Chains info, block explorers and endpoints"
                name="chains"
                icon={<LinkRoundedIcon />}
              />
            </Grid>
            <Grid className="fl-centered dappCard" item lg={6} md={6} sm={6} xs={12}>
              <PageCard
                description="Discover apps and games on SKALE"
                name="ecosystem"
                icon={<PublicOutlinedIcon />}
              />
            </Grid>
          </Grid>
        </Box>

        <div className={cls(cmn.flex, cmn.flexcv, cmn.mbott10, cmn.mtop20, cmn.ptop20)}>
          <LabelImportantRoundedIcon color="primary" />
          <h3 className={cls(cmn.p, cmn.p600, cmn.pSec, cmn.mleft10, cmn.flexg)}>
            New dApps on SKALE
          </h3>
          <Link to={`/ecosystem?tab=1`}>
            <Button className={cls('btn btnSm bg', cmn.pPrim)}>See all</Button>
          </Link>
        </div>
        <NewApps
          newApps={newApps}
          skaleNetwork={props.skaleNetwork}
          chainsMeta={props.chainsMeta}
          useCarousel={true}
        />
        <div className={cls(cmn.flex, cmn.flexcv, cmn.mbott10, cmn.mtop20, cmn.ptop20)}>
          <TrendingUpRoundedIcon color="primary" />
          <h3 className={cls(cmn.p, cmn.p600, cmn.pSec, cmn.mleft10, cmn.flexg)}>
            Trending dApps on SKALE
          </h3>
          <Link to={`/ecosystem?tab=3`}>
            <Button className={cls('btn btnSm bg', cmn.pPrim)}>See all</Button>
          </Link>
        </div>
        <Carousel>{appCards}</Carousel>
      </Stack>

      <div className={cls(cmn.flex, cmn.flexcv, cmn.mbott10, cmn.mtop20, cmn.ptop20)}>
        <OutboundRoundedIcon color="primary" />
        <h3 className={cls(cmn.p, cmn.p600, cmn.pSec, cmn.mleft10)}>Top Categories</h3>
      </div>
      <CategoryCardsGrid chainsMeta={props.chainsMeta} />
    </Container>
  )
}

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

import { cmn, cls } from '@skalenetwork/metaport'
import { type types } from '@/core'

import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'

import LabelImportantRoundedIcon from '@mui/icons-material/LabelImportantRounded'
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import PieChartOutlineRoundedIcon from '@mui/icons-material/PieChartOutlineRounded'

import PageCard from '../components/PageCard'
import AppCard from '../components/ecosystem/AppCardV2'

import { useEffect, useState } from 'react'
import FeaturedApps from '../components/FeaturedApps'

export default function Start(props: {
  isXs: boolean
  skaleNetwork: types.SkaleNetwork
  topApps: types.IAppId[] | null
  loadData: () => Promise<void>
  chainsMeta: types.ChainsMetadataMap
}) {
  const [_, setIntervalId] = useState<NodeJS.Timeout>()

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
    appCards = apps.slice(0, 3).map((topApp: types.IAppId) => (
      <Grid key={topApp.app} className="fl-centered dappCard" item lg={4} md={4} sm={6} xs={6}>
        <AppCard
          skaleNetwork={props.skaleNetwork}
          schainName={topApp.chain}
          appName={topApp.app}
          transactions={topApp.totalTransactions}
          chainsMeta={props.chainsMeta}
        />
      </Grid>
    ))
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
                description="Apps, games, block explorers and endpoints"
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
          <h3 className={cls(cmn.p, cmn.p600, cmn.pSec, cmn.mleft10)}>New dApps on SKALE</h3>
        </div>
        <FeaturedApps chainsMeta={props.chainsMeta} skaleNetwork={props.skaleNetwork} />

        <div className={cls(cmn.flex, cmn.flexcv, cmn.mbott10, cmn.mtop20, cmn.ptop20)}>
          <TrendingUpRoundedIcon color="primary" />
          <h3 className={cls(cmn.p, cmn.p600, cmn.pSec, cmn.mleft10)}>Trending dApps on SKALE</h3>
        </div>

        <Grid container spacing={2}>
          {appCards}
        </Grid>
      </Stack>
    </Container>
  )
}

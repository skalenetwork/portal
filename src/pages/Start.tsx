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

import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import LabelImportantRoundedIcon from '@mui/icons-material/LabelImportantRounded'
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import PieChartOutlineRoundedIcon from '@mui/icons-material/PieChartOutlineRounded'
import OutboundRoundedIcon from '@mui/icons-material/OutboundRounded'

import PageCard from '../components/PageCard'

import { useEffect, useMemo, useState } from 'react'
import CategoryCardsGrid from '../components/ecosystem/CategoryCardsGrid'
import { getRecentApps } from '../core/ecosystem/utils'
import { MAX_APPS_DEFAULT } from '../core/constants'
import NewApps from '../components/ecosystem/NewApps'
import Headline from '../components/Headline'
import FavoriteApps from '../components/ecosystem/FavoriteApps'
import TrendingApps from '../components/ecosystem/TrendingApps'

export default function Start(props: {
  isXs: boolean
  skaleNetwork: types.SkaleNetwork
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

  return (
    <Container maxWidth="md" className="paddBott60">
      <Stack spacing={0}>
        <h2 className={cls(cmn.nom)}>Welcome to SKALE</h2>
        <Headline
          text="Explore Portal"
          icon={<RocketLaunchRoundedIcon color="primary" />}
          className={cls(cmn.mbott10, cmn.mtop20)}
        />
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
          <Headline text="Your Favorites" icon={<FavoriteRoundedIcon color="primary" />} />
          <Link to={`/ecosystem?tab=2`}>
            <Button className={cls('btn btnSm bg', cmn.pPrim)}>See all</Button>
          </Link>
        </div>
        <FavoriteApps
          skaleNetwork={props.skaleNetwork}
          chainsMeta={props.chainsMeta}
          useCarousel={true}
        />
        <div className={cls(cmn.flex, cmn.flexcv, cmn.mbott10, cmn.mtop20, cmn.ptop20)}>
          <Headline
            text="New dApps on SKALE"
            icon={<LabelImportantRoundedIcon color="primary" />}
          />
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
          <Headline
            text="Trending dApps on SKALE"
            icon={<TrendingUpRoundedIcon color="primary" />}
          />
          <Link to={`/ecosystem?tab=3`}>
            <Button className={cls('btn btnSm bg', cmn.pPrim)}>See all</Button>
          </Link>
        </div>
        <TrendingApps chainsMeta={props.chainsMeta} skaleNetwork={props.skaleNetwork} useCarousel />
      </Stack>
      <Headline
        text="Top Categories"
        icon={<OutboundRoundedIcon color="primary" />}
        className={cls(cmn.mbott10, cmn.mtop20, cmn.ptop20)}
      />
      <CategoryCardsGrid chainsMeta={props.chainsMeta} />
    </Container>
  )
}

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

import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import SwapHorizontalCircleOutlinedIcon from '@mui/icons-material/SwapHorizontalCircleOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import WalletOutlinedIcon from '@mui/icons-material/WalletOutlined'

import PageCard from '../components/PageCard'

import { cmn, cls, interfaces } from '@skalenetwork/metaport'
import AppCard from '../components/AppCard'
import { ITopAppInfo } from '../core/types'
import { useEffect, useState } from 'react'

export default function Start(props: {
  isXs: boolean
  skaleNetwork: interfaces.SkaleNetwork
  topApps: ITopAppInfo[] | null
  loadData: () => Promise<void>
  chainsMeta: interfaces.ChainsMetadataMap
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

  if (props.topApps) {
    appCards = props.topApps.map((topApp: ITopAppInfo) =>
      !isLegacyApp(topApp.chain, topApp.app) ? (
        <Grid key={topApp.app} className="fl-centered dappCard" item lg={3} md={4} sm={6} xs={6}>
          <AppCard
            skaleNetwork={props.skaleNetwork}
            schainName={topApp.chain}
            appName={topApp.app}
            transactions={topApp.totalTransactions}
            chainsMeta={props.chainsMeta}
          />
        </Grid>
      ) : null
    )
  }

  return (
    <Container maxWidth="md">
      <Stack spacing={0}>
        <div className={cls(cmn.flex, cmn.mdtop20, cmn.ptdop20)}>
          <h3 className={cls(cmn.nom)}>🔥 Top apps on SKALE</h3>
        </div>
        <p className={cls(cmn.nom, cmn.p, cmn.p4, cmn.pSec)}>
          Apps and games with the most transactions
        </p>

        <Grid container spacing={2} className={cls(cmn.mtop5)}>
          {appCards}
        </Grid>

        <div className={cls(cmn.flex, cmn.mtop10, cmn.ptop20)}>
          <h3 className={cls(cmn.nom)}>🪐 Explore Portal</h3>
        </div>
        <p className={cls(cmn.nom, cmn.p, cmn.p4, cmn.pSec)}>
          Popular apps and games on the SKALE Network
        </p>

        <Box sx={{ flexGrow: 1 }} className={cls(cmn.mtop20)}>
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
                description="Apps, games, block explorers and endpoints"
                name="ecosystem"
                icon={<PublicOutlinedIcon />}
              />
            </Grid>
            <Grid className="fl-centered dappCard" item lg={6} md={6} sm={6} xs={12}>
              <PageCard
                description="SKALE Network statistics"
                name="stats"
                icon={<InsertChartOutlinedIcon />}
              />
            </Grid>
            <Grid className="fl-centered dappCard" item lg={6} md={6} sm={6} xs={12}>
              <PageCard
                description="Manage delegations and validators"
                name="staking"
                icon={<WalletOutlinedIcon />}
              />
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Container>
  )
}

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
import Message from '../components/Message'

import { cmn, cls } from '@skalenetwork/metaport'

export default function Start(props: { isXs: boolean }) {
  return (
    <Container maxWidth="md">
      <Stack spacing={0}>
        <div className={cls(cmn.flex)}>
          <h2 className={cls(cmn.nom)}>SKALE Portal</h2>
        </div>
        <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec)} style={{ zIndex: '2' }}>
          Gateway to the SKALE Ecosystem
        </p>
        <Message
          className={cls(cmn.mtop10, cmn.mbott10d)}
          text={props.isXs ? null : 'Transak onramp is live, '}
          linkText={props.isXs ? 'Transak onramp' : 'see changelog'}
          link="/other/changelog"
          icon={
            <div className="shipNew">
              <p className={cls(cmn.p, cmn.p5)}>Update 2.2.1</p>
            </div>
          }
        />
        <Box sx={{ flexGrow: 1 }} className={cls(cmn.mtop20)}>
          <Grid container spacing={3}>
            <Grid className="fl-centered dappCard" item lg={6} md={6} sm={6} xs={12}>
              <PageCard
                name="bridge"
                description="Transfer tokens without gas fees"
                icon={<SwapHorizontalCircleOutlinedIcon />}
              />
            </Grid>
            <Grid className="fl-centered dappCard" item lg={6} md={6} sm={6} xs={12}>
              <PageCard
                description="Chains list, block explorers and endpoints"
                name="chains"
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

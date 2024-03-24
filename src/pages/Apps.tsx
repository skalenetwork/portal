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
 * @file Apps.tsx
 * @copyright SKALE Labs 2024-Present
 */
import { ReactElement } from 'react'
import { Helmet } from 'react-helmet'

import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

import ChainCard from '../components/ChainCard'
import AppCard from '../components/AppCard'

import { cmn, cls, type MetaportCore, CHAINS_META, type interfaces } from '@skalenetwork/metaport'
import { META_TAGS } from '../core/meta'

export default function Apps(props: { mpc: MetaportCore }) {
  const chainsMeta: interfaces.ChainsMetadataMap = CHAINS_META[props.mpc.config.skaleNetwork]
  const appCards: ReactElement[] = []

  for (const schainName in chainsMeta) {
    if (chainsMeta.hasOwnProperty(schainName)) {
      const schain = chainsMeta[schainName]
      if (schain.apps) {
        for (const appName in schain.apps) {
          if (schain.apps.hasOwnProperty(appName)) {
            appCards.push(
              <Grid key={appName} className="fl-centered dappCard" item lg={3} md={4} sm={6} xs={6}>
                <AppCard
                  skaleNetwork={props.mpc.config.skaleNetwork}
                  schainName={schainName}
                  appName={appName}
                />
              </Grid>
            )
          }
        }
      }
    }
  }

  return (
    <Container maxWidth="md">
      <Helmet>
        <title>{META_TAGS.chains.title}</title>
        <meta name="description" content={META_TAGS.apps.description} />
        <meta property="og:title" content={META_TAGS.apps.title} />
        <meta property="og:description" content={META_TAGS.apps.description} />
      </Helmet>
      <Stack spacing={0}>
        <div className={cls(cmn.flex)}>
          <h2 className={cls(cmn.nom)}>Apps</h2>
        </div>
        <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec)}>
          Explore and interact with dApps on SKALE Network.
        </p>
        <Box sx={{ flexGrow: 1 }} className={cls(cmn.mtop20)}>
          <Grid container spacing={2}>
            {appCards}
          </Grid>
        </Box>
      </Stack>
    </Container>
  )
}

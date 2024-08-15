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
 * @file Chains.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { Helmet } from 'react-helmet'

import { useState, useEffect } from 'react'

import { cmn, cls, type MetaportCore } from '@skalenetwork/metaport'
import { type types } from '@/core'

import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'

import StarRoundedIcon from '@mui/icons-material/StarRounded'
import HubRoundedIcon from '@mui/icons-material/HubRounded'

import ChainsSection from '../components/chains/ChainsSection'
import { META_TAGS } from '../core/meta'

export default function Chains(props: {
  loadData: () => Promise<void>
  schains: types.ISChain[]
  metrics: types.IMetrics | null
  mpc: MetaportCore
  isXs: boolean
  chainsMeta: types.ChainsMetadataMap
}) {
  const [_, setIntervalId] = useState<NodeJS.Timeout>()

  useEffect(() => {
    props.loadData()
    const intervalId = setInterval(props.loadData, 10000)
    setIntervalId(intervalId)
  }, [])

  if (props.schains.length === 0) {
    return (
      <div className="fullscreen-msg">
        <div className={cls(cmn.flex)}>
          <div className={cls(cmn.flex, cmn.flexcv, cmn.mri20)}>
            <CircularProgress className="fullscreen-spin" />
          </div>
          <div className={cls(cmn.flex, cmn.flexcv)}>
            <h3 className="fullscreen-msg-text">Loading SKALE Chains</h3>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Container maxWidth="md" className={cls(cmn.mbott20)}>
      <Helmet>
        <title>{META_TAGS.chains.title}</title>
        <meta name="description" content={META_TAGS.chains.description} />
        <meta property="og:title" content={META_TAGS.chains.title} />
        <meta property="og:description" content={META_TAGS.chains.description} />
      </Helmet>
      <Stack spacing={0}>
        <div className={cls(cmn.flex)}>
          <h2 className={cls(cmn.nom)}>SKALE Chains</h2>
        </div>
        <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec)}>
          Connect, get block explorer links and endpoints
        </p>

        <ChainsSection
          name="SKALE Hubs"
          schains={props.schains.filter(
            (schain) =>
              props.chainsMeta[schain.name] &&
              props.chainsMeta[schain.name].apps &&
              Object.keys(props.chainsMeta[schain.name].apps!).length > 1
          )}
          chainsMeta={props.chainsMeta}
          metrics={props.metrics}
          skaleNetwork={props.mpc.config.skaleNetwork}
          size="lg"
          icon={<HubRoundedIcon color="primary" />}
        />
        <ChainsSection
          name="App Chains"
          schains={props.schains.filter(
            (schain) =>
              props.chainsMeta[schain.name] &&
              (!props.chainsMeta[schain.name].apps ||
                (!props.chainsMeta[schain.name].apps &&
                  Object.keys(props.chainsMeta[schain.name].apps!).length === 1))
          )}
          chainsMeta={props.chainsMeta}
          metrics={props.metrics}
          skaleNetwork={props.mpc.config.skaleNetwork}
          size="md"
          icon={<StarRoundedIcon color="primary" />}
        />
      </Stack>
    </Container>
  )
}

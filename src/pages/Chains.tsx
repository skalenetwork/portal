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
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'

import ChainsSection from '../components/chains/ChainsSection'
import { META_TAGS } from '../core/meta'
import { MAINNET_CHAIN_NAME } from '../core/constants'

export default function Chains(props: {
  loadData: () => Promise<void>
  schains: types.ISChain[]
  metrics: types.IMetrics | null
  mpc: MetaportCore
  isXs: boolean
  chainsMeta: types.ChainsMetadataMap
}) {
  const [_, setIntervalId] = useState<NodeJS.Timeout>()

  const network = props.mpc.config.skaleNetwork

  useEffect(() => {
    props.loadData()
    const intervalId = setInterval(props.loadData, 10000)
    setIntervalId(intervalId)
  }, [])

  const appChains = props.schains.filter(
    (schain) =>
      props.chainsMeta[schain.name] &&
      (!props.chainsMeta[schain.name].apps ||
        (props.chainsMeta[schain.name].apps &&
          Object.keys(props.chainsMeta[schain.name].apps!).length === 1))
  )

  const otherChains = props.schains.filter((schain) => !props.chainsMeta[schain.name])

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
          skaleNetwork={network}
          size="lg"
          icon={<HubRoundedIcon color="primary" />}
        />
        {appChains.length !== 0 && (
          <ChainsSection
            name="App Chains"
            schains={appChains}
            chainsMeta={props.chainsMeta}
            metrics={props.metrics}
            skaleNetwork={network}
            size="md"
            icon={<StarRoundedIcon color="primary" />}
          />
        )}
        {network !== MAINNET_CHAIN_NAME && otherChains.length !== 0 && (
          <ChainsSection
            name="Other Chains"
            schains={otherChains}
            chainsMeta={props.chainsMeta}
            metrics={props.metrics}
            skaleNetwork={network}
            size="md"
            icon={<CategoryRoundedIcon color="primary" />}
          />
        )}
      </Stack>
    </Container>
  )
}

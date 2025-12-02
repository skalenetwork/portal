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

import { type MetaportCore } from '@skalenetwork/metaport'
import { type types, constants } from '@/core'

import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'

import { Star, Network, Shapes } from 'lucide-react'

import ChainsSection from '../components/chains/ChainsSection'
import { META_TAGS } from '../core/meta'
import SkPageInfoIcon from '../components/SkPageInfoIcon'

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
      !props.chainsMeta[schain.name].alias?.includes('SKALE') &&
      (!props.chainsMeta[schain.name].apps ||
        (props.chainsMeta[schain.name].apps &&
          Object.keys(props.chainsMeta[schain.name].apps!).length === 1))
  )

  const otherChains = props.schains.filter((schain) => !props.chainsMeta[schain.name])

  if (props.schains.length === 0) {
    return (
      <div className="fullscreen-msg">
        <div className="flex">
          <div className="flex items-center mr-5">
            <CircularProgress className="fullscreen-spin" />
          </div>
          <div className="flex items-center">
            <h3 className="fullscreen-msg-text text-foreground! font-semibold">
              Loading SKALE Chains
            </h3>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Container maxWidth="md" className="mb-5">
      <Helmet>
        <title>{META_TAGS.chains.title}</title>
        <meta name="description" content={META_TAGS.chains.description} />
        <meta property="og:title" content={META_TAGS.chains.title} />
        <meta property="og:description" content={META_TAGS.chains.description} />
      </Helmet>
      <Stack spacing={0}>
        <div className="flex items-center">
          <div className="grow">
            <h2 className="m-0 text-xl font-bold text-foreground">SKALE Chains</h2>
            <p className="text-xs text-secondary-foreground font-semibold">
              Connect, get block explorer links and endpoints
            </p>
          </div>
          <SkPageInfoIcon meta_tag={META_TAGS.chains} />
        </div>
        <ChainsSection
          name="SKALE Hubs"
          schains={props.schains.filter(
            (schain) =>
              (props.chainsMeta[schain.name] &&
                props.chainsMeta[schain.name].apps &&
                Object.keys(props.chainsMeta[schain.name].apps!).length > 1) ||
              props.chainsMeta[schain.name]?.alias?.includes('SKALE')
          )}
          chainsMeta={props.chainsMeta}
          metrics={props.metrics}
          skaleNetwork={network}
          size="lg"
          icon={<Network size={18} />}
        />
        {appChains.length !== 0 && (
          <ChainsSection
            name="App Chains"
            schains={appChains}
            chainsMeta={props.chainsMeta}
            metrics={props.metrics}
            skaleNetwork={network}
            size="md"
            icon={<Star size={18} />}
          />
        )}
        {network !== constants.MAINNET_CHAIN_NAME && otherChains.length !== 0 && (
          <ChainsSection
            name="Other Chains"
            schains={otherChains}
            chainsMeta={props.chainsMeta}
            metrics={props.metrics}
            skaleNetwork={network}
            size="md"
            icon={<Shapes size={18} />}
          />
        )}
        <div className="mb-5 mt-5"></div>
      </Stack>
    </Container>
  )
}

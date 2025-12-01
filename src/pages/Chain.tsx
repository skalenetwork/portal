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
 * @file Schain.tsx
 * @copyright SKALE Labs 2022-Present
 */

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'

import { type MetaportCore } from '@skalenetwork/metaport'
import { type types, metadata } from '@/core'

import SchainDetails from '../components/SchainDetails'
import ErrorTile from '../components/ErrorTile'

export default function Chain(props: {
  loadData: () => Promise<void>
  schains: types.ISChain[]
  stats: types.IStats | null
  metrics: types.IMetrics | null
  mpc: MetaportCore
  chainsMeta: types.ChainsMetadataMap
  isXs: boolean
}) {
  const [schainStats, setSchainStats] = useState<types.IStatsData | null>(null)
  const [schainMetrics, setSchainMetrics] = useState<types.IChainMetrics | null>(null)

  let { name } = useParams()
  const chainName: string = metadata.findChainName(props.chainsMeta, name ?? '')
  const chain = props.schains.find((schain) => schain.name === chainName)

  useEffect(() => {
    props.loadData()
  }, [])

  useEffect(() => {
    if (props.stats !== null && props.stats.schains[chainName]) {
      setSchainStats(props.stats.schains[chainName].total)
    }
  }, [props.stats])

  useEffect(() => {
    if (props.metrics !== null && props.metrics.metrics[chainName]) {
      setSchainMetrics(props.metrics.metrics[chainName])
    }
  }, [props.metrics])

  if (props.schains.length === 0) {
    return (
      <div className="fullscreen-msg">
        <div className="flex">
          <div className="flex items-center mr-5">
            <CircularProgress className="fullscreen-spin" />
          </div>
          <div className="flex items-center">
            <h3 className="fullscreen-msg-text text-foreground! font-semibold">
              Loading SKALE Chain
            </h3>
          </div>
        </div>
      </div>
    )
  }

  if (chain === undefined || chain === null) {
    return (
      <Container maxWidth="md">
        <ErrorTile errorMsg={`No such chain: ${chainName}`} />
      </Container>
    )
  }

  return (
    <Container maxWidth="md">
      <SchainDetails
        chain={chain}
        chainsMeta={props.chainsMeta}
        schainStats={schainStats}
        schainMetrics={schainMetrics}
        mpc={props.mpc}
        isXs={props.isXs}
      />
    </Container>
  )
}

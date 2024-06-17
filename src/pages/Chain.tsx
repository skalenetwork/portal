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
import Container from '@mui/material/Container'
import SchainDetails from '../components/SchainDetails'
import CircularProgress from '@mui/material/CircularProgress'

import { cmn, cls, type MetaportCore, type interfaces } from '@skalenetwork/metaport'
import { IChainMetrics, IMetrics, ISChain, IStats, IStatsData } from '../core/types'
import { findChainName } from '../core/chain'

export default function Schain(props: {
  loadData: any
  schains: ISChain[]
  stats: IStats | null
  metrics: IMetrics | null
  mpc: MetaportCore
  chainsMeta: interfaces.ChainsMetadataMap
}) {
  const [schainStats, setSchainStats] = useState<IStatsData | null>(null)
  const [schainMetrics, setSchainMetrics] = useState<IChainMetrics | null>(null)

  let { name } = useParams()
  const chainName: string = findChainName(props.chainsMeta, name ?? '')
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
        <div className={cls(cmn.flex)}>
          <div className={cls(cmn.flex, cmn.flexcv, cmn.mri20)}>
            <CircularProgress className="fullscreen-spin" />
          </div>
          <div className={cls(cmn.flex, cmn.flexcv)}>
            <h3 className="fullscreen-msg-text">Loading SKALE Chain</h3>
          </div>
        </div>
      </div>
    )
  }

  if (chain === undefined || chain === null) {
    return <h1>No such chain: {chainName}</h1>
  }

  return (
    <Container maxWidth="md">
      <SchainDetails
        schainName={chainName}
        chain={chain}
        chainsMeta={props.chainsMeta}
        schainStats={schainStats}
        schainMetrics={schainMetrics}
        mpc={props.mpc}
      />
    </Container>
  )
}

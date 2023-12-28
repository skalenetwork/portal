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

import { useEffect } from 'react'

import { useParams } from 'react-router-dom'
import Container from '@mui/material/Container'
import SchainDetails from '../components/SchainDetails'
import CircularProgress from '@mui/material/CircularProgress'

import { cmn, cls, type MetaportCore, CHAINS_META, type interfaces } from '@skalenetwork/metaport'

export default function Schain(props: { loadSchains: any; schains: any[]; mpc: MetaportCore }) {
  function findChainName(meta: interfaces.ChainsMetadataMap, name: string): string {
    for (const key in meta) {
      if (meta[key].shortAlias === name) {
        return key
      }
    }
    return name
  }

  const chainsMeta: interfaces.ChainsMetadataMap = CHAINS_META[props.mpc.config.skaleNetwork]

  let { name } = useParams()
  name = findChainName(chainsMeta, name ?? '')

  const chain = props.schains.find((schain) => schain[0] === name)

  useEffect(() => {
    if (props.schains.length === 0) {
      props.loadSchains()
    }
  }, [])

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

  if (!chain) {
    return <h1>No such chain: {name}</h1>
  }

  return (
    <Container maxWidth="md">
      <SchainDetails schainName={name} chain={chain} chainMeta={chainsMeta[name]} mpc={props.mpc} />
    </Container>
  )
}

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
 * @file Admin.tsx
 * @copyright SKALE Labs 2023-Present
 */

import Container from '@mui/material/Container'
import { useParams } from 'react-router-dom'
import { type MetaportCore, SkPaper } from '@skalenetwork/metaport'
import { types, metadata } from '@/core'

import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'

import Paymaster from '../components/Paymaster'
import Breadcrumbs from '../components/Breadcrumbs'

export default function Admin(props: { mpc: MetaportCore; chainsMeta: types.ChainsMetadataMap }) {
  let { name } = useParams()
  name = name ?? ''

  const alias = metadata.getAlias(props.mpc.config.skaleNetwork, props.chainsMeta, name)

  return (
    <Container maxWidth="md">
      <SkPaper gray className="mt-2.5 chainDetails">
        <div className="flex">
          <Breadcrumbs
            sections={[
              {
                text: 'All chains',
                icon: <ArrowBackIosNewRoundedIcon />,
                url: '/chains'
              },
              {
                text: alias,
                icon: <LinkRoundedIcon />,
                url: `/chains/${name}`
              },
              {
                text: 'Manage',
                icon: <AdminPanelSettingsRoundedIcon />
              }
            ]}
          />
        </div>
        <div className="mt-2.5 ml-1.25">
          <h2 className="m-0 text-2xl font-bold">Manage {alias}</h2>
          <p className="'mt-1.25' text-sm text-secondary-foreground 'mb-2.5' 'pbott5'">
            {alias} admin area - you can manage the chain here
          </p>
        </div>
        <Paymaster mpc={props.mpc} name={name} chainsMeta={props.chainsMeta} />
      </SkPaper>
    </Container>
  )
}

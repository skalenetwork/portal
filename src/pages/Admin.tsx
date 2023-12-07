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
import Button from '@mui/material/Button'

import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'

import { Link } from 'react-router-dom'
import { cmn, cls, type MetaportCore, getChainAlias, SkPaper } from '@skalenetwork/metaport'

import Paymaster from '../components/Paymaster'

export default function Admin(props: { mpc: MetaportCore }) {
  let { name } = useParams()
  name = name ?? ''

  const network = props.mpc.config.skaleNetwork
  const alias = getChainAlias(network, name)

  return (
    <Container maxWidth="md" className="chainDetails">
      <SkPaper gray className={cls(cmn.mtop10)}>
        <div className={cls(cmn.flex, cmn.flexcv)}>
          <div className={cls(cmn.flex, cmn.flexcv, 'titleBadge')}>
            <div className={cmn.flex}>
              <Link to={'/chains/'} className="undec fullWidth">
                <Button>
                  <ArrowBackIosNewRoundedIcon />
                  <p className={cls(cmn.p, cmn.p4, cmn.mleft5)}>All chains</p>
                </Button>
              </Link>
            </div>
            <p className={cls(cmn.p, cmn.p4)}>|</p>
            <div className={cmn.flex}>
              <Link to={'/chains/' + name} className="undec fullWidth">
                <Button>
                  <p className={cls(cmn.p, cmn.p4)}>{alias}</p>
                </Button>
              </Link>
            </div>
            <p className={cls(cmn.p, cmn.p4)}>|</p>
            <div className={cmn.flex}>
              <div className={cls('titleBadged', cmn.flex, cmn.flexcv, cmn.mleft10, cmn.mri10)}>
                <AdminPanelSettingsRoundedIcon />
                <p className={cls(cmn.p, cmn.p4, cmn.mleft5)}>Manage</p>
              </div>
            </div>
          </div>
        </div>
        <div className={cls(cmn.mtop20, cmn.mleft5)}>
          <h2 className={cls(cmn.nom)}>Manage {alias}</h2>
          <p className={cls(cmn.mtop5, cmn.p, cmn.p3, cmn.pSec)}>
            This is {alias} admin area - you can manage your chain here.
          </p>
        </div>
        <Paymaster mpc={props.mpc} name={name} />
      </SkPaper>
    </Container>
  )
}

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
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'

import { Link } from 'react-router-dom'
import { cmn, cls, styles, type MetaportCore, getChainAlias, SkPaper } from '@skalenetwork/metaport'

import Topup from '../components/Topup'

export default function Admin(props: { mpc: MetaportCore }) {
  let { name } = useParams()
  name = name ?? ''

  // const [expanded, setExpanded] = useState<string | false>('panel1')

  // function handleChange(panel: string | false) {
  //   setExpanded(expanded && panel === expanded ? false : panel)
  // }

  const network = props.mpc.config.skaleNetwork
  const alias = getChainAlias(network, name)

  return (
    <Container maxWidth="md" className="chainDetails">
      {/* <SkPaper background={chainBg(network, name)} className={cls(cmn.mtop10)}> */}
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
        <SkPaper background="transparent" className={cls(cmn.mtop10, cmn.mbott20)}>
          <h2 className={cls(cmn.nom)}>Manage {alias}</h2>
          <p className={cls(cmn.mtop5, cmn.p, cmn.p3, cmn.pSec)}>
            This is {alias} admin area - you can manage your chain here.
          </p>
        </SkPaper>

        <div className={cls(cmn.m10, cmn.flex, cmn.flexg, cmn.flexcv, 'divider')}>
          <div className={cls(cmn.mri10, cmn.flexcv, cmn.flex, styles.chainIconxs)}>
            <PaymentsRoundedIcon />
          </div>
          <p className={cls(cmn.p, cmn.p2, cmn.p700, cmn.flexg)}>Chain top-up</p>
        </div>
        <Topup mpc={props.mpc} name={name} />

        {/* <AccordionSection
          // className={cls(cmn.mtop10)}
          handleChange={handleChange}
          expanded={expanded}
          panel="panel1"
          title="Chain Top-up"
          icon={<PaymentsRoundedIcon />}
        >
          <Topup mpc={props.mpc} name={name} />
        </AccordionSection> */}
        {/* <AccordionSection
          handleChange={handleChange}
          expanded={expanded}
          panel="panel2"
          title="Link tokens"
          icon={<AddLinkRoundedIcon />}
        >
          <p>Will be available soon</p>
        </AccordionSection> */}
      </SkPaper>
    </Container>
  )
}

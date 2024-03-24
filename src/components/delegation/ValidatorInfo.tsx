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
 * @file ValidatorInfo.tsx
 * @copyright SKALE Labs 2024-Present
 */

import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import AllInboxRoundedIcon from '@mui/icons-material/AllInboxRounded'
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import StickyNote2RoundedIcon from '@mui/icons-material/StickyNote2Rounded'
import SupervisorAccountRoundedIcon from '@mui/icons-material/SupervisorAccountRounded'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'

import PercentRoundedIcon from '@mui/icons-material/PercentRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import ValidatorLogo from './ValidatorLogo'
import { ValidatorBadge, TrustBadge } from './ValidatorBadges'
import Tile from '../Tile'
import SkStack from '../SkStack'

import { cmn, cls, fromWei, TokenIcon } from '@skalenetwork/metaport'

import { type IValidator } from '../../core/interfaces'
import { DEFAULT_ERC20_DECIMALS } from '../../core/constants'

export default function ValidatorInfo(props: { validator: IValidator; className?: string }) {
  const description = props.validator.description ? props.validator.description : 'No description'
  const minDelegation = fromWei(props.validator.minimumDelegationAmount, DEFAULT_ERC20_DECIMALS)

  return (
    <div className={cls(props.className)}>
      <div className={cls(cmn.flex, cmn.mbott10, 'titleSection')}>
        <ValidatorLogo validatorId={props.validator.id} size="xl" />
        <div className={cls(cmn.mleft20)}>
          <div className={cls(cmn.flex, cmn.flexcv)}>
            <p className={cls(cmn.p, cmn.p1, cmn.p700, cmn.pPrim)}>{props.validator.name}</p>
            <TrustBadge validator={props.validator} />
            <ValidatorBadge validator={props.validator} className={cmn.mleft10} />
          </div>
          <p className={cls(cmn.p, cmn.p4, cmn.p600, cmn.pSec, cmn.mri20, cmn.mtop5)}>
            {description}
          </p>
        </div>
      </div>
      <SkStack className={cls(cmn.mtop10)}>
        <Tile
          value={`${Number(props.validator.feeRate) / 10}% fee`}
          text="Validator fee"
          grow
          className="border"
          size="md"
          icon={<PercentRoundedIcon />}
        />
        <Tile
          value={props.validator.id.toString()}
          text="Validator ID"
          grow
          className="border"
          size="md"
          icon={<PersonRoundedIcon />}
        />
        <Tile
          value={`${minDelegation} SKL`}
          text="Minimum delegation amount"
          grow
          className="border"
          size="md"
          icon={<TokenIcon tokenSymbol="skl" size="xs" />}
        />
      </SkStack>
      {/* <SkStack className={cls(cmn.mtop10)}>
        <Tile
          value={props.validator.validatorAddress}
          text="Validator address"
          grow
          className='border'
          size='md'
        // icon={<TokenIcon tokenSymbol="skl" size="xs" />}
        />
        <Tile
          value={props.validator.linkedNodes.toString()}
          text="Linked nodes"
          grow
          className='border'
          size='md'
        // icon={<TokenIcon tokenSymbol="skl" size="xs" />}
        />
      </SkStack>
 */}

      {/* 
      <div className={cls('shipAddress', cmn.mtop10)} >
        <p className={cls(cmn.p, cmn.p3, cmn.pCent, 'pOneLine')}>Address: {props.validator.validatorAddress}</p>
      </div> */}
    </div>
  )
}

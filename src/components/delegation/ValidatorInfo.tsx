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

import { cmn, cls, TokenIcon } from '@skalenetwork/metaport'
import { type types, units, constants } from '@/core'

import { Skeleton } from '@mui/material'
import PercentRoundedIcon from '@mui/icons-material/PercentRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'

import ValidatorLogo from './ValidatorLogo'
import { ValidatorBadge, TrustBadge } from './ValidatorBadges'
import Tile from '../Tile'
import SkStack from '../SkStack'

export default function ValidatorInfo(props: {
  validator: types.st.IValidator | null
  className?: string
  sklPrice?: bigint | undefined
}) {
  const description = props.validator?.description ? props.validator.description : 'No description'
  const minDelegation =
    props.validator &&
    units.fromWei(props.validator.minimumDelegationAmount, constants.DEFAULT_ERC20_DECIMALS)

  return (
    <div className={cls(props.className)}>
      <div className={cls(cmn.flex, cmn.mbott10, 'titleSection')}>
        <ValidatorLogo validatorId={props.validator?.id} size="xl" />
        {props.validator ? (
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
        ) : (
          <div className={cls(cmn.flexg)}>
            <Skeleton variant="rectangular" width={200} height={40} />
            <Skeleton variant="rectangular" width={200} height={20} className={cls(cmn.mtop10)} />
          </div>
        )}
      </div>
      <SkStack className={cls(cmn.mtop10)}>
        <Tile
          value={props.validator && `${Number(props.validator.feeRate) / 10}% fee`}
          text="Validator fee"
          grow
          size="md"
          icon={<PercentRoundedIcon />}
        />
        <Tile
          value={props.validator && props.validator.id.toString()}
          text="Validator ID"
          grow
          size="md"
          icon={<PersonRoundedIcon />}
        />
        <Tile
          value={props.validator && `${minDelegation} SKL`}
          tooltip={
            props.validator && props.sklPrice && minDelegation
              ? units.displaySklValueUsd(props.validator.minimumDelegationAmount, props.sklPrice)
              : ''
          }
          text="Minimum delegation amount"
          grow
          size="md"
          icon={<TokenIcon tokenSymbol="skl" size="xs" />}
        />
      </SkStack>
    </div>
  )
}

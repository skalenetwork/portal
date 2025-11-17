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

import { TokenIcon, Tile } from '@skalenetwork/metaport'
import { type types, units, constants } from '@/core'

import { Skeleton } from '@mui/material'
import PercentRoundedIcon from '@mui/icons-material/PercentRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'

import ValidatorLogo from './ValidatorLogo'
import { ValidatorBadge, TrustBadge } from './ValidatorBadges'
import SkStack from '../SkStack'

export default function ValidatorInfo(props: {
  validator: types.st.IValidator | null
  className?: string
  sklPrice: bigint
}) {
  const description = props.validator?.description ? props.validator.description : 'No description'
  const minDelegation =
    props.validator &&
    units.fromWei(props.validator.minimumDelegationAmount, constants.DEFAULT_ERC20_DECIMALS)

  return (
    <div className="props.className">
      <div className="flex mb-2.5 'titleSection'">
        <ValidatorLogo validatorId={props.validator?.id} size="xl" />
        {props.validator ? (
          <div className="ml-5">
            <div className="lex, items-center">
              <p className="text-base font-bold text-primary">{props.validator.name}</p>
              <TrustBadge validator={props.validator} />
              <ValidatorBadge validator={props.validator} className="ml-2.5" />
            </div>
            <p className="text-xs font-semibold text-secondary-foreground/60 mr-5 mt-1.5">
              {description}
            </p>
          </div>
        ) : (
          <div className="flex-grow">
            <Skeleton variant="rectangular" width={200} height={40} />
            <Skeleton variant="rectangular" width={200} height={20} className="mt-2.5" />
          </div>
        )
        }
      </div >
      <SkStack className="mt-2.5">
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
    </div >
  )
}

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
 * @file ValidatorCard.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { Link } from 'react-router-dom'

import { type types, constants, units } from '@/core'
import { cls, SkPaper } from '@skalenetwork/metaport'

import ValidatorLogo from './ValidatorLogo'
import { TrustBadge, ValidatorBadge } from './ValidatorBadges'

export default function ValidatorCard(props: {
  validator: types.st.IValidator
  validatorId: number | undefined
  setValidatorId: any
  delegationType: types.st.DelegationType
  size?: 'md' | 'lg'
}) {
  if (!props.validator.trusted) return

  const size = props.size ?? 'md'

  const description = props.validator.description ? props.validator.description : 'No description'
  const minDelegation = units.fromWei(
    props.validator.minimumDelegationAmount,
    constants.DEFAULT_ERC20_DECIMALS
  )

  const truncatedDescription = description.length > 80 ? description.substring(0, 80) + '...' : description

  return (
    <Link
      to={
        props.validator.acceptNewRequests
          ? `/staking/new/${props.delegationType}/${props.validator.id}`
          : '/staking/new'
      }
    >
      <SkPaper
        gray={true}
        fullHeight
        className={cls(
          'sk-app-card',
          ['disabledCard', !props.validator.acceptNewRequests],
          ['selectedValidator', props.validatorId === props.validator.id]
        )}
      >
        <div>
          <div className="flex">
            <div className="flex items-center">
              <ValidatorLogo validatorId={props.validator.id} />
            </div>
            <div className="grow"></div>
            <div className="flex items-left">
              <ValidatorBadge validator={props.validator} />
              <TrustBadge validator={props.validator} />
            </div>
          </div>

          <div className="flex items-left mt-2.5">
            <p className="text-foreground font-semibold text-lg grow mr-1.5">
              {props.validator.name}
            </p>
          </div>

          <div className="mt-2">
            <p className="text-xs text-muted-foreground line-clamp-1">
              {truncatedDescription}
            </p>
          </div>
        </div>

        <div className="flex mt-5">
          <div className="bg-green-200 dark:bg-green-700 rounded-full px-2 py-1 grow">
            <p className="text-xs text-center text-foreground">{Number(props.validator.feeRate) / 10}% fee</p>
          </div>
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-1 ml-1.5 grow text-center">
            <p className="text-xs text-foreground">ID: {props.validator.id}</p>
          </div>
          {size === 'lg' ? (
            <div className="bg-purple-200 dark:bg-purple-700 rounded-full px-2 py-1 ml-1.5 grow">
              <p className="text-xs text-center text-foreground">Nodes: {props.validator.linkedNodes}</p>
            </div>
          ) : null}
        </div>
        <div>
          {size !== 'lg' && (
            <div className="bg-green-200 dark:bg-green-700 rounded-full px-2 py-1 mt-2">
              <p className="text-xs text-center truncate text-foreground">Min: {minDelegation} SKL</p>
            </div>
          )}
          {size === 'lg' && (
            <div className="bg-muted rounded-full px-2 py-1 mt-2">
              <p className="text-xs text-center truncate text-foreground">
                Address: {props.validator.validatorAddress}
              </p>
            </div>
          )}
        </div>
      </SkPaper>
    </Link>
  )
}

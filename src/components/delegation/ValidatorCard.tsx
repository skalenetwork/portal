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

import Tooltip from '@mui/material/Tooltip'

import { type types, constants, units } from '@/core'
import { cls, styles, SkPaper } from '@skalenetwork/metaport'

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

  return (
    <div className="flex justify-center items-center w-full">
      <Link
        to={
          props.validator.acceptNewRequests
            ? `/staking/new/${props.delegationType}/${props.validator.id}`
            : '/staking/new'
        }
      >
        <SkPaper
          className={cls(
            'br__tile titleSection validatorCard',
            [styles.paperGrey, size === 'lg'],
            ['disabledCard', !props.validator.acceptNewRequests],
            ['selectedValidator', props.validatorId === props.validator.id]
          )}
        >
          <div className="flex" style={{ marginBottom: '-20px' }}>
            <ValidatorBadge validator={props.validator} />
            <div className="flex-grow"></div>
            <TrustBadge validator={props.validator} />
          </div>
          <div className="flex" style={{ marginBottom: '10px' }}>
            <div className="flex-grow"></div>
            <ValidatorLogo validatorId={props.validator.id} size="xl" />
            <div className="flex-grow"></div>
          </div>

          <div className="flex">
            <div className="flex-grow"></div>
            <p
              className="text-base text-primary flex-grow text-center truncate"
            >
              {props.validator.name}
            </p>
            <div className="flex-grow"></div>
          </div>

          <div className="flex">
            <div className="flex-grow"></div>
            <Tooltip title={description}>
              <p
                className="text-xs font-semibold flex-grow text-secondary mt-5 text-center truncate">
                {description}
              </p>
            </Tooltip>
            <div className="flex-grow"></div>
          </div>
          <div className="flex mt-10">
            <div className="bg-gray-100 rounded px-2 py-1 flex-grow">
              <p className="text-xs text-center">
                {Number(props.validator.feeRate) / 10}% fee
              </p>
            </div>
            <div className="bg-blue-100 rounded px-2 py-1 ml-1.5 flex-grow text-center">
              <p className="text-xs">ID: {props.validator.id}</p>
            </div>
            {size === 'lg' ? (
              <div className="bg-green-100 rounded px-2 py-1 ml-1.5 flex-grow">
                <p className="text-xs text-center">
                  Nodes: {props.validator.linkedNodes}
                </p>
              </div>
            ) : null}
          </div>
          <div>
            {size !== 'lg' && (
              <Tooltip title={`Minimum delegation amount: ${minDelegation} SKL`}>
                <div className="bg-green-100 rounded px-2 py-1 mt-10">
                  <p className="text-xs text-center truncate">
                    Min: {minDelegation} SKL
                  </p>
                </div>
              </Tooltip>
            )}
            {size === 'lg' && (
              <Tooltip title={props.validator.validatorAddress}>
                <div className="bg-blue-100 rounded px-2 py-1 mt-10">
                  <p className="text-xs text-center truncate">
                    Address: {props.validator.validatorAddress}
                  </p>
                </div>
              </Tooltip>
            )}
          </div>
        </SkPaper>
      </Link>
    </div>
  )
}

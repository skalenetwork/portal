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

import { Link, useLocation } from 'react-router-dom'
import { type types, units, constants } from '@/core'
import { cls, SkPaper, Tile, TokenIcon } from '@skalenetwork/metaport'

import { HandCoins, HardDrive, Wallet, Coins } from 'lucide-react'

import CopySurface from '../CopySurface'
import ValidatorLogo from './ValidatorLogo'
import { ValidatorBadge } from './ValidatorBadges'
import { Button } from '@mui/material'

export default function ValidatorCard(props: {
  validator: types.st.IValidator
  validatorId: number | undefined
  setValidatorId: any
  delegationType: types.st.DelegationType
  size?: 'md' | 'lg'
  showButton?: boolean
}) {
  if (!props.validator.trusted) return

  const size = props.size ?? 'md'
  const showButton = props.showButton ?? false
  const description = props.validator.description ? props.validator.description : 'No description'
  const minDelegation = units.fromWei(props.validator.minimumDelegationAmount, constants.DEFAULT_ERC20_DECIMALS)
  const location = useLocation()
  const isStakeValidatorPage = location.pathname === '/staking/new'

  const linkTo = props.validator.acceptNewRequests
    ? `/staking/new/${props.delegationType}/${props.validator.id}`
    : '/staking/new'

  const cardContent = (
    <SkPaper
      gray={!isStakeValidatorPage}
      fullHeight
      className={cls(
        'sk-app-card',
        ['disabledCard', !props.validator.acceptNewRequests],
        ['selectedValidator', props.validatorId === props.validator.id],
        showButton ? 'cursor-default' : 'cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-101 hover:shadow-md hover:-translate-y-0.5',
        [isStakeValidatorPage ? 'bg-background!' : '', isStakeValidatorPage]
      )}
    >
      <div>
        <div className="flex items-start">
          <div className="flex items-center flex-shrink-0">
            <ValidatorLogo validatorId={props.validator.id} size="sm" />
          </div>
          <div className="flex flex-col ml-4 flex-1 min-w-0">
            <div className="flex items-center justify-between min-w-0">
              <p className="text-foreground font-semibold text-lg truncate flex-1 min-w-0">
                {props.validator.name}
              </p>
              <ValidatorBadge validator={props.validator} />
            </div>
            <p className="text-sm text-secondary-foreground font-medium mt-1 line-clamp-2 overflow-hidden text-ellipsis break-words">
              {description}
            </p>
          </div>
        </div>

      </div>

      <div className="flex mt-5 gap-2">
        <Tile
          size="md"
          transparent
          value={`${Number(props.validator.feeRate) / 10}%`}
          text="Fee Rate"
          grow
          icon={<HandCoins size={14} />}
          className={`${size === 'lg' ? '' : 'bg-card!'}`}
        />
        {size === 'md' ? (
          <Tile
            size="md"
            transparent
            value={props.validator.id.toString()}
            text="Validator ID"
            grow
            icon={<HardDrive size={14} />}
            className="bg-card!"
          />
        ) : (
          <Tile
            size="md"
            transparent
            value={`${props.validator.linkedNodes}`}
            text="Nodes"
            grow
            icon={<HardDrive size={14} />}
            className={`${size === 'lg' ? '' : 'bg-card!'}`}
          />
        )}
      </div>
      <div>
        {size === 'md' ? (
          <div className="flex mt-2 gap-2">
            <Tile
              size="md"
              transparent
              value={`${minDelegation} SKL`}
              text="Min. Amount"
              grow
              icon={<TokenIcon tokenSymbol="skl" size="xs" />}
              className="bg-card!"
            />
          </div>
        ) : null}
      </div>
      <div>
        {size === 'lg' ? (
          <div className="mt-3">
            <CopySurface
              className="h-full w-full"
              title="Validator Address"
              value={props.validator?.validatorAddress}
              icon={<Wallet size={14} className="text-foreground-600 dark:text-foreground-400" />}
            />
          </div>
        ) : null}

        {showButton && (
          <div className="mt-2.5">
            <Link to={linkTo}>
              <Button
                size="small"
                variant="contained"
                className="btnMd text-xs text-accent! bg-foreground!"
                startIcon={<Coins size={14} />}
                fullWidth
              >
                Stake SKL
              </Button>
            </Link>
          </div>
        )}
      </div>
    </SkPaper>
  )

  return showButton ? (
    cardContent
  ) : (
    <Link to={linkTo}>
      {cardContent}
    </Link>
  )
}

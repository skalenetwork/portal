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
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'

import { cmn, cls, styles, fromWei } from '@skalenetwork/metaport'

import ValidatorLogo from './ValidatorLogo'
import { TrustBadge, ValidatorBadge } from './ValidatorBadges'

import { type DelegationType, type IValidator } from '../../core/interfaces'
import { DEFAULT_ERC20_DECIMALS } from '../../core/constants'

export default function ValidatorCard(props: {
  validator: IValidator
  validatorId: number | undefined
  setValidatorId: any
  delegationType: DelegationType
  size?: 'md' | 'lg'
}) {
  if (!props.validator.trusted) return

  const size = props.size ?? 'md'

  const description = props.validator.description ? props.validator.description : 'No description'
  const minDelegation = fromWei(props.validator.minimumDelegationAmount, DEFAULT_ERC20_DECIMALS)

  return (
    <Grid className="fl-centered" item lg={size === 'md' ? 3 : 4} md={4} sm={6} xs={12}>
      <Link to={`/staking/new/${props.delegationType}/${props.validator.id}`}>
        <div
          className={cls(
            'br__tile titleSection validatorCard',
            [styles.paperGrey, size === 'lg'],
            ['disabledCard', !props.validator.acceptNewRequests],
            ['selectedValidator', props.validatorId === props.validator.id]
          )}
          onClick={() => {
            props.validator.acceptNewRequests ? props.setValidatorId(props.validator.id) : null
          }}
        >
          <div className={cls(cmn.flex)} style={{ marginBottom: '-20px' }}>
            <ValidatorBadge validator={props.validator} />
            <div className={cls(cmn.flexg)}></div>
            <TrustBadge validator={props.validator} />
          </div>
          <div className={cls(cmn.flex, cmn.mbott10)}>
            <div className={cls(cmn.flexg)}></div>
            <ValidatorLogo validatorId={props.validator.id} size="xl" />
            <div className={cls(cmn.flexg)}></div>
          </div>

          <div className={cls(cmn.flex)}>
            <div className={cls(cmn.flexg)}></div>
            <p
              className={cls(cmn.p, cmn.p2, cmn.p700, cmn.flexg, cmn.pCent, cmn.pPrim, 'pOneLine')}
            >
              {props.validator.name}
            </p>
            <div className={cls(cmn.flexg)}></div>
          </div>

          <div className={cls(cmn.flex)}>
            <div className={cls(cmn.flexg)}></div>
            <Tooltip title={description}>
              <p
                className={cls(
                  cmn.p,
                  cmn.p5,
                  cmn.p600,
                  cmn.flexg,
                  cmn.pSec,
                  cmn.mtop5,
                  cmn.pCent,
                  'pOneLine'
                )}
              >
                {description}
              </p>
            </Tooltip>
            <div className={cls(cmn.flexg)}></div>
          </div>
          <div className={cls(cmn.flex, cmn.mtop10)}>
            <div className={cls('shipFee', cmn.flexg)}>
              <p className={cls(cmn.p, cmn.p4, cmn.pCent)}>
                {Number(props.validator.feeRate) / 10}% fee
              </p>
            </div>
            <div className={cls('shipId', cmn.mleft5, cmn.flexg, cmn.pCent)}>
              <p className={cls(cmn.p, cmn.p4)}>ID: {props.validator.id}</p>
            </div>
            {size === 'lg' ? (
              <div className={cls('shipNodes', cmn.mleft5, cmn.flexg)}>
                <p className={cls(cmn.p, cmn.p4, cmn.pCent)}>
                  Nodes: {props.validator.linkedNodes}
                </p>
              </div>
            ) : null}
            {/* <div className={cls(cmn.flexg)}></div> */}
          </div>

          {size !== 'lg' ? (
            <Tooltip title={`Minimum delegation amount: ${minDelegation} SKL`}>
              <div className={cls('shipNodes', cmn.mtop10)}>
                <p className={cls(cmn.p, cmn.p4, cmn.pCent, 'pOneLine')}>
                  Min: {minDelegation} SKL
                </p>
              </div>
            </Tooltip>
          ) : null}
          {size === 'lg' ? (
            <Tooltip title={props.validator.validatorAddress}>
              <div className={cls('shipId', cmn.mtop10)}>
                <p className={cls(cmn.p, cmn.p4, cmn.pCent, 'pOneLine')}>
                  Address: {props.validator.validatorAddress}
                </p>
              </div>
            </Tooltip>
          ) : null}
        </div>
      </Link>
    </Grid>
  )
}

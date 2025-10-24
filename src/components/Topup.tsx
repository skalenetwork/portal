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
 * @file Topup.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { Link } from 'react-router-dom'

import { constants, units, helper, type types } from '@/core'
import { cmn, cls, type MetaportCore, Tile } from '@skalenetwork/metaport'

import Button from '@mui/material/Button'
import { Collapse } from '@mui/material'
import TollIcon from '@mui/icons-material/Toll'
import MoreTimeIcon from '@mui/icons-material/MoreTime'
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded'

import SkStack from './SkStack'
import MonthSelector from './MonthSelector'
import Loader from './Loader'
import { formatTimePeriod, monthsBetweenNowAndTimestamp } from '../core/timeHelper'

export default function Topup(props: {
  mpc: MetaportCore
  name: string
  topupPeriod: number
  setTopupPeriod: any
  info: types.pm.PaymasterInfo
  tokenBalance: bigint | undefined
  topupChain: () => Promise<void>
  btnText: string | undefined
  errorMsg: string | undefined
  setErrorMsg: (errorMsg: string | undefined) => void
  loading: boolean
}) {
  if (props.tokenBalance === undefined) return <Loader text="Loading balance info" />

  const chainPriceSkl = helper.divideBigInts(props.info.schainPricePerMonth, props.info.oneSklPrice)
  const totalPriceSkl = chainPriceSkl * props.topupPeriod
  const totalPriceWei = units.toWei(totalPriceSkl.toString(), constants.DEFAULT_ERC20_DECIMALS)

  const tokenBalanceSkl = units.fromWei(props.tokenBalance, constants.DEFAULT_ERC20_DECIMALS)

  const topupPeriodText = formatTimePeriod(props.topupPeriod, 'month')
  const helperText = `${units.truncateDecimals(chainPriceSkl.toString(), 6)} SKL x ${topupPeriodText}`

  const balanceOk = props.tokenBalance >= totalPriceWei
  const topupBtnText = balanceOk ? 'Top-up chain' : 'Insufficient funds'

  const untilDueDateMonths = monthsBetweenNowAndTimestamp(
    props.info.schain.paidUntil,
    props.info.effectiveTimestamp
  )
  const maxTopupPeriod = Number(props.info.maxReplenishmentPeriod) - untilDueDateMonths

  return (
    <div>
      <SkStack className={cmn.mbott10}>
        <Tile
          text="Top-up period (months)"
          icon={<MoreTimeIcon />}
          children={
            <MonthSelector
              className={cmn.mtop10}
              max={maxTopupPeriod}
              topupPeriod={props.topupPeriod}
              setTopupPeriod={props.setTopupPeriod}
              setErrorMsg={props.setErrorMsg}
            />
          }
          grow
        />
      </SkStack>
      <SkStack>
        <Tile
          value={`${units.truncateDecimals(totalPriceSkl.toString(), 6)} SKL`}
           tooltip={
            props.info.oneSklPrice !== undefined && totalPriceWei !== undefined
              ? units.displaySklValueUsd(totalPriceWei, props.info.oneSklPrice)
              : ''
          }
          text="Top-up amount"
          textRi={helperText}
          icon={<TollIcon />}
          grow
        />
        <Tile
          value={`${units.truncateDecimals(tokenBalanceSkl, 6)} SKL`}
          tooltip={
            props.info.oneSklPrice !== undefined && props.tokenBalance !== undefined
              ? units.displaySklValueUsd(props.tokenBalance, props.info.oneSklPrice)
              : ''
          }
          text="SKL balance"
          icon={<TollIcon />}
          color={balanceOk ? undefined : 'error'}
        />
      </SkStack>
      <Collapse in={props.errorMsg !== undefined}>
        <SkStack className={cmn.mtop10}>
          <Tile
            value={props.errorMsg}
            text="Error occurred"
            icon={<ErrorRoundedIcon />}
            color="error"
            grow
            children={
              <Button
                size="small"
                onClick={() => {
                  props.setErrorMsg(undefined)
                }}
                className="'blackP', cmn.p, text-xs, cmn.mtop10)}
                style={{ background: 'rgba(0, 0, 0, 0.3)' }}
              >
                Close
              </Button>
            }
          />
        </SkStack>
      </Collapse>
      <div className="cmn.mtop20, cmn.mbott10, ml-1.5, cmn.flex)}>
        <div className="cmn.flex)}>
          <Button
            variant="contained"
            className="'btn')}
            disabled={!balanceOk || props.loading || maxTopupPeriod <= 0}
            onClick={props.topupChain}
          >
            {props.btnText ?? topupBtnText}
          </Button>
          {!balanceOk ? (
            <Link to="/bridge">
              <Button variant="contained" className="'btn', ml-2.5)}>
                Bridge SKL to Europa Hub
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  )
}

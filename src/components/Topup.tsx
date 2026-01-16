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
import { type MetaportCore, Tile, TokenIcon } from '@skalenetwork/metaport'

import Button from '@mui/material/Button'
import { Collapse } from '@mui/material'
import { ClockPlus, ShieldAlert } from 'lucide-react'

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
      <SkStack className="mb-2.5">
        <Tile
          text="Top-up period (months)"
          icon={<ClockPlus size={14} />}
          children={
            <MonthSelector
              className="text-foreground mt-2"
              max={maxTopupPeriod}
              topupPeriod={props.topupPeriod}
              setTopupPeriod={props.setTopupPeriod}
              setErrorMsg={props.setErrorMsg}
            />
          }
          className="w-full!"
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
          icon={<TokenIcon tokenSymbol="skl" size="xs" />}
          grow
        />
        <Tile className='text-foreground'
          value={`${units.truncateDecimals(tokenBalanceSkl, 6)} SKL`}
          tooltip={
            props.info.oneSklPrice !== undefined && props.tokenBalance !== undefined
              ? units.displaySklValueUsd(props.tokenBalance, props.info.oneSklPrice)
              : ''
          }
          text="SKL balance"
          icon={<TokenIcon tokenSymbol="skl" size="xs" />}
          color={balanceOk ? undefined : 'error'}
        />
      </SkStack>
      <Collapse in={props.errorMsg !== undefined}>
        <SkStack className="mt-2.5">
          <Tile
            value={props.errorMsg}
            text="Error occurred"
            icon={<ShieldAlert size={17} />}
            color="error"
            className="text-foreground bg-red-100 border-red-200 dark:bg-red-800/80 dark:border-red-600 border-2"
            grow
            childrenRi={
              <Button
                size="small"
                onClick={() => {
                  props.setErrorMsg(undefined)
                }}
                className="roundBtn text-foreground! normal-case! bg-muted-foreground/30! hover:bg-muted-foreground/20!"
              >
                Close
              </Button>
            }
          />
        </SkStack>
      </Collapse>
      <div className="mt-5 mb-2.5 ml-1.5">
        <div className="flex flex-col md:flex-row gap-2.5">
          <Button
            variant="contained"
            className="btn btnMd text-xs w-full! md:w-fit! bg-foreground! text-accent! disabled:bg-muted! disabled:text-muted-foreground!"
            disabled={!balanceOk || props.loading || maxTopupPeriod <= 0}
            onClick={props.topupChain}
          >
            {props.btnText ?? topupBtnText}
          </Button>
          {!balanceOk ? (
            <Link to="/bridge" className="w-full md:w-auto">
              <Button variant="contained" className="btn btnMd text-xs w-full! md:w-fit! text-accent! bg-foreground!">
                Bridge SKL to Europa Hub
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  )
}

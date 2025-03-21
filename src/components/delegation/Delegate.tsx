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
 * @file Delegate.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { Logger, type ILogObj } from 'tslog'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { type Signer } from 'ethers'

import {
  cmn,
  cls,
  TokenIcon,
  styles,
  type MetaportCore,
  sendTransaction,
  contracts
} from '@skalenetwork/metaport'
import { type types, constants, units } from '@/core'

import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import { TextField } from '@mui/material'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import TransitEnterexitRoundedIcon from '@mui/icons-material/TransitEnterexitRounded'
import EventRepeatRoundedIcon from '@mui/icons-material/EventRepeatRounded'
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded'

import Tile from '../Tile'
import SkStack from '../SkStack'
import ErrorTile from '../ErrorTile'
import Loader from '../Loader'
import DelegationFlow from './DelegationFlow'

const log = new Logger<ILogObj>({ name: 'portal:pages:Delegate' })

export default function Delegate(props: {
  mpc: MetaportCore
  validator: types.st.IValidator | undefined
  si: types.st.StakingInfoMap
  getMainnetSigner: () => Promise<Signer>
  address: types.AddressType
  delegationType: types.st.DelegationType
  loaded: boolean
  delegationTypeAvailable: boolean
  errorMsg: string | undefined
  setErrorMsg: (msg: string | undefined) => void
  className?: string
}) {
  const [amount, setAmount] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [amountWei, setAmountWei] = useState<bigint>(0n)

  const navigate = useNavigate()

  if (!props.loaded || !props.validator) {
    return <Loader text="Loading staking info" />
  }
  if (props.loaded && !props.delegationTypeAvailable && props.address) {
    return <ErrorTile errorMsg="Delegation type is not available" />
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (parseFloat(event.target.value) < 0) {
      setAmount('')
      return
    }
    setAmount(event.target.value)
    setAmountWei(units.toWei(event.target.value, constants.DEFAULT_ERC20_DECIMALS))
  }

  async function stake() {
    setLoading(true)
    if (props.validator === undefined) {
      props.setErrorMsg('Validator not found')
      setLoading(false)
      return
    }
    try {
      log.info(
        `Delegating SKL: ${amountWei} to ${props.validator?.id} - type ${props.delegationType}`
      )
      const signer = await props.getMainnetSigner()
      const delegationContract = await contracts.initActionContract(
        signer,
        props.delegationType,
        props.address,
        props.mpc.config.skaleNetwork,
        'delegation'
      )
      const res = await sendTransaction(
        signer,
        delegationContract.delegate,
        [
          props.validator.id,
          amountWei,
          constants.DEFAULT_DELEGATION_PERIOD,
          constants.DEFAULT_DELEGATION_INFO
        ],
        'delegation:delegate'
      )
      setLoading(false)
      if (!res.status) {
        props.setErrorMsg(res.err?.name)
      } else {
        navigate('/staking')
      }
    } catch (err: any) {
      console.error(err)
      props.setErrorMsg(err.message ? err.message : constants.DEFAULT_ERROR_MSG)
      setLoading(false)
    }
  }

  function getBtnText() {
    if (loading) return 'Staking...'
    if (amount === '') return 'Enter amount to stake'
    if (props.validator && amountWei < props.validator.minimumDelegationAmount)
      return 'Amount too low'
    if (!info.allowedToDelegate || amountWei > info.allowedToDelegate) return 'Insufficient balance'
    return 'Stake SKL'
  }

  const info = props.si[props.delegationType]!.info

  return (
    <div>
      <SkStack>
        <Tile
          grow
          className={cls(cmn.mbott10)}
          value="2 months"
          text="Delegation period"
          icon={<AccessTimeRoundedIcon />}
          color={true ? undefined : 'error'}
          size="md"
        />
        <Tile
          size="md"
          grow
          className={cls(cmn.mbott10)}
          value="Auto-renewed"
          text="Renewal"
          icon={<EventRepeatRoundedIcon />}
        />
      </SkStack>

      <Tile
        text="Delegation flow"
        className={cls(cmn.mbott10)}
        icon={<AccountTreeRoundedIcon />}
        grow
        children={<DelegationFlow className={cls(cmn.mtop10)} />}
      />

      <SkStack>
        <Tile
          text="Enter amount to stake"
          className={cls(styles.inputAmount)}
          children={
            <div className={cls(cmn.flex, cmn.flexcv, 'amountInput')}>
              <div className={cls(cmn.flexg)}>
                <TextField
                  inputProps={{ step: '0.1', lang: 'en-US' }}
                  inputRef={(input) => input?.focus()}
                  type="number"
                  variant="standard"
                  placeholder="0.00"
                  value={amount}
                  onChange={handleChange}
                  disabled={loading}
                  style={{ width: '100%' }}
                />
              </div>

              <div className={cls(cmn.p1, cmn.p, cmn.p700, cmn.mri10)}>SKL</div>
            </div>
          }
          icon={<TransitEnterexitRoundedIcon style={{ rotate: '315deg' }} />}
          grow
        />
        <Tile
          disabled={info.allowedToDelegate === 0n}
          value={units.displayBalance(info.allowedToDelegate!, 'SKL')}
          text="Available to stake"
          icon={<TokenIcon tokenSymbol="skl" size="xs" />}
          color={true ? undefined : 'error'}
          childrenRi={
            <div className={cls(cmn.flexcv, cmn.flex)}>
              <Button
                className={cls('btnSm', 'outlined', cmn.mleft20, cmn.flexcv)}
                disabled={info.allowedToDelegate === 0n || loading}
                onClick={() => {
                  if (!info.allowedToDelegate) return
                  setAmount(
                    units.fromWei(info.allowedToDelegate ?? 0n, constants.DEFAULT_ERC20_DECIMALS)
                  )
                  setAmountWei(info.allowedToDelegate)
                }}
              >
                Max
              </Button>
            </div>
          }
        />
      </SkStack>

      <ErrorTile
        errorMsg={props.errorMsg}
        setErrorMsg={props.setErrorMsg}
        className={cls(cmn.mtop10)}
      />

      {loading ? (
        <LoadingButton
          loading
          loadingPosition="start"
          size="small"
          variant="contained"
          className={cls('btn', cmn.mleft10, cmn.mbott10, cmn.mtop20)}
        >
          Staking SKL
        </LoadingButton>
      ) : (
        <Button
          disabled={
            amount === '' ||
            parseFloat(amount) === 0 ||
            !info.allowedToDelegate ||
            amountWei > info.allowedToDelegate ||
            amountWei < props.validator.minimumDelegationAmount ||
            loading
          }
          variant="contained"
          className={cls('btn', cmn.mleft10, cmn.mbott10, cmn.mtop20)}
          onClick={stake}
        >
          {getBtnText()}
        </Button>
      )}
    </div>
  )
}

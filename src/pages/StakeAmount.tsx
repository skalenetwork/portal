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
 * @file Stake.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { useState, useEffect } from 'react'
import { type Signer } from 'ethers'
import { useParams } from 'react-router-dom'
import { type MetaportCore, SkPaper, contracts } from '@skalenetwork/metaport'
import { types } from '@/core'

import Container from '@mui/material/Container'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded'
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded'

import Loader from '../components/Loader'

import ValidatorInfo from '../components/delegation/ValidatorInfo'
import Delegate from '../components/delegation/Delegate'
import Breadcrumbs from '../components/Breadcrumbs'
import ConnectWallet from '../components/ConnectWallet'

import ErrorTile from '../components/ErrorTile'
import Headline from '../components/Headline'
import { isDelegationTypeAvailable, isLoaded } from '../core/delegation/staking'
import { getDelegationTypeAlias } from '../core/delegation'
import { UserRoundSearch } from 'lucide-react'

export default function StakeAmount(props: {
  mpc: MetaportCore
  validators: types.st.IValidator[]
  loadValidators: () => void
  loadStakingInfo: () => void
  sc: types.st.ISkaleContractsMap | null
  si: types.st.StakingInfoMap
  address: types.AddressType | undefined
  getMainnetSigner: () => Promise<Signer>
}) {
  const { id, delType } = useParams()
  const validatorId = Number(id) ?? -1
  const delegationType = Number(delType) ?? types.st.DelegationType.REGULAR

  const [currentValidator, setCurrentValidator] = useState<types.st.IValidator | undefined>(
    undefined
  )
  const [errorMsg, setErrorMsg] = useState<string | undefined>()

  const loaded = isLoaded(props.si)
  const available = isDelegationTypeAvailable(props.si, delegationType)

  const [sklPrice, setSklPrice] = useState<bigint>(0n)

  useEffect(() => {
    updateCurrentValidator()
  }, [])

  useEffect(() => {
    if (props.sc !== null) {
      props.loadValidators()
      props.loadStakingInfo()
    }
  }, [props.sc])

  useEffect(() => {
    props.loadStakingInfo()
  }, [props.address])

  useEffect(() => {
    updateCurrentValidator()
  }, [props.validators])

  useEffect(() => {
    loadSklPrice()
  }, [])

  async function loadSklPrice() {
    const paymaster = await contracts.paymaster.getPaymaster(props.mpc)
    const price = await paymaster.oneSklPrice()
    setSklPrice(price)
  }

  function updateCurrentValidator() {
    if (props.validators.length !== 0 && props.validators[validatorId - 1]) {
      setCurrentValidator(props.validators.find((validator) => validator.id === validatorId))
    }
  }

  if (validatorId === -1) {
    return <ErrorTile errorMsg="Validator ID is not found" setErrorMsg={setErrorMsg} />
  }

  return (
    <Container maxWidth="md">
      <SkPaper gray className="mt-2.5 chainDetails">
        <div className="flex items-center">
          <div className="flex grow">
            <Breadcrumbs
              sections={[
                {
                  text: 'Staking',
                  icon: <ArrowBackIosNewRoundedIcon className="w-3! h-3! text-foreground" />,
                  url: '/staking'
                },
                {
                  text: 'Choose a validator',
                  icon: <UserRoundSearch className="w-3! h-3! text-foreground" />,
                  url: '/staking/new'
                },
                {
                  text: 'Stake SKL',
                  icon: <SavingsRoundedIcon />
                }
              ]}
            />
          </div>
          {loaded && available ? (
            <div className="titleBadge" style={{ padding: '10px 15px' }}>
              <p className="text-xs">{getDelegationTypeAlias(delegationType)} delegation</p>
            </div>
          ) : null}
        </div>
        <div className="mt-2.5 ml-1.25 mb-2.5" style={{ paddingBottom: '5px' }}>
          <h2 className="m-0 text-xl font-bold text-foreground">Stake SKL</h2>
          <p className="text-xs text-secondary-foreground font-semibold">
            Review validator info and enter delegation amount
          </p>
        </div>
        {currentValidator ? (
          <ValidatorInfo validator={currentValidator} sklPrice={sklPrice} className="mt-2.5" />
        ) : (
          <Loader text="Loading validator info" />
        )}

        <Headline
          text="Staking details"
          icon={<MonetizationOnRoundedIcon className="text-[17px]!" />}
          className="mt-5 mb-2.5"
          size="small"
        />
        {props.address ? (
          <Delegate
            mpc={props.mpc}
            validator={currentValidator}
            address={props.address}
            si={props.si}
            delegationType={delegationType}
            errorMsg={errorMsg}
            setErrorMsg={setErrorMsg}
            loaded={loaded}
            delegationTypeAvailable={available}
            getMainnetSigner={props.getMainnetSigner}
            sklPrice={sklPrice}
          />
        ) : (
          <ConnectWallet tile className="grow" />
        )}
      </SkPaper>
    </Container>
  )
}

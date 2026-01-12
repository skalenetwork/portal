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
 * @file Summary.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { helper, types, units } from '@/core'
import { TokenIcon, Tile } from '@skalenetwork/metaport'

import { ArrowUpRight, CalendarCheck, CircleUser, Coins, Copy, Landmark, LockOpen } from 'lucide-react'

import SkStack from '../SkStack'
import AccordionSection from '../AccordionSection'
import SkBtn from '../SkBtn'

const icons: { [key in types.st.DelegationType]: any } = {
  0: <CircleUser size={17} className="text-foreground" />,
  1: <Landmark size={17} className="text-foreground" />,
  2: <Landmark size={17} className="text-foreground" />
}

const SUMMARY_VALIDATOR_ID = -1

export default function Summary(props: {
  type: types.st.DelegationType
  accountInfo: types.st.IDelegatorInfo | undefined
  retrieveUnlocked: (rewardInfo: types.st.IRewardInfo) => Promise<void>
  loading: types.st.IRewardInfo | types.st.IDelegationInfo | false
  customAddress: types.AddressType | undefined
  isXs: boolean
  sklPrice: bigint
}) {
  function getTitle() {
    if (props.type === types.st.DelegationType.ESCROW) return 'Escrow'
    if (props.type === types.st.DelegationType.ESCROW2) return 'Grant Escrow'
    return 'Account'
  }

  const rewardInfo: types.st.IRewardInfo = {
    validatorId: SUMMARY_VALIDATOR_ID,
    delegationType: props.type
  }

  const loading =
    props.loading &&
    props.loading.delegationType === props.type &&
    'validatorId' in props.loading &&
    props.loading.validatorId === SUMMARY_VALIDATOR_ID

  return (
    <div>
      <AccordionSection
        expandedByDefault={true}
        title={`${getTitle()} Summary`}
        icon={icons[props.type]}
        marg={false}
      >
        <SkStack className="mt-1.5">
          <Tile
            disabled={props.accountInfo?.balance === 0n}
            tooltip={
              props.sklPrice && props.accountInfo
                ? units.displaySklValueUsd(props.accountInfo.balance, props.sklPrice)
                : ''
            }
            value={
              props.accountInfo ? units.displayBalance(props.accountInfo.balance, 'SKL') : null
            }
            text={'Total ' + getTitle() + ' Balance'}
            grow
            icon={<TokenIcon tokenSymbol="skl" size="xs" />}
            childrenRi={
              <SkStack className="flex">
                {props.type !== types.st.DelegationType.REGULAR ? (
                  <div className="flex">
                    <Tile
                      size="md"
                      transparent
                      className={`p-0! ${!props.isXs ? 'mr-5 ml-5' : ''}`}
                      value={helper.shortAddress(props.accountInfo?.address)}
                      text="Escrow"
                      grow
                      ri={!props.isXs}
                      copy={props.accountInfo?.address}
                      icon={<Copy size={14} />}
                    />
                    <div className={`${!props.isXs ? 'border-l-2 border-border ml-2.5' : ''}`}></div>
                  </div>
                ) : (
                  <div></div>
                )}
                <Tile
                  size="md"
                  transparent
                  className={`p-0! ${!props.isXs ? 'mr-5 ml-5' : ''}`}
                  disabled={props.accountInfo?.staked === 0n}
                  tooltip={
                    props.sklPrice && props.accountInfo
                      ? units.displaySklValueUsd(props.accountInfo.staked, props.sklPrice)
                      : ''
                  }
                  value={
                    props.accountInfo ? units.displayBalance(props.accountInfo.staked, 'SKL') : null
                  }
                  text="Staked Tokens"
                  grow
                  ri={!props.isXs}
                  icon={<ArrowUpRight size={14} />}
                />
                <div className="border-l-2 border-border"></div>
                <Tile
                  className={`p-0! ${!props.isXs ? 'mr-5 ml-5' : ''}`}
                  size="md"
                  transparent
                  grow
                  disabled={props.accountInfo?.allowedToDelegate === 0n}
                  tooltip={
                    props.sklPrice && props.accountInfo?.allowedToDelegate !== undefined
                      ? units.displaySklValueUsd(
                        props.accountInfo.allowedToDelegate,
                        props.sklPrice
                      )
                      : ''
                  }
                  value={
                    props.accountInfo?.allowedToDelegate !== undefined
                      ? units.displayBalance(props.accountInfo.allowedToDelegate, 'SKL')
                      : null
                  }
                  ri={!props.isXs}
                  text="Available to stake"
                  icon={<Coins size={14} />}
                />
              </SkStack>
            }
          />
        </SkStack>
        {props.accountInfo?.vested !== undefined && props.accountInfo?.unlocked !== undefined ? (
          <SkStack className="mt-2.5">
            <Tile
              disabled={props.accountInfo?.vested === 0n}
              tooltip={
                props.sklPrice && props.accountInfo
                  ? units.displaySklValueUsd(props.accountInfo.vested, props.sklPrice)
                  : ''
              }
              value={
                props.accountInfo ? units.displayBalance(props.accountInfo.vested, 'SKL') : null
              }
              text="Total Vested Tokens"
              icon={<CalendarCheck size={14} />}
              grow
              childrenRi={
            <SkStack className="flex">
              {props.accountInfo?.fullAmount !== undefined ? (
                <Tile
                  disabled={props.accountInfo?.fullAmount === 0n}
                  tooltip={
                    props.sklPrice && props.accountInfo
                      ? units.displaySklValueUsd(props.accountInfo.fullAmount, props.sklPrice)
                      : ''
                  }
                  value={
                    props.accountInfo
                      ? units.displayBalance(props.accountInfo.fullAmount, 'SKL')
                      : null
                  }
                  text="Initial Escrow Amount"
                  icon={<Landmark size={14} />}
                  grow
                  size="md"
                  transparent
                  className={`p-0 ${!props.isXs ? 'mr-1 ml-1' : ''}`}
                  ri={!props.isXs}
                />
              ) : (
                <div></div>
              )}
              <div className="border-l-2 border-border"></div>
              <Tile
                size="md"
                transparent
                disabled={props.accountInfo?.unlocked === 0n}
                className={`p-0 ${!props.isXs ? 'ml-1' : ''}`}
                tooltip={
                  props.sklPrice && props.accountInfo
                    ? units.displaySklValueUsd(props.accountInfo.unlocked, props.sklPrice)
                    : ''
                }
                value={
                  props.accountInfo
                    ? units.displayBalance(props.accountInfo.unlocked, 'SKL')
                    : null
                }
                text="Unlocked Tokens"
                icon={<LockOpen size={14} />}
                grow
                ri={!props.isXs}
                childrenRi={
                  <div className="items-center flex">
                    <div className="mr-5"></div>
                    <SkBtn
                      loading={loading}
                      text={loading ? 'Retrieving' : 'Retrieve'}
                      variant="contained"
                      size="sm"
                      className={`${!props.isXs ? 'ml-5' : ''} items-center`}
                      disabled={
                        props.accountInfo?.unlocked === 0n ||
                        props.loading !== false ||
                        props.customAddress !== undefined
                      }
                      onClick={() => {
                        props.retrieveUnlocked(rewardInfo)
                      }}
                    />
                  </div>
                }
              />
            </SkStack>
              }
            />
          </SkStack>
        ) : (
          <div></div>
        )}
      </AccordionSection>
    </div>
  )
}

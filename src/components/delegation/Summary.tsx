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

import { cmn, cls, styles, TokenIcon } from '@skalenetwork/metaport'

import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded'
import ControlPointDuplicateRoundedIcon from '@mui/icons-material/ControlPointDuplicateRounded'

import SkStack from '../SkStack'
import Tile from '../Tile'
import AccordionSection from '../AccordionSection'

import {
  DelegationType,
  type IDelegationInfo,
  type IDelegatorInfo,
  type IRewardInfo
} from '../../core/interfaces'
import { formatBalance } from '../../core/helper'
import SkBtn from '../SkBtn'

const icons: { [key in DelegationType]: any } = {
  0: <AccountCircleRoundedIcon className={cls(cmn.mri5, styles.chainIconxs, cmn.pSec)} />,
  1: <AccountBalanceRoundedIcon className={cls(cmn.mri5, styles.chainIconxs, cmn.pSec)} />,
  2: <ApartmentRoundedIcon className={cls(cmn.mri5, styles.chainIconxs, cmn.pSec)} />
}

const SUMMARY_VALIDATOR_ID = -1

export default function Summary(props: {
  type: DelegationType
  accountInfo: IDelegatorInfo | undefined
  retrieveUnlocked: (rewardInfo: IRewardInfo) => Promise<void>
  loading: IRewardInfo | IDelegationInfo | false
}) {
  function getTitle() {
    if (props.type === DelegationType.ESCROW) return 'Escrow'
    if (props.type === DelegationType.ESCROW2) return 'Grant Escrow'
    return 'Account'
  }

  const rewardInfo: IRewardInfo = {
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
        <SkStack className={cls(cmn.mtop5)}>
          <Tile
            disabled={props.accountInfo?.balance === 0n}
            value={props.accountInfo ? formatBalance(props.accountInfo.balance, 'SKL') : null}
            text={'Total ' + getTitle() + ' Balance'}
            grow
            icon={<TokenIcon tokenSymbol="skl" size="xs" />}
            childrenRi={
              <div className={cls(cmn.flex, cmn.flexcvd)}>
                {/* <div className={cls('borderVert', cmn.mleft20)}></div> */}
                <Tile
                  size="md"
                  className={cls(cmn.nop, cmn.mri20, cmn.mleft20)}
                  disabled={props.accountInfo?.staked === 0n}
                  value={props.accountInfo ? formatBalance(props.accountInfo.staked, 'SKL') : null}
                  text="Staked Tokens"
                  grow
                  ri
                  icon={<ArrowOutwardRoundedIcon />}
                />
                <div className="borderVert"></div>
                <Tile
                  className={cls(cmn.nop, cmn.mri10, cmn.mleft20)}
                  size="md"
                  grow
                  disabled={props.accountInfo?.allowedToDelegate === 0n}
                  value={
                    props.accountInfo?.allowedToDelegate !== undefined
                      ? formatBalance(props.accountInfo.allowedToDelegate, 'SKL')
                      : null
                  }
                  ri
                  text="Available to stake"
                  icon={<ControlPointDuplicateRoundedIcon />}
                />
              </div>
            }
          />
        </SkStack>
        {props.accountInfo?.vested !== undefined && props.accountInfo?.unlocked !== undefined ? (
          <SkStack>
            <Tile
              disabled={props.accountInfo?.vested === 0n}
              className={cls(cmn.mtop10)}
              value={props.accountInfo ? formatBalance(props.accountInfo.vested, 'SKL') : null}
              text="Total Vested Tokens"
              icon={<EventAvailableRoundedIcon />}
              grow
              childrenRi={
                <div className={cls(cmn.flex)}>
                  {props.accountInfo?.fullAmount !== undefined ? (
                    <Tile
                      disabled={props.accountInfo?.fullAmount === 0n}
                      value={
                        props.accountInfo
                          ? formatBalance(props.accountInfo.fullAmount, 'SKL')
                          : null
                      }
                      text="Initial Escrow Amount"
                      icon={<AccountBalanceRoundedIcon />}
                      grow
                      size="md"
                      className={cls(cmn.nop, cmn.mri20, cmn.mleft20)}
                      ri
                    />
                  ) : (
                    <div></div>
                  )}
                  <div className="borderVert"></div>
                  <Tile
                    size="md"
                    disabled={props.accountInfo?.unlocked === 0n}
                    className={cls(cmn.nop, cmn.mleft20)}
                    value={
                      props.accountInfo ? formatBalance(props.accountInfo.unlocked, 'SKL') : null
                    }
                    text="Unlocked Tokens"
                    icon={<LockOpenRoundedIcon />}
                    grow
                    ri
                    childrenRi={
                      <div className={cls(cmn.flexcv, cmn.flex)}>
                        <SkBtn
                          loading={loading}
                          text={loading ? 'Retrieving' : 'Retrieve'}
                          variant="contained"
                          size="sm"
                          className={cls(cmn.mleft20, cmn.flexcv)}
                          disabled={props.accountInfo?.unlocked === 0n || props.loading !== false}
                          onClick={() => {
                            props.retrieveUnlocked(rewardInfo)
                          }}
                        />
                      </div>
                    }
                  />
                </div>
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

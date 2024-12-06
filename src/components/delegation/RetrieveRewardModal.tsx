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
 * @file RetrieveRewardModal.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { useState, useEffect, ChangeEvent } from 'react'
import { isAddress } from 'ethers'
import { SkPaper, cls, cmn, styles } from '@skalenetwork/metaport'
import { types } from '@/core'

import { Collapse, Container, TextField, Box, Button, Modal } from '@mui/material'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded'

import Jazzicon from 'react-jazzicon/dist/Jazzicon'
import { jsNumberForAddress } from 'react-jazzicon'

import Tile from '../Tile'
import Message from '../Message'
import SkBtn from '../SkBtn'

import { ZERO_ADDRESS } from '../../core/constants'

export default function RetrieveRewardModal(props: {
  address: types.AddressType | undefined
  customRewardAddress: types.AddressType | undefined
  setCustomRewardAddress: (customRewardAddress: types.AddressType | undefined) => void
  retrieveRewards: () => void
  loading: boolean
  disabled: boolean
}) {
  const [edit, setEdit] = useState(false)
  const [inputAddress, setInputAddress] = useState<string | undefined>(props.customRewardAddress)
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  useEffect(() => {
    setInputAddress(props.address)
  }, [props.address])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputAddress(event.target.value)
  }

  const saveAddress = () => {
    if (isAddress(inputAddress)) {
      props.setCustomRewardAddress(inputAddress as types.AddressType)
      setEdit(false)
      setErrorMsg(undefined)
    } else {
      setErrorMsg('Address is not valid')
    }
  }

  return (
    <div>
      <Button
        variant="contained"
        className={cls('btnSm')}
        onClick={handleOpen}
        disabled={props.disabled}
      >
        Retrieve
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="skPopup"
      >
        <Box
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: { xs: '100%', md: 'max-content' }
          }}
          className={cls(cmn.flexg, cmn.flexcv, cmn.flex, cmn.flexc)}
        >
          <Container maxWidth="md">
            <SkPaper className={cls(cmn.nop)}>
              <SkPaper gray>
                <p className={cls(cmn.p, cmn.p2, cmn.p700, cmn.pCent, cmn.mtop10, cmn.mbott10)}>
                  Confirm reward retrieval
                </p>
                <Message
                  text="Double-check the address. Withdrawing to a wallet you don't control will lead to permanent loss of funds."
                  type="warning"
                  icon={<WarningRoundedIcon />}
                  className={cls(cmn.mbott10)}
                  closable={false}
                />
                <Collapse in={!!errorMsg}>
                  <Message
                    text={errorMsg ?? ''}
                    type="error"
                    icon={<ReportProblemRoundedIcon />}
                    className={cls(cmn.mbott10)}
                    closable={false}
                  />
                </Collapse>
                <Tile
                  text="Receiver address"
                  className={cls(styles.inputAmount)}
                  children={
                    <div className={cls(cmn.flex, cmn.flexcv, cmn.mtop5)}>
                      <div className={cls(cmn.flexg)}>
                        <div
                          className={cls(
                            cmn.flex,
                            cmn.flexg,
                            cmn.flexcv,
                            'amountInput',
                            'addressInput'
                          )}
                        >
                          <Jazzicon
                            diameter={25}
                            seed={jsNumberForAddress(
                              (edit ? inputAddress : props.customRewardAddress) || ''
                            )}
                          />
                          <div className={cls(cmn.flexg, cmn.mleft10)}>
                            <TextField
                              inputRef={(input) => input?.focus()}
                              variant="standard"
                              placeholder={ZERO_ADDRESS}
                              value={edit ? inputAddress : props.customRewardAddress}
                              onChange={handleChange}
                              disabled={!edit}
                              style={{ width: '100%' }}
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        {edit ? (
                          <div>
                            <Button
                              variant="contained"
                              className={cls('btnSm')}
                              onClick={saveAddress}
                            >
                              Save
                            </Button>
                            <Button
                              variant="text"
                              className={cls('btnSm', 'filled', cmn.mleft10)}
                              onClick={() => {
                                setInputAddress(props.address)
                                props.setCustomRewardAddress(props.address)
                                setEdit(false)
                                setErrorMsg(undefined)
                              }}
                            >
                              Reset
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="text"
                            className={cls('btnSm', 'filled')}
                            onClick={() => setEdit(!edit)}
                            disabled={props.disabled}
                          >
                            Change
                          </Button>
                        )}
                      </div>
                    </div>
                  }
                  icon={<PersonRoundedIcon />}
                  grow
                />
                <SkBtn
                  text={props.loading ? 'Retrieving' : 'Retrieve'}
                  disabled={props.disabled || edit}
                  onClick={props.retrieveRewards}
                  className={cls('btn', cmn.mleft10, cmn.mbott10, cmn.mtop20)}
                  variant="contained"
                />
              </SkPaper>
            </SkPaper>
          </Container>
        </Box>
      </Modal>
    </div>
  )
}

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
import { SkPaper, Tile, useThemeMode, styles } from '@skalenetwork/metaport'
import { type types, helper } from '@/core'

import { Collapse, Container, TextField, Box, Button, Modal, InputAdornment, useMediaQuery, useTheme } from '@mui/material'
import { TriangleAlert, User } from 'lucide-react'
import Message from '../Message'
import SkBtn from '../SkBtn'

import Avatar from 'boring-avatars'
import { AVATAR_COLORS } from '../../core/constants'

export default function RetrieveRewardModal(props: {
  address: types.AddressType | undefined
  customRewardAddress: types.AddressType | undefined
  setCustomRewardAddress: (customRewardAddress: types.AddressType | undefined) => void
  retrieveRewards: () => void
  loading: boolean
  disabled: boolean
}) {
  const { mode } = useThemeMode()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
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
        size="small"
        onClick={handleOpen}
        disabled={props.disabled}
        className="btn btnSm text-xs bg-accent-foreground! text-accent! align-center! disabled:bg-muted-foreground!"
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
            width: { xs: '95%', sm: 'auto' },
            minWidth: { md: 'max-content' }
          }}
          className="grow items-center flex flex-col"
        >
          <Container maxWidth="md">
            <SkPaper className="p-0">
              <SkPaper gray>
                <p className="text-foreground font-bold text-center mt-2.5 mb-2.5">
                  Confirm reward retrieval
                </p>
                <Message
                  text="Double-check the address. Withdrawing to a wallet you don't control will lead to permanent loss of funds."
                  type="warning"
                  icon={<TriangleAlert size={17} />}
                  className="mb-2.5"
                />
                <Collapse in={!!errorMsg}>
                  <Message
                    text={errorMsg ?? ''}
                    type="error"
                    icon={<TriangleAlert size={17} />}
                    className="mb-2.5!"
                    onClose={() => setErrorMsg(undefined)}
                  />
                </Collapse>
                {!edit ? (
                  <Tile
                    text="Receiver address"
                    value={isMobile ? helper.shortAddress(props.customRewardAddress as types.AddressType) : props.customRewardAddress}
                    copy={props.customRewardAddress}
                    icon={<Avatar variant="marble" name={props.customRewardAddress} colors={AVATAR_COLORS} size={20} />}
                    children={
                      <div className="flex justify-end mt-2">
                        <Button
                          variant="text"
                          className="btnSm bg-foreground! text-accent!"
                          onClick={() => setEdit(!edit)}
                        >
                          Change
                        </Button>
                      </div>
                    }
                  />
                ) : (
                  <Tile
                    text="Receiver address"
                    className="styles.inputAmount"
                    children={
                      <div className="flex items-center">
                        <div className="grow">
                          <TextField
                            fullWidth
                            placeholder="Enter wallet address"
                            value={inputAddress}
                            onChange={handleChange}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Avatar variant="marble" name={inputAddress} colors={AVATAR_COLORS} size={20} />
                                </InputAdornment>
                              )
                            }}
                            className={`${styles.skInput} ${mode === 'light' && styles.skInputLight} bg-card! border border-border rounded-full shadow-xs`}
                            sx={{
                              '& .MuiOutlinedInput-root': { borderRadius: '25px' },
                              '& fieldset': { border: 'none' }
                            }}
                          />
                        </div>
                        <div>
                          <div>
                            <Button variant="contained" className="btnSm text-accent! bg-foreground! ml-2.5!" onClick={saveAddress}>
                              Save
                            </Button>
                            <Button
                              variant="text"
                              className="btnSm text-foreground! font-semibold hover:bg-foreground/10! ml-1.5!"
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
                        </div>
                      </div>
                    }
                    icon={<User size={17} />}
                    grow
                  />
                )}
                <SkBtn
                  text={props.loading ? 'Retrieving' : 'Retrieve'}
                  disabled={props.disabled || edit}
                  onClick={props.retrieveRewards}
                  className="mr-1.5! mt-2.5! w-full! btnMd"
                />
              </SkPaper>
            </SkPaper>
          </Container>
        </Box>
      </Modal>
    </div>
  )
}

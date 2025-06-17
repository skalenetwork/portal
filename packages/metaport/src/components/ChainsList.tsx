import React from 'react'
import { types } from '@/core'
import Button from '@mui/material/Button'
import { Modal, Container, Grid } from '@mui/material'
import ChainIcon from './ChainIcon'
import Chain from './Chain'
import BridgeChainCard from './BridgeChainCard'
import { cls, cmn, styles } from '../core/css'

import SkPaper from './SkPaper'
import { CHAINS_META } from '../core/metadata'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'

export default function ChainsList(props: {
  config: types.mp.Config
  setChain: (chain: string) => void
  chain: string
  chains: string[]
  disabledChain: string
  from?: boolean
  disabled?: boolean
  size?: 'sm' | 'md'
  destChains?: string[]
}) {
  const [open, setOpen] = React.useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const schainNames = [
    ...props.chains.filter((name) => name !== props.disabledChain),
    props.disabledChain
  ]

  function handle(schainName: string) {
    handleClose()
    props.setChain(schainName)
  }

  const size = props.size ?? 'sm'

  const modalTitle = props.from ? 'Choose source chain' : 'Choose destination chain'

  return (
    <div>
      <div className={cls(cmn.mleft10, cmn.pbott10, cmn.ptop10)} style={{ marginRight: '10px' }}>
        <Button
          className={cls(cmn.flex, cmn.flexcv, cmn.fullWidth, cmn.padd10, cmn.mri10)}
          onClick={handleOpen}
          disabled={props.disabled}
          endIcon={
            <KeyboardArrowDownRoundedIcon
              className={cls(cmn.pPrim, cmn.mleft10)}
              style={{ marginRight: '12px' }}
            />
          }
        >
          {props.chain ? (
            <div className={cls(cmn.flex, cmn.fullWidth, cmn.flexcv, cmn.mri10)}>
              <Chain skaleNetwork={props.config.skaleNetwork} chainName={props.chain} size={size} />
              <div className={cls(cmn.flex, cmn.flexg)}></div>
            </div>
          ) : (
            <div className={cls(cmn.flex, cmn.flexcv)}>
              <div className={cls(cmn.flex, cmn.flexc, cmn.mri10)}>
                <ChainIcon skaleNetwork={props.config.skaleNetwork} chainName={props.chain} />
              </div>
              <p className={cls(cmn.flex, cmn.p3, cmn.p600, cmn.p, cmn.pPrim, cmn.mri10)}>
                Transfer {props.from ? 'from' : 'to'}...
              </p>
            </div>
          )}
        </Button>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className={cls(cmn.darkTheme, styles.metaport, styles.backdropBlur)}
      >
        <Container maxWidth="md" className={cls(styles.modalContainer)}>
          <div className={cls(cmn.flex, cmn.mbott20)}>
            <div className={cls(cmn.flexg)}></div>
            <SkPaper gray>
              <p
                className={cls(
                  cmn.p,
                  cmn.p2,
                  cmn.p700,
                  cmn.pPrim,
                  cmn.mtop5,
                  cmn.mbott5,
                  cmn.mleft20,
                  cmn.mri20,
                  cmn.flexcv,
                  cmn.pCent
                )}
              >
                {modalTitle}
              </p>
            </SkPaper>
            <div className={cls(cmn.flexg)}></div>
          </div>
          <div
            className={cls(
              cmn.chainsList,
              cmn.mbott10,
              cmn.mri10,
              cmn.mleft10,
              styles.bridgeModalScroll
            )}
          >
            <Grid container spacing={2}>
              {schainNames.map((name) => (
                <Grid item xs={6} md={4} key={name} className={cls(styles.fullHeight)}>
                  <BridgeChainCard
                    skaleNetwork={props.config.skaleNetwork}
                    chainName={name}
                    chainsMeta={CHAINS_META[props.config.skaleNetwork]}
                    onClick={() => handle(name)}
                    disabled={name === props.disabledChain}
                    from={props.from}
                  />
                </Grid>
              ))}
            </Grid>
          </div>
        </Container>
      </Modal>
    </div>
  )
}

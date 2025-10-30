import React from 'react'
import { types } from '@/core'

import { Modal, Container, Grid } from '@mui/material'
import Button from '@mui/material/Button'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'

import SkPaper from './SkPaper'
import { CHAINS_META } from '../core/metadata'
import BridgeChainCard from './BridgeChainCard'
import ChainIcon from './ChainIcon'
import Chain from './Chain'

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
      <div className="ml-2.5 pb-2.5 pt-2.5 mr-2.5">
        <Button
          className="flex items-center w-full p-2.5 mr-2.5"
          onClick={handleOpen}
          disabled={props.disabled}
          endIcon={
            <KeyboardArrowDownRoundedIcon
              className="text-primary left10"
              style={{ marginRight: '12px' }}
            />
          }
        >
          {props.chain ? (
            <div className="flex w-full items-center mr-2.5">
              <Chain skaleNetwork={props.config.skaleNetwork} chainName={props.chain} size={size} />
              <div className="flex flex-grow"></div>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="flex items-center justify-center mr-2.5">
                <ChainIcon skaleNetwork={props.config.skaleNetwork} chainName={props.chain} />
              </div>
              <p className="flex text-sm text-gray-500 font-semibold mr-2.5">
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
        className="styles.metaport, styles.backdropBlur, 'dark'"
      >
        <Container maxWidth="md" className="styles.modalContainer">
          <div className="flex cmn.mbott20">
            <div className="flex-grow"></div>
            <SkPaper gray>
              <p
                className="text-base text-primary font-bold mt-1.5 mb-1.5 ml-5 mr-5 flex items-center text-center">
                {modalTitle}
              </p>
            </SkPaper>
            <div className="flex-grow"></div>
          </div>
          <div
            className="styles.bridgeModalScroll mb-2.5 mr-2.5 ml-2.5"
          >
            <Grid container spacing={2}>
              {schainNames.map((name) => (
                <Grid size={{ xs: 6, md: 4 }} key={name} className="styles.fullHeight">
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

import React from 'react'
import { types } from '@/core'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded'
import MotionPhotosOffRoundedIcon from '@mui/icons-material/MotionPhotosOffRounded'

import ChainApps from './ChainApps'
import ChainIcon from './ChainIcon'
import Chain from './Chain'

import { getChainAlias, getChainAppsMeta } from '../core/metadata'
import { cls, cmn, styles } from '../core/css'

import SkPaper from './SkPaper'

export default function ChainsList(props: {
  config: types.mp.Config
  expanded: string | false
  setExpanded: (expanded: string | false) => void
  setChain: (chain: string) => void
  chain: string
  setApp: (chain: string) => void
  app: string
  chains: string[]
  disabledChain: string
  from?: boolean
  disabled?: boolean
  size?: 'sm' | 'md'
  destChains?: string[]
}) {
  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    props.setExpanded(isExpanded ? panel : false)
  }

  const schainNames = []

  for (let chain of props.chains) {
    const isHub = chain == props.chain && getChainAppsMeta(props.chain, props.config.skaleNetwork)
    if (chain !== props.disabledChain && (chain != props.chain || isHub)) {
      schainNames.push(chain)
    }
  }

  function handle(schainName: string, app?: string) {
    props.setExpanded(false)
    props.setChain(schainName)
    props.setApp(app)
  }

  const size = props.size ?? 'sm'

  return (
    <div>
      <Accordion
        expanded={props.expanded === 'panel1'}
        onChange={handleChange('panel1')}
        disabled={props.disabled}
        elevation={0}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreRoundedIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          className={styles.accordionSummary}
        >
          {props.chain ? (
            <div className={cls(cmn.flex, cmn.fullWidth, cmn.flexcv)}>
              <Chain
                skaleNetwork={props.config.skaleNetwork}
                chainName={props.chain}
                size={size}
                app={props.app}
              />
              <div className={cls(cmn.flex, cmn.flexg)}></div>
              <div className={cls(cmn.flex, cmn.flexc)}>
                {props.app ? (
                  <SkPaper gray className={cls(cmn.mri10, cmn.nop)}>
                    <p
                      className={cls(
                        cmn.p,
                        [cmn.p4, size === 'md'],
                        [cmn.p4, size === 'sm'],
                        cmn.p600,
                        cmn.pSec,
                        cmn.mtop5,
                        cmn.mbott5,
                        cmn.mleft10,
                        cmn.mri10,
                        cmn.pWrap
                      )}
                    >
                      on {getChainAlias(props.config.skaleNetwork, props.chain)?.split(' ')[0]}
                    </p>
                  </SkPaper>
                ) : null}
              </div>
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
        </AccordionSummary>
        <AccordionDetails>
          <div
            className={cls(cmn.chainsList, cmn.mbott10, cmn.mri10)}
            style={{ marginLeft: '8px' }}
          >
            {schainNames.map((name) => (
              <div key={name}>
                <Button
                  color="secondary"
                  size="medium"
                  onClick={() => handle(name)}
                  className={cls(cmn.fullWidth)}
                >
                  <div
                    className={cls(
                      cmn.flex,
                      cmn.flexcv,
                      cmn.mleft10,
                      [cmn.mtop5, size === 'sm'],
                      [cmn.mbott5, size === 'sm'],
                      [cmn.mtop10, size === 'md'],
                      [cmn.mbott10, size === 'md'],
                      cmn.fullWidth
                    )}
                  >
                    <Chain
                      skaleNetwork={props.config.skaleNetwork}
                      chainName={name}
                      size={size}
                      bold={props.destChains?.includes(name)}
                      prim={props.destChains?.includes(name)}
                    />
                    <div className={cls(cmn.flex, cmn.flexg)}></div>
                    {props.destChains && !props.destChains?.includes(name) ? (
                      <Tooltip
                        arrow
                        title="Current token is not available on this chain."
                        placement="top"
                      >
                        <MotionPhotosOffRoundedIcon
                          className={cls(cmn.mri10, cmn.pSec, styles.chainIconxs)}
                        />
                      </Tooltip>
                    ) : null}
                    <KeyboardArrowRightRoundedIcon
                      className={cls(
                        cmn.mri5,
                        [cmn.pPrim, props.destChains?.includes(name)],
                        [cmn.pSec, !props.destChains?.includes(name)]
                      )}
                    />
                  </div>
                </Button>
                <div className={cls([cmn.mleft5, size === 'md'])}>
                  <ChainApps
                    skaleNetwork={props.config.skaleNetwork}
                    chainName={name}
                    handle={handle}
                    size={size}
                    prim={props.destChains?.includes(name)}
                  />
                </div>
              </div>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

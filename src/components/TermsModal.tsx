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
 * @file TermsModal.ts
 * @copyright SKALE Labs 2022-Present
 */

import { useState, type Dispatch, type SetStateAction } from 'react'

import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

import KeyRoundedIcon from '@mui/icons-material/KeyRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import GradingRoundedIcon from '@mui/icons-material/GradingRounded'
import { type MetaportCore, SkPaper, cls, cmn, styles } from '@skalenetwork/metaport'

import { PORTAL_URLS } from '../core/constants'
import TermsOfServiceBridge from '../data/terms-of-service.mdx'
import TermsOfServiceStaking from '../data/terms-of-service-staking.mdx'

export default function TermsModal(props: {
  mpc: MetaportCore
  termsAccepted: boolean
  setTermsAccepted: Dispatch<SetStateAction<boolean>>
  type: 'bridge' | 'staking'
}) {
  const [scrolled, setScrolled] = useState<boolean>(false)

  const portalUrl = PORTAL_URLS[props.mpc.config.skaleNetwork] ?? PORTAL_URLS.mainnet

  function getAgreeButtonText(): string {
    if (!scrolled) return '⬆️ Read Terms of Service to continue ⬆️'
    return 'Agree to terms'
  }

  function handleTermsScroll(e: any): void {
    const diff = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight
    const bottom = Math.abs(diff) < 15
    setScrolled(bottom)
  }
  const title = props.type === 'bridge' ? 'Bridge' : 'Staking'
  if (props.termsAccepted) return null
  return (
    <div>
      <Container maxWidth="md" className={cls(cmn.mdtop5)}>
        <div className={cls(cmn.flex)}>
          <h2 className={cls(cmn.nom)}>{title}</h2>
        </div>
        <p className={cls(cmn.p, cmn.p3, cmn.pSec, cmn.mbott20)}>
          Review the terms of service carefully and confirm
        </p>
        <Box>
          <Grid container spacing={2}>
            <Grid item md={6} xs={12}>
              <SkPaper className={cls(styles.fullHeight, 'modalBlock modalBlock2')}>
                <div className={cls(cmn.m10)}>
                  <KeyRoundedIcon style={{ color: 'rgb(238 195 0)' }} />
                  <p className={cls(cmn.p, cmn.p3, cmn.p700, cmn.mtop5)}>
                    SKALE will NEVER ask you for your seed phrase or private keys
                  </p>
                </div>
              </SkPaper>
            </Grid>
            <Grid item md={6} xs={12}>
              <SkPaper className={cls(styles.fullHeight, 'modalBlock modalBlock3')}>
                <div className={cls(cmn.m10)}>
                  <LockRoundedIcon style={{ color: '#14e96a' }} />
                  <p className={cls(cmn.p, cmn.p3, cmn.p700, cmn.mtop5)}>
                    Make sure you are connected to the correct URL and only use this official link:
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href={portalUrl}
                      className={cls(cmn.mleft5)}
                    >
                      {portalUrl}
                    </Link>
                  </p>
                </div>
              </SkPaper>
            </Grid>
          </Grid>
        </Box>
        <SkPaper className={cls(cmn.mtop20, 'modalBlock modalBlock4')}>
          <div className={cls(cmn.m10, 'scrollable')}>
            <GradingRoundedIcon style={{ color: '#329cff' }} />
            <p className={cls(cmn.p, cmn.p3, cmn.p700, cmn.mtop10, cmn.pPrim)}>
              Before you use the SKALE {title}, you must review the terms of service carefully and
              confirm below.
            </p>
            <div onScroll={handleTermsScroll} className={cls('br__modalScroll', cmn.mtop20)}>
              <div id="terms" style={{ paddingRight: '20px' }}>
                {props.type === 'bridge' ? <TermsOfServiceBridge /> : <TermsOfServiceStaking />}
              </div>
            </div>
          </div>
        </SkPaper>
        <Button
          onClick={() => {
            props.setTermsAccepted(true)
          }}
          variant="contained"
          disabled={!scrolled}
          className={cls(styles.btnAction, cmn.mtop20)}
          size="large"
        >
          {getAgreeButtonText()}
        </Button>
      </Container>
    </div>
  )
}

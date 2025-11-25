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

import Box from '@mui/material/Box'

import KeyRoundedIcon from '@mui/icons-material/KeyRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import GradingRoundedIcon from '@mui/icons-material/GradingRounded'
import { type MetaportCore, SkPaper } from '@skalenetwork/metaport'

import { PORTAL_URLS } from '../core/constants'
import TermsOfService from '../data/terms-of-service.mdx'
import { Handshake, Key, Lock, Signature } from 'lucide-react'

export default function TermsModal(props: {
  mpc: MetaportCore
  termsAccepted: boolean
  setTermsAccepted: Dispatch<SetStateAction<boolean>>
  type: 'bridge' | 'staking'
}) {
  const [scrolled, setScrolled] = useState<boolean>(false)

  const portalUrl = PORTAL_URLS[props.mpc.config.skaleNetwork] ?? PORTAL_URLS.mainnet

  function getAgreeButtonText(): string {
    if (!scrolled) return 'Read Terms of Service to continue'
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
    <div >
      <Container maxWidth="md" className="">
        <h2 className="m-0 text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-secondary-foreground font-semibold">
          Review the terms of service carefully and confirm
        </p>
        <Box className='mt-4'>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
              <SkPaper gray className="h-full">
                <div className="m-2.5">
                  <Key className='text-amber-500' />
                  <p className="text-sm font-bold mt-1.5 text-foreground">
                    SKALE will NEVER ask you for your seed phrase or private keys
                  </p>
                </div>
              </SkPaper>
            </div>
            <div className="col-span-1">
              <SkPaper gray className="h-full">
                <div className="m-2.5">
                  <Lock className='text-emerald-500' />
                  <p className="text-sm font-bold mt-1.5 text-foreground">
                    Make sure you are connected to the correct URL and only use this official link:
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href={portalUrl}
                      className="ml-1!"
                    >
                      {portalUrl}
                    </Link>
                  </p>
                </div>
              </SkPaper>
            </div>
          </div>
        </Box>
        <SkPaper gray className="mt-5">
          <div className="m-2.5 overflow-auto">
            <Signature className='text-cyan-500' />
            <p className="text-sm font-bold mt-2.5 text-foreground">
              Before you use the SKALE {title}, you must review the terms of service carefully and
              confirm below.
            </p>
            <div onScroll={handleTermsScroll} className="br__modalScroll mt-5">
              <div id="terms" style={{ paddingRight: '20px' }} className='text-foreground/80 font-medium text-sm'>
                <TermsOfService />
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
          className={`w-full text-none text-sm font-semibold py-5! ${scrolled ? 'bg-accent-foreground!' : 'bg-accent-foreground/50!'} text-accent! px-8 rounded-[25px] shadow-none mt-5 ease-in-out transition-transform duration-150 active:scale-[0.97]`}
          style={{
            marginTop: '20px',
            marginBottom: '0px',
            minHeight: '47px',
            textTransform: 'none',
            fontSize: '0.8025rem',
            lineHeight: '1.6',
            letterSpacing: '0.02857em'
          }}
          size="large"
        >
          {getAgreeButtonText()}
        </Button>
      </Container>
    </div >
  )
}

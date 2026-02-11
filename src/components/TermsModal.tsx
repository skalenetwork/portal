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
import { Handshake, Key, Lock } from 'lucide-react'

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
    <div className="h-[calc(100vh-120px)] md:h-[calc(100vh-102px)] flex flex-col overflow-hidden">
      <Container
        maxWidth="md"
        className="flex flex-col flex-1 overflow-hidden px-2! py-0! md:px-0 md:py-4"
      >
        <div>
          <h2 className="m-0 text-base md:text-xl font-bold text-foreground">{title}</h2>
          <p className="text-[11px] md:text-xs text-secondary-foreground font-semibold mt-1">
            Review the terms of service carefully and confirm
          </p>
          <Box className="mt-3 md:mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-3">
              <div className="col-span-1">
                <SkPaper gray className="h-full">
                  <div className="p-2 md:p-2.5">
                    <Key className="text-amber-500 mb-2 hidden md:inline!" size={20} />
                    <p className="text-[13px] md:text-sm font-bold text-foreground">
                      SKALE will NEVER ask you for your seed phrase or private keys
                    </p>
                  </div>
                </SkPaper>
              </div>
              <div className="col-span-1">
                <SkPaper gray className="h-full">
                  <div className="p-2 md:p-2.5">
                    <Lock className="text-green-500 mb-2 hidden md:inline!" size={20} />
                    <p className="text-[13px] md:text-sm font-bold text-foreground">
                      Make sure you use only the official URL:
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href={portalUrl}
                        className="ml-1! text-blue-600! dark:text-blue-400!"
                      >
                        {portalUrl}
                      </Link>
                    </p>
                  </div>
                </SkPaper>
              </div>
            </div>
          </Box>
        </div>
        <div className="mt-3 flex flex-col min-h-0 md:mt-3.5">
          <SkPaper gray className="flex-1 flex flex-col min-h-0">
            <div className="p-2.5 md:p-3 flex-1 flex flex-col min-h-0">
              <p className="text-[13px] md:text-sm font-bold text-foreground">
                Before you use the SKALE {title}, you must review the terms of service carefully and
                confirm below:
              </p>
              <div onScroll={handleTermsScroll} className="mt-1.5 md:mt-2 flex-1 overflow-y-auto">
                <div
                  id="terms"
                  style={{ paddingRight: '10px' }}
                  className="text-foreground text-[13px] md:text-sm tosMd"
                >
                  <TermsOfService />
                </div>
              </div>
            </div>
          </SkPaper>
        </div>
        <Button
          onClick={() => {
            props.setTermsAccepted(true)
          }}
          variant="contained"
          disabled={!scrolled}
          className={`w-full mt-3! md:mt-4! mb-12! md:mb-0! capitalize! text-[13px]! md:text-sm! font-semibold! py-3.5! md:py-4! ${scrolled ? 'bg-accent-foreground!' : 'bg-accent-foreground/30!'} ${scrolled ? 'text-accent!' : 'text-muted!'} text-accent! ease-in-out transition-transform duration-150 active:scale-[0.97]`}
          size="large"
        >
          {getAgreeButtonText()}
        </Button>
      </Container>
    </div>
  )
}

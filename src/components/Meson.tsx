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
 * @file Meson.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { useState } from 'react'
import { ChainIcon, SkPaper, useWagmiAccount } from '@skalenetwork/metaport'
import { type types, metadata, constants } from '@/core'

import { Collapse } from '@mui/material'
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded'

import SkStack from './SkStack'
import ChainLogo from './ChainLogo'
import networks from '../assets/networks.png'
import { MAINNET_CHAIN_LOGOS } from '../core/constants'
import ConnectWallet from './ConnectWallet'

const SUPPORTED_CHAINS = ['elated-tan-skat', 'honorable-steel-rasalhague', 'green-giddy-denebola']

export default function Meson(props: {
  skaleNetwork: types.SkaleNetwork
  chainsMeta: types.ChainsMetadataMap
  className?: string
}) {
  const [show, setShow] = useState<boolean>(false)
  const { address } = useWagmiAccount()

  function openMeson(chain: string) {
    const shortAlias = metadata.getChainShortAlias(props.chainsMeta, chain)
    const link = `https://meson.to/skale-${shortAlias}/${address}`
    window.open(link, 'meson.to', 'width=375,height=640')
  }

  if (props.skaleNetwork !== constants.MAINNET_CHAIN_NAME) return
  return (
    <div className={props.className}>
      <div
        onClick={() => {
          setShow(!show)
        }}
      >
        <SkPaper gray className="hoverable cursor-pointer">
          <SkStack className="p-1 items-center">
            <img src={networks} className="mr-2.5" style={{ height: '25px' }} />
            <div className="grow">
              <div className="flex grow items-center">
                <p className="font-semibold text-foreground text-sm">
                  Bridge from Other Popular Networks
                </p>
              </div>
              <p
                className="text-xs font-medium text-secondary-foreground"
              >
                Transfer from 45+ chains using Meson.Fi
              </p>
            </div>
              <div className="md:ml-2.5 md:mr-1.5 flex items-center">
                <ArrowForwardIosRoundedIcon
                  className={`text-secondary-foreground text-xs! ${show ? 'rotate-90' : ''}`}
                />
              </div>
          </SkStack>
        </SkPaper>
      </div>
      <Collapse in={show} className="mt-2.5">
        {!address ? (
          <ConnectWallet className="grow" />
        ) : (
          <div>
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {SUPPORTED_CHAINS.map((chain: string) => (
                  <div
                    key={chain}
                    className="col-span-1"
                    onClick={() => {
                      openMeson(chain)
                    }}
                  >
                    <SkPaper gray className="hoverable cursor-pointer">
                      <div className="text-center mt-2.5 mb-2.5">
                        <div className="flex justify-center">
                          <ChainIcon
                            skaleNetwork={props.skaleNetwork}
                            chainName={chain}
                            size="lg"
                            chainsMeta={props.chainsMeta}
                          />
                        </div>
                        <p className="font-semibold text-foreground text-xs mt-4">
                          to {metadata.getAlias(props.skaleNetwork, props.chainsMeta, chain)}
                        </p>
                      </div>
                    </SkPaper>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Collapse>
    </div>
  )
}

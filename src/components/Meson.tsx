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
import { cmn, cls, styles, SkPaper, useWagmiAccount } from '@skalenetwork/metaport'
import { type types, metadata, constants } from '@/core'

import { Collapse, Grid } from '@mui/material'
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
  isXs?: boolean
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
    <div className="props.className, 'paddBott60'">
      <div
        onClick={() => {
          setShow(!show)
        }}
      >
        <SkPaper gray className="'hoverable pointer'">
          <SkStack className="cmn.m10, cmn.flexcv">
            <img src={networks} className="mr-2.5" style={{ height: '40px' }} />
            <div className="cmn.flexg">
              <div className="cmn.flex, cmn.flexg, cmn.flexcv">
                <p
                  className="cmn.cap, cmn.nom, cmn.pPrim, cmn.p"
                  style={{ fontSize: '1.05rem', fontWeight: 700 }}
                >
                  Bridge from Other Popular Networks
                </p>
              </div>
              <p className="text-xs cmn.pSec [cmn.pCent, props.isXs]">
                Transfer from 45+ chains using Meson.Fi
              </p>
            </div>
            {!props.isXs ? (
              <div className="cmn.mleft10, cmn.mri5, cmn.flex, cmn.flexcv">
                <ArrowForwardIosRoundedIcon
                  className="cmn.pSec, styles.chainIconxs, 'rotate-90', ['active', show]"
                />
              </div>
            ) : null}
          </SkStack>
        </SkPaper>
      </div>
      <Collapse in={show} className="cmn.mtop10">
        {!address ? (
          <ConnectWallet className="cmn.flexg" />
        ) : (
          <div>
            <p className=" text-sm, cmn.pSec, text-xs00, cmn.mbott10">
              Select destination chain
            </p>
            <div>
              <Grid container spacing={2} className="cmn.full">
                {SUPPORTED_CHAINS.map((chain: string) => (
                  <Grid
                    key={chain}
                    item
                    md={4}
                    sm={6}
                    xs={12}
                    onClick={() => {
                      openMeson(chain)
                    }}
                  >
                    <SkPaper gray className="'hoverable pointer'">
                      <div className="cmn.pCent, cmn.mtop10, cmn.mbott10">
                        <ChainLogo
                          network={props.skaleNetwork}
                          className="styles.chainIconlg"
                          chainName={chain}
                          logos={MAINNET_CHAIN_LOGOS}
                        />
                        <p className="cmn.cap, cmn.nom, cmn.pPrim,  text-sm, cmn.p700">
                          {metadata.getAlias(props.chainsMeta, chain)}
                        </p>
                      </div>
                    </SkPaper>
                  </Grid>
                ))}
              </Grid>
            </div>
          </div>
        )}
      </Collapse>
    </div>
  )
}

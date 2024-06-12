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
 * @file ChainAccordion.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { useState } from 'react'

import Grid from '@mui/material/Grid'
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded'
import PlaylistAddCheckCircleRoundedIcon from '@mui/icons-material/PlaylistAddCheckCircleRounded'
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'

import {
  cmn,
  cls,
  styles,
  PROXY_ENDPOINTS,
  type MetaportCore,
  SkPaper,
  type interfaces
} from '@skalenetwork/metaport'

import VerifiedContracts from './VerifiedContracts'
import CopySurface from './CopySurface'
import AccordionSection from './AccordionSection'
import AccordionLink from './AccordionLink'

import {
  getRpcUrl,
  getRpcWsUrl,
  getFsUrl,
  getChainId,
  HTTPS_PREFIX,
  WSS_PREFIX
} from '../core/chain'
import { getExplorerUrl } from '../core/explorer'

export default function ChainAccordion(props: {
  schainName: string
  mpc: MetaportCore
  className?: string
}) {
  const network = props.mpc.config.skaleNetwork
  const proxyBase = PROXY_ENDPOINTS[network]

  const rpcUrl = getRpcUrl(proxyBase, props.schainName, HTTPS_PREFIX)
  const rpcWssUrl = getRpcWsUrl(proxyBase, props.schainName, WSS_PREFIX)
  const fsUrl = getFsUrl(proxyBase, props.schainName, HTTPS_PREFIX)

  const explorerUrl = getExplorerUrl(network, props.schainName)
  const chainId = getChainId(props.schainName)

  function findWrapperAddress(token: interfaces.Token): `0x${string}` | null | undefined {
    const chainWithWrapper = Object.values(token.chains).find((chain) => chain.wrapper)
    return chainWithWrapper ? chainWithWrapper.wrapper : null
  }

  const [expanded, setExpanded] = useState<string | false>('panel1')

  function handleChange(panel: string | false) {
    setExpanded(expanded && panel === expanded ? false : panel)
  }

  const tokenConnections = props.mpc.config.connections[props.schainName] ?? {}
  const chainTokens = tokenConnections.erc20 ?? {}

  return (
    <SkPaper gray className={cls(cmn.mtop20, cmn.mbott20, props.className)}>
      <AccordionSection
        handleChange={handleChange}
        expanded={expanded}
        panel="panel1"
        title="Developer info"
        icon={<ConstructionRoundedIcon />}
      >
        <Grid container spacing={2} className={cls(cmn.full)}>
          <Grid item md={12} xs={12}>
            <CopySurface className={cls(styles.fullHeight)} title="RPC Endpoint" value={rpcUrl} />
          </Grid>
          <Grid item md={6} xs={12}>
            <CopySurface
              className={cls(styles.fullHeight)}
              title="Websocket Endpoint"
              value={rpcWssUrl}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <CopySurface
              className={cls(styles.fullHeight)}
              title="Filestorage Endpoint"
              value={fsUrl}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <CopySurface
              className={cls(styles.fullHeight)}
              title="SKALE Manager name"
              value={props.schainName}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <CopySurface className={cls(styles.fullHeight)} title="Chain ID Hex" value={chainId} />
          </Grid>
        </Grid>
      </AccordionSection>
      <AccordionSection
        handleChange={handleChange}
        expanded={expanded}
        panel="panel2"
        title="Available tokens"
        icon={<AccountBalanceWalletRoundedIcon />}
      >
        {Object.keys(chainTokens).length !== 0 ? (
          <div>
            <Grid container spacing={2} className={cls(cmn.full)}>
              {Object.keys(chainTokens).flatMap((tokenSymbol: string) => {
                const wrapperAddress = findWrapperAddress(chainTokens[tokenSymbol])
                return [
                  <Grid key={tokenSymbol} item lg={3} md={4} sm={6} xs={12}>
                    <CopySurface
                      className={cls(styles.fullHeight)}
                      title={tokenSymbol.toUpperCase()}
                      value={chainTokens[tokenSymbol].address as string}
                      tokenMetadata={props.mpc.config.tokens[tokenSymbol]}
                    />
                  </Grid>,
                  ...(wrapperAddress
                    ? [
                        <Grid key={`w${tokenSymbol}`} item lg={3} md={4} sm={6} xs={12}>
                          <CopySurface
                            className={cls(styles.fullHeight)}
                            title={`w${tokenSymbol.toUpperCase()}`}
                            value={wrapperAddress}
                            tokenMetadata={props.mpc.config.tokens[tokenSymbol]}
                          />
                        </Grid>
                      ]
                    : [])
                ]
              })}
            </Grid>
          </div>
        ) : (
          <p
            className={cls(
              cmn.p,
              cmn.p2,
              cmn.p700,
              cmn.pSec,
              cmn.fullWidth,
              cmn.mtop20,
              cmn.mbott20,
              cmn.pCent
            )}
          >
            No mapped tokens
          </p>
        )}
      </AccordionSection>
      <AccordionSection
        handleChange={handleChange}
        expanded={expanded}
        panel="panel3"
        title="Verified contracts"
        icon={<PlaylistAddCheckCircleRoundedIcon />}
      >
        <VerifiedContracts
          mpc={props.mpc}
          schainName={props.schainName}
          explorerUrl={explorerUrl}
        />
      </AccordionSection>
      <AccordionLink
        title="Manage chain"
        icon={<AdminPanelSettingsRoundedIcon />}
        url={`/admin/${props.schainName}`}
      />
    </SkPaper>
  )
}

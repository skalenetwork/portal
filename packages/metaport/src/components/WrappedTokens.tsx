/**
 * @license
 * SKALE Metaport
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @file WrappedTokens.ts
 * @copyright SKALE Labs 2023-Present
 */

import React, { useEffect, useState } from 'react'
import { useAccount, useWalletClient, useSwitchChain } from 'wagmi'
import { types, metadata } from '@/core'

import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Button from '@mui/material/Button'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import ErrorIcon from '@mui/icons-material/Error'
import AnimatedLoadingIcon from './AnimatedLoadingIcon'

import SkPaper from './SkPaper'
import TokenBalance from './TokenBalance'
import TokenIcon from './TokenIcon'

import { CHAINS_META, getTokenName } from '../core/metadata'
import { BALANCE_UPDATE_INTERVAL_MS } from '../core/constants'

import { cls, cmn, styles } from '../core/css'

import { useCollapseStore } from '../store/Store'
import { useMetaportStore } from '../store/MetaportStore'

export default function WrappedTokens() {
  const { data: walletClient } = useWalletClient()
  const { switchChainAsync } = useSwitchChain()

  const wrappedTokens = useMetaportStore((state) => state.wrappedTokens)
  const updateWrappedTokenBalances = useMetaportStore((state) => state.updateWrappedTokenBalances)
  const wrappedTokenBalances = useMetaportStore((state) => state.wrappedTokenBalances)
  const wrappedTokenContracts = useMetaportStore((state) => state.wrappedTokenContracts)
  const unwrapAll = useMetaportStore((state) => state.unwrapAll)

  const loading = useMetaportStore((state) => state.loading)
  const setLoading = useMetaportStore((state) => state.setLoading)

  const currentStep = useMetaportStore((state) => state.currentStep)
  const chainName1 = useMetaportStore((state) => state.chainName1)
  const mpc = useMetaportStore((state) => state.mpc)
  const transferInProgress = useMetaportStore((state) => state.transferInProgress)

  const { address } = useAccount()

  const expandedWT = useCollapseStore((state) => state.expandedWT)
  const setExpandedWT = useCollapseStore((state) => state.setExpandedWT)

  const [filteredTokens, setFilteredTokens] = useState<types.mp.TokenDataMap>({})

  useEffect(() => {
    updateWrappedTokenBalances(address)
    const intervalId = window.setInterval(() => {
      updateWrappedTokenBalances(address)
    }, BALANCE_UPDATE_INTERVAL_MS)
    return () => {
      window.clearInterval(intervalId)
    }
  }, [updateWrappedTokenBalances, wrappedTokenContracts, address])

  useEffect(() => {
    setFilteredTokens(
      Object.keys(wrappedTokenBalances).reduce((acc, key) => {
        if (wrappedTokenBalances[key] !== 0n) {
          acc[key] = wrappedTokens.erc20[key] ?? wrappedTokens.eth[key]
        }
        return acc
      }, {})
    )
  }, [wrappedTokens, wrappedTokenBalances])

  useEffect(() => {
    if (Object.keys(filteredTokens).length === 0) {
      if (expandedWT && loading) {
        setExpandedWT(false)
        setLoading(false)
      }
    }
  }, [filteredTokens])

  const handleChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedWT(isExpanded ? panel : false)
  }

  if (Object.keys(filteredTokens).length === 0 || currentStep !== 0 || transferInProgress) return

  const chainsMeta = CHAINS_META[mpc.config.skaleNetwork]
  const chainAlias = metadata.getAlias(mpc.config.skaleNetwork, chainsMeta, chainName1)

  return (
    <div className={cls(cmn.mtop10)}>
      <Accordion
        disabled={!!loading}
        expanded={expandedWT === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary
          className={cls(styles.accordionSummary, styles.accordionSm)}
          expandIcon={<ExpandMoreRoundedIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div className={cls(cmn.flex, cmn.fullWidth, cmn.flexcv)}>
            <div className={cls(cmn.flex, cmn.flexc, cmn.mri10)}>
              <ErrorIcon color="warning" />
            </div>
            <p className={cls(cmn.p, cmn.p3, cmn.p600, cmn.cap, cmn.pPrim, cmn.mri10)}>
              Wrapped tokens found
            </p>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <SkPaper background="transparent" className={cls(styles.accordionContent)}>
            <p className={cls(cmn.flex, cmn.p3, cmn.p, cmn.errorMessage, cmn.flexg)}>
              ❗ You have wrapped tokens on {chainAlias}. Unwrap them before proceeding with your
              transfer.
            </p>
            <div className={cls(cmn.mtop20)}>
              {Object.keys(filteredTokens).map((key, _) => (
                <div
                  key={key}
                  className={cls(cmn.flex, cmn.flexcv, cmn.fullWidth, cmn.mtop10, cmn.mbott10)}
                >
                  <div className={cls(cmn.flex, cmn.flexc)}>
                    <TokenIcon
                      tokenSymbol={filteredTokens[key]?.meta.symbol}
                      iconUrl={filteredTokens[key]?.meta.iconUrl}
                    />
                  </div>
                  <p
                    className={cls(
                      cmn.p,
                      cmn.p3,
                      cmn.p600,
                      cmn.pPrim,
                      cmn.flex,
                      cmn.flexg,
                      cmn.mri10,
                      cmn.mleft10
                    )}
                  >
                    Wrapped {getTokenName(filteredTokens[key])}
                  </p>
                  <div className={cmn.mfri10}>
                    <TokenBalance
                      balance={
                        wrappedTokenBalances
                          ? wrappedTokenBalances[filteredTokens[key]?.keyname]
                          : null
                      }
                      symbol={`w${filteredTokens[key]?.meta.symbol}`}
                      decimals={filteredTokens[key]?.meta.decimals}
                    />
                  </div>
                </div>
              ))}

              <div className={cls(cmn.mtop20, cmn.mbott20)}>
                {loading ? (
                  <Button
                    disabled
                    startIcon={<AnimatedLoadingIcon />}
                    variant="contained"
                    color="primary"
                    size="medium"
                    className={cls(styles.btnAction, cmn.mtop5)}
                  >
                    Unwrapping...
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    className={cls(styles.btnAction, cmn.mtop5)}
                    onClick={() =>
                      unwrapAll(address, switchChainAsync, walletClient, filteredTokens)
                    }
                  >
                    Unwrap all
                  </Button>
                )}
              </div>
            </div>
          </SkPaper>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

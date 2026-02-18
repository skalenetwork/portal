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
import ErrorIcon from '@mui/icons-material/Error'
import AnimatedLoadingIcon from './AnimatedLoadingIcon'
import { ChevronDown } from 'lucide-react'


import TokenBalance from './TokenBalance'
import TokenIcon from './TokenIcon'

import { CHAINS_META, getTokenName } from '../core/metadata'
import { BALANCE_UPDATE_INTERVAL_MS } from '../core/constants'

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
    <div className="mt-2.5">
      <Accordion
        disabled={!!loading}
        expanded={expandedWT === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary
          className={`py-2! px-6! `}
          expandIcon={<ChevronDown size={17} className='text-secondary-foreground!' />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div className="flex w-full items-center">
            <div className="flex items-center mr-2.5">
              <ErrorIcon color="warning" />
            </div>
            <p className="text-sm font-semibold text-foreground mr-2.5 capitalize!">
              Wrapped tokens found
            </p>
          </div>
        </AccordionSummary>
        <AccordionDetails>
            <p className="flex text-sm text-foreground font-semibold grow pl-5">
              ❗ You have wrapped tokens on {chainAlias}. Unwrap them before proceeding with your
              transfer.
            </p>
            <div className="mt-5">
              {Object.keys(filteredTokens).map((key, _) => (
                <div
                  key={key}
                  className="flex items-center w-full mt-2.5 mb-2.5 pl-5"
                >
                  <div className="flex items-center">
                    <TokenIcon
                      tokenSymbol={filteredTokens[key]?.meta.symbol}
                      iconUrl={filteredTokens[key]?.meta.iconUrl}
                    />
                  </div>
                  <p className="text-sm font-semibold text-foreground flex grow mr-2.5 ml-2.5">
                    Wrapped {getTokenName(filteredTokens[key])}
                  </p>
                  <div className="mr-2.5 pr-5">
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
            </div>

            <div className="mt-5 mb-5 pl-5 pr-5">
              {loading ? (
                <Button
                  disabled
                  startIcon={<AnimatedLoadingIcon />}
                  variant="contained"
                  color="primary"
                  size="medium"
                  className="btnMd mt-1.5  w-full capitalize! bg-muted-foreground/30!"
                >
                  Unwrapping...
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="medium"
                  className="mt-1.5 bg-foreground! btnMd w-full! btnMd text-accent!"
                  onClick={() =>
                    unwrapAll(address, switchChainAsync, walletClient, filteredTokens)
                  }
                >
                  Unwrap all
                </Button>
              )}
            </div>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

/**
 * @license
 * SKALE bridge-ui
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
 * @file Portfolio.tsx
 * @copyright SKALE Labs 2023-Present
*/

import { useEffect } from 'react';

import Collapse from '@mui/material/Collapse';
import { MAINNET_CHAIN_NAME } from '../core/constants'

import {
  SkPaper,
  AmountInput,
  SwitchDirection,
  SkStepper,
  ChainsList,
  SkConnect,
  useCollapseStore,
  useMetaportStore,
  useSFuelStore,
  useUIStore,
  useWagmiAccount,
  cls,
  cmn,
  AmountErrorMessage,
  TokenBalance,
  DestTokenBalance,
  ErrorMessage,
  CommunityPool,
  SFuelWarning,
  WrappedTokens,
  chainBg
} from '@skalenetwork/metaport';


export default function Main() {
  const expandedFrom = useCollapseStore((state) => state.expandedFrom)
  const setExpandedFrom = useCollapseStore((state) => state.setExpandedFrom)

  const expandedTo = useCollapseStore((state) => state.expandedTo)
  const setExpandedTo = useCollapseStore((state) => state.setExpandedTo)

  const expandedCP = useCollapseStore((state) => state.expandedCP)
  const expandedWT = useCollapseStore((state) => state.expandedWT)
  const expandedTokens = useCollapseStore((state) => state.expandedTokens)
  const expandedTH = useCollapseStore((state) => state.expandedTH)

  const destChains = useMetaportStore((state) => state.destChains)

  const token = useMetaportStore((state) => state.token)

  const chainName1 = useMetaportStore((state) => state.chainName1)
  const chainName2 = useMetaportStore((state) => state.chainName2)
  const setChainName1 = useMetaportStore((state) => state.setChainName1)
  const setChainName2 = useMetaportStore((state) => state.setChainName2)

  const appName1 = useMetaportStore((state) => state.appName1)
  const appName2 = useMetaportStore((state) => state.appName2)
  const setAppName1 = useMetaportStore((state) => state.setAppName1)
  const setAppName2 = useMetaportStore((state) => state.setAppName2)

  const mpc = useMetaportStore((state) => state.mpc)
  const tokens = useMetaportStore((state) => state.tokens)
  const setToken = useMetaportStore((state) => state.setToken)
  const tokenBalances = useMetaportStore((state) => state.tokenBalances)

  const errorMessage = useMetaportStore((state) => state.errorMessage)

  const transferInProgress = useMetaportStore((state) => state.transferInProgress)

  const sFuelOk = useSFuelStore((state) => state.sFuelOk)

  const theme = useUIStore((state) => state.theme)

  const { address } = useWagmiAccount()

  useEffect(() => {
    setChainName1(mpc.config.chains ? mpc.config.chains[0] : '')
    setChainName2(mpc.config.chains ? mpc.config.chains[1] : '')
  }, [])

  useEffect(() => {
    if (tokens && tokens.erc20 && Object.values(tokens.erc20)[0] && !token) {
      setToken(Object.values(tokens.erc20)[0])
    }
  }, [tokens])

  const showFrom = !expandedTo && !expandedTokens && !errorMessage && !expandedCP && !expandedTH
  const showTo =
    !expandedFrom && !expandedTokens && !errorMessage && !expandedCP && !expandedWT && !expandedTH
  const showInput =
    !expandedFrom && !expandedTo && !errorMessage && !expandedCP && !expandedWT && !expandedTH
  const showSwitch =
    !expandedFrom &&
    !expandedTo &&
    !expandedTokens &&
    !errorMessage &&
    !expandedCP &&
    !expandedWT &&
    !expandedTH
  const showStepper =
    !expandedFrom &&
    !expandedTo &&
    !expandedTokens &&
    !errorMessage &&
    !expandedCP &&
    sFuelOk &&
    !expandedWT &&
    !expandedTH &&
    !!address
  const showCP =
    !expandedFrom &&
    !expandedTo &&
    !expandedTokens &&
    !expandedTH &&
    chainName2 === MAINNET_CHAIN_NAME &&
    !expandedWT
  const showWT =
    !expandedFrom &&
    !expandedTo &&
    !expandedTokens &&
    !errorMessage &&
    !expandedCP &&
    !expandedTH &&
    sFuelOk &&
    !!address
  const showError = !!errorMessage

  const grayBg = 'rgb(136 135 135 / 15%)'
  const sourceBg = theme.vibrant ? chainBg(mpc.config.skaleNetwork, chainName1, appName1) : grayBg
  const destBg = theme.vibrant ? chainBg(mpc.config.skaleNetwork, chainName2, appName2) : grayBg

  return (
    <div>
      <Collapse in={showError}>
        <ErrorMessage errorMessage={errorMessage} />
      </Collapse>
      <SkPaper background={sourceBg} className={cmn.nop}>
        <Collapse in={showFrom}>
          <div className={cls(cmn.ptop20, cmn.mleft20, cmn.mri20, cmn.flex)}>
            <p className={cls(cmn.nom, cmn.p, cmn.p4, cmn.pSec, cmn.flex, cmn.flexg)}>From</p>
            {token ? <TokenBalance
              balance={tokenBalances[token.keyname]}
              symbol={token.meta.symbol}
              decimals={token.meta.decimals ?? ''}
            /> : null}
          </div>
          <ChainsList
            config={mpc.config}
            expanded={expandedFrom}
            setExpanded={setExpandedFrom}
            chain={chainName1}
            chains={mpc.config.chains ?? []}
            setChain={setChainName1}
            setApp={setAppName1}
            app={appName1}
            disabledChain={chainName2}
            disabled={transferInProgress}
            from={true}
            size='md'
          />
        </Collapse>

        <Collapse in={showInput}>
          <SkPaper gray className={cls()}>
            <AmountInput />
            <AmountErrorMessage />
          </SkPaper>
        </Collapse>
      </SkPaper>

      <Collapse in={showSwitch} >
        <SwitchDirection />
      </Collapse>

      <Collapse in={showTo}>
        <SkPaper background={destBg} className={cmn.nop}>
          <div className={cls(cmn.ptop20, cmn.mleft20, cmn.mri20, cmn.flex)}>
            <p className={cls(cmn.nom, cmn.p, cmn.p4, cmn.pSec, cmn.flex, cmn.flexg)}>To</p>
            <DestTokenBalance />
          </div>
          <ChainsList
            config={mpc.config}
            expanded={expandedTo}
            setExpanded={setExpandedTo}
            chain={chainName2}
            chains={destChains}
            setChain={setChainName2}
            setApp={setAppName2}
            app={appName2}
            disabledChain={chainName1}
            disabled={transferInProgress}
            size='md'
          />
        </SkPaper>
      </Collapse>
      <Collapse in={showCP}>
        <SkPaper gray className={cmn.nop}>
          <CommunityPool />
        </SkPaper>
      </Collapse>

      <Collapse in={showWT}>
        <SkPaper gray className={cmn.nop}>
          <WrappedTokens />
        </SkPaper>
      </Collapse>

      <Collapse in={!!address} >
        <SFuelWarning />
      </Collapse>

      {!address ? <SkConnect /> : null}

      <Collapse in={showStepper} className={cmn.mtop20} >
        <SkStepper skaleNetwork={mpc.config.skaleNetwork} />
      </Collapse>

    </div>)
}
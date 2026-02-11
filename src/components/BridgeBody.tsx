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
 * @file BridgeBody.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { type types, metadata, constants, networks } from '@/core'
import { NETWORKS } from '../core/constants'
import Collapse from '@mui/material/Collapse'
import PopularActions from './PopularActions'
import {
  SkPaper,
  AmountInput,
  SwitchDirection,
  SkStepper,
  ChainsList,
  SkConnect,
  useMetaportStore,
  useUIStore,
  useWagmiAccount,
  AmountErrorMessage,
  TokenBalance,
  DestTokenBalance,
  ErrorMessage,
  CommunityPool,
  SFuelWarning,
  WrappedTokens,
  useDisplayFunctions
} from '@skalenetwork/metaport'

export default function BridgeBody(props: { chainsMeta: types.ChainsMetadataMap }) {
  const { showFrom, showTo, showInput, showSwitch, showCP, showWT, showStepper } =
    useDisplayFunctions()

  const destChains = useMetaportStore((state) => state.destChains)

  const token = useMetaportStore((state) => state.token)

  const chainName1 = useMetaportStore((state) => state.chainName1)
  const chainName2 = useMetaportStore((state) => state.chainName2)
  const setChainName1 = useMetaportStore((state) => state.setChainName1)
  const setChainName2 = useMetaportStore((state) => state.setChainName2)

  const mpc = useMetaportStore((state) => state.mpc)
  const tokenBalances = useMetaportStore((state) => state.tokenBalances)

  const errorMessage = useMetaportStore((state) => state.errorMessage)

  const transferInProgress = useMetaportStore((state) => state.transferInProgress)

  const theme = useUIStore((state) => state.theme)

  const { address } = useWagmiAccount()

  const sourceBg = theme.vibrant
    ? metadata.chainBg(mpc.config.skaleNetwork, props.chainsMeta, chainName1)
    : constants.GRAY_BG
  const destBg = theme.vibrant
    ? metadata.chainBg(mpc.config.skaleNetwork, props.chainsMeta, chainName2)
    : constants.GRAY_BG

  const stepsMetadata = useMetaportStore((state) => state.stepsMetadata)
  const currentStep = useMetaportStore((state) => state.currentStep)

  return (
    <div>
      <Collapse in={!!errorMessage}>
        <ErrorMessage errorMessage={errorMessage} />
      </Collapse>
      <SkPaper gray className="p-0!">
        <Collapse in={showFrom()}>
          <ChainsList
            config={mpc.config}
            chain={chainName1}
            chains={mpc.config.chains ?? []}
            setChain={setChainName1}
            disabledChain={chainName2}
            disabled={transferInProgress}
            from={true}
            size="md"
            balance={
              token ? (
                <TokenBalance
                  balance={tokenBalances[token.keyname]}
                  symbol={token.meta.symbol}
                  decimals={token.meta.decimals ?? undefined}
                  truncate={10}
                  mpc={mpc}
                />
              ) : null
            }
          />
        </Collapse>
      </SkPaper>

      <Collapse in={showSwitch()}>
        <SwitchDirection />
      </Collapse>

      <Collapse in={showTo()}>
        <SkPaper gray className="p-0!">
          <ChainsList
            config={mpc.config}
            chain={chainName2}
            chains={mpc.config.chains}
            destChains={destChains}
            setChain={setChainName2}
            disabledChain={chainName1}
            disabled={transferInProgress}
            size="md"
            balance={<DestTokenBalance />}
          />
        </SkPaper>
      </Collapse>
      <Collapse in={showInput()}>
        <SkPaper gray className="mt-3.5">
          <AmountInput />
          <AmountErrorMessage />
        </SkPaper>
      </Collapse>

      <Collapse in={showWT(address!)}>
        <SkPaper gray className="p-0!">
          <WrappedTokens />
        </SkPaper>
      </Collapse>

      <Collapse in={showCP()}>
        <SkPaper gray className="p-0!">
          <CommunityPool />
        </SkPaper>
      </Collapse>

      {!address ? <SkConnect /> : null}

      <Collapse in={showStepper(address!)} className="mt-3.5">
        <SkStepper skaleNetwork={mpc.config.skaleNetwork} />
      </Collapse>

      {networks.hasFeatureInAny(NETWORKS, 'sfuel') && (
        <Collapse in={!!address}>
          <SFuelWarning />
        </Collapse>
      )}

      {currentStep === stepsMetadata.length && (
        <PopularActions
          chainsMeta={props.chainsMeta}
          skaleNetwork={mpc.config.skaleNetwork}
          chainName={chainName2}
        />
      )}
    </div>
  )
}

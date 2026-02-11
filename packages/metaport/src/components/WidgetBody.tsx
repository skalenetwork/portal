import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Collapse } from '@mui/material'
import { metadata, constants, networks } from '@/core'

import { useMetaportStore } from '../store/MetaportStore'
import { useUIStore } from '../store/Store'
import { useDisplayFunctions } from '../store/DisplayFunctions'

import ChainsList from './ChainsList'
import AmountInput from './AmountInput'
import SkStepper from './Stepper'
import SkPaper from './SkPaper'
import AmountErrorMessage from './AmountErrorMessage'
import SwitchDirection from './SwitchDirection'
import TokenBalance from './TokenBalance'
import DestTokenBalance from './DestTokenBalance'
import CommunityPool from './CommunityPool'
import SFuelWarning from './SFuelWarning'
import SkConnect from './SkConnect'
import WrappedTokens from './WrappedTokens'
import TransactionsHistory from './HistorySection'
import HistoryButton from './HistoryButton'

import { CHAINS_META } from '../core/metadata'

export function WidgetBody(props) {
  const { showFrom, showTo, showInput, showSwitch, showStepper, showCP, showWT, showTH } =
    useDisplayFunctions()

  const destChains = useMetaportStore((state) => state.destChains)
  const token = useMetaportStore((state) => state.token)

  const chainName1 = useMetaportStore((state) => state.chainName1)
  const chainName2 = useMetaportStore((state) => state.chainName2)
  const setChainName1 = useMetaportStore((state) => state.setChainName1)
  const setChainName2 = useMetaportStore((state) => state.setChainName2)

  const mpc = useMetaportStore((state) => state.mpc)
  const tokens = useMetaportStore((state) => state.tokens)
  const setToken = useMetaportStore((state) => state.setToken)
  const tokenBalances = useMetaportStore((state) => state.tokenBalances)

  const transferInProgress = useMetaportStore((state) => state.transferInProgress)

  const addressChanged = useMetaportStore((state) => state.addressChanged)

  const theme = useUIStore((state) => state.theme)

  const { address } = useAccount()

  useEffect(() => {
    initBridge()
  }, [])

  async function initBridge() {
    await setChainName1(mpc.config.chains ? mpc.config.chains[0] : '')
    await setChainName2(mpc.config.chains ? mpc.config.chains[1] : '')
  }

  useEffect(() => {
    addressChanged()
  }, [address])

  useEffect(() => {
    if (tokens && !token) {
      if (tokens.erc20 && Object.values(tokens.erc20)[0]) {
        setToken(Object.values(tokens.erc20)[0])
        return
      }
      if (tokens.eth && tokens.eth.eth) {
        setToken(tokens.eth.eth)
        return
      }
    }
  }, [tokens])

  const chainsMeta = CHAINS_META[mpc.config.skaleNetwork]
  const sourceBg = theme.vibrant ? metadata.chainBg(mpc.config.skaleNetwork, chainsMeta, chainName1) : constants.GRAY_BG
  const destBg = theme.vibrant ? metadata.chainBg(mpc.config.skaleNetwork, chainsMeta, chainName2) : constants.GRAY_BG
  const overlayBg = theme.vibrant ? 'rgb(0 0 0 / 40%)' : 'transparent'

  return (
    <div>
      {!!address ? (
        <div className="flex items-center mr-2.5 mb-1.5">
          <div className="grow"></div>
          <div className="mr-1.5">
            <HistoryButton />
          </div>
          <SkConnect />
        </div>
      ) : null}
      <SkPaper background={sourceBg} className="p-0">
        <SkPaper background={overlayBg} className="p-0">
          <SkPaper background="transparent" className="p-0">
            <Collapse in={showFrom()}>
              <ChainsList
                config={props.config}
                chain={chainName1}
                chains={props.config.chains}
                setChain={setChainName1}
                disabledChain={chainName2}
                disabled={transferInProgress}
                from={true}
                balance={
                  token ? (
                    <TokenBalance
                      balance={tokenBalances[token.keyname]}
                      symbol={token.meta.symbol}
                      decimals={token.meta.decimals ?? undefined}
                    />
                  ) : null
                }
                size="md"
              />
            </Collapse>
          </SkPaper>
          <Collapse in={showInput()}>
            <SkPaper gray>
              <AmountInput />
            </SkPaper>
          </Collapse>
        </SkPaper>
      </SkPaper>

      <Collapse in={showSwitch()}>
        <SwitchDirection />
      </Collapse>

      <Collapse in={showTo()}>
        <SkPaper background={destBg} className="p-0">
          <SkPaper background={overlayBg} className="p-0">
            <ChainsList
              config={props.config}
              chain={chainName2}
              chains={props.config.chains}
              destChains={destChains}
              setChain={setChainName2}
              disabledChain={chainName1}
              disabled={transferInProgress}
              balance={<DestTokenBalance />}
            />
          </SkPaper>
        </SkPaper>
      </Collapse>
      <AmountErrorMessage />

      <Collapse in={showCP()}>
        <SkPaper gray className="p-0">
          <CommunityPool />
        </SkPaper>
      </Collapse>

      <Collapse in={showWT(address)}>
        <SkPaper gray className="p-0">
          <WrappedTokens />
        </SkPaper>
      </Collapse>

      <Collapse in={showTH(address)}>
        <SkPaper className="p-0">
          <TransactionsHistory />
        </SkPaper>
      </Collapse>

      {networks.hasFeature(mpc.config.skaleNetwork, 'sfuel') && (
        <Collapse in={!!address}>
          <SFuelWarning />
        </Collapse>
      )}
      <Collapse in={showStepper(address)}>
        <SkPaper background="transparent">
          <SkStepper skaleNetwork={props.config.skaleNetwork} />
        </SkPaper>
      </Collapse>
      {!address ? <SkConnect /> : null}
    </div>
  )
}

export default WidgetBody

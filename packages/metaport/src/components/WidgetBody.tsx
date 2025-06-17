import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Collapse } from '@mui/material'
import { metadata, constants } from '@/core'

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

import { cls, cmn } from '../core/css'
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
  const sourceBg = theme.vibrant ? metadata.chainBg(chainsMeta, chainName1) : constants.GRAY_BG
  const destBg = theme.vibrant ? metadata.chainBg(chainsMeta, chainName2) : constants.GRAY_BG
  const overlayBg = theme.vibrant ? 'rgb(0 0 0 / 40%)' : 'transparent'

  return (
    <div>
      {!!address ? (
        <div className={cls(cmn.flex, cmn.flexcv, cmn.mri10, cmn.mbott5)}>
          <div className={cls(cmn.flexg)}></div>
          <div className={cmn.mri5}>
            <HistoryButton />
          </div>
          <SkConnect />
        </div>
      ) : null}
      <SkPaper background={sourceBg} className={cmn.nop}>
        <SkPaper background={overlayBg} className={cmn.nop}>
          <SkPaper background="transparent" className={cmn.nop}>
            <Collapse in={showFrom()}>
              <div className={cls(cmn.ptop20, cmn.mleft20, cmn.mri20, cmn.flex)}>
                <p className={cls(cmn.nom, cmn.p, cmn.p4, cmn.pSec, cmn.flex, cmn.flexg)}>From</p>
                <div>
                  {token ? (
                    <TokenBalance
                      balance={tokenBalances[token.keyname]}
                      symbol={token.meta.symbol}
                      decimals={token.meta.decimals}
                    />
                  ) : null}
                </div>
              </div>
              <ChainsList
                config={props.config}
                chain={chainName1}
                chains={props.config.chains}
                setChain={setChainName1}
                disabledChain={chainName2}
                disabled={transferInProgress}
                from={true}
              />
            </Collapse>
          </SkPaper>
          <Collapse in={showInput()}>
            <SkPaper gray className={cls()}>
              <AmountInput />
            </SkPaper>
          </Collapse>
        </SkPaper>
      </SkPaper>

      <Collapse in={showSwitch()}>
        <SwitchDirection />
      </Collapse>

      <Collapse in={showTo()}>
        <SkPaper background={destBg} className={cmn.nop}>
          <SkPaper background={overlayBg} className={cmn.nop}>
            <div className={cls(cmn.ptop20, cmn.mleft20, cmn.mri20, cmn.flex)}>
              <p className={cls(cmn.nom, cmn.p, cmn.p4, cmn.pSec, cmn.flex, cmn.flexg)}>To</p>
              <DestTokenBalance />
            </div>
            <ChainsList
              config={props.config}
              chain={chainName2}
              chains={props.config.chains}
              destChains={destChains}
              setChain={setChainName2}
              disabledChain={chainName1}
              disabled={transferInProgress}
            />
          </SkPaper>
        </SkPaper>
      </Collapse>
      <AmountErrorMessage />

      <Collapse in={showCP()}>
        <SkPaper gray className={cmn.nop}>
          <CommunityPool />
        </SkPaper>
      </Collapse>

      <Collapse in={showWT(address)}>
        <SkPaper gray className={cmn.nop}>
          <WrappedTokens />
        </SkPaper>
      </Collapse>

      <Collapse in={showTH(address)}>
        <SkPaper className={cmn.nop}>
          <TransactionsHistory />
        </SkPaper>
      </Collapse>

      <Collapse in={!!address}>
        <SFuelWarning />
      </Collapse>
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

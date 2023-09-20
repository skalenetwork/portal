import { useEffect } from 'react';

import Container from '@mui/material/Container';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import GradeRoundedIcon from '@mui/icons-material/GradeRounded';
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

  const token = useMetaportStore((state) => state.token)
  const setToken = useMetaportStore((state) => state.setToken)
  const tokenBalances = useMetaportStore((state) => state.tokenBalances)
  const tokens = useMetaportStore((state) => state.tokens)
  const destChains = useMetaportStore((state) => state.destChains)

  const chainName1 = useMetaportStore((state) => state.chainName1)
  const chainName2 = useMetaportStore((state) => state.chainName2)
  const setChainName1 = useMetaportStore((state) => state.setChainName1)
  const setChainName2 = useMetaportStore((state) => state.setChainName2)

  const appName1 = useMetaportStore((state) => state.appName1)
  const appName2 = useMetaportStore((state) => state.appName2)
  const setAppName1 = useMetaportStore((state) => state.setAppName1)
  const setAppName2 = useMetaportStore((state) => state.setAppName2)

  const transferInProgress = useMetaportStore((state) => state.transferInProgress)
  const mpc = useMetaportStore((state) => state.mpc)

  const amountErrorMessage = useMetaportStore((state) => state.amountErrorMessage)
  const errorMessage = useMetaportStore((state) => state.errorMessage)

  const theme = useUIStore((state) => state.theme)

  const sFuelOk = useSFuelStore((state) => state.sFuelOk)

  const { address } = useWagmiAccount()

  useEffect(() => {
    setChainName1(mpc.config.chains ? mpc.config.chains[0] : '')
    setChainName2(mpc.config.chains ? mpc.config.chains[1] : '')
  }, []);

  useEffect(() => {
    if (tokens && tokens.erc20) {
      setToken(Object.values(tokens.erc20)[0])
    }
  }, [tokens]);


  const showFrom = !expandedTo && !expandedTokens && !errorMessage && !expandedCP
  const showTo = !expandedFrom && !expandedTokens && !errorMessage && !expandedCP && !expandedWT
  const showInput = !expandedFrom && !expandedTo && !errorMessage && !expandedCP && !expandedWT
  const showSwitch = !expandedFrom && !expandedTo && !expandedTokens && !errorMessage && !expandedCP && !expandedWT
  const showStepper =
    !expandedFrom &&
    !expandedTo &&
    !expandedTokens &&
    !errorMessage &&
    !expandedCP &&
    sFuelOk &&
    !expandedWT &&
    !!address
  const showCP =
    !expandedFrom && !expandedTo && !expandedTokens && chainName2 === MAINNET_CHAIN_NAME && !expandedWT
  const showWT = !expandedFrom &&
    !expandedTo &&
    !expandedTokens &&
    !errorMessage &&
    !expandedCP &&
    sFuelOk &&
    !!address
  const showError = !!errorMessage

  const grayBg = 'rgb(136 135 135 / 15%)'
  const sourceBg = theme.vibrant ? chainBg(mpc.config.skaleNetwork, chainName1, appName1) : grayBg
  const destBg = theme.vibrant ? chainBg(mpc.config.skaleNetwork, chainName2, appName2) : grayBg

  return (
    <Container maxWidth="sm">
      <Stack spacing={0}>
        <div className={cls(cmn.flex, cmn.mbott20)}>
          <h2 className={cls(cmn.nom)}>Transfer</h2>
        </div>
        <div>

          <SkPaper gray className={cls(cmn.mbott20)}>
            <div className={cls(cmn.flex, cmn.fullWidth, cmn.flexcv, cmn.mtop10, cmn.mbott10, cmn.mleft10)}>
              <div className={cls(cmn.flex, cmn.flexc, cmn.mri10)}>
                <GradeRoundedIcon color="primary" />
              </div>
              <p className={cls(cmn.p, cmn.p3, cmn.p600, cmn.pPrim, cmn.mri10, cmn.flexg)}>
                Zero Gas Fees between SKALE Chains
              </p>
              <div className={cls(cmn.mri20)}>
                <IconButton
                  className={cls(cmn.paperGrey, cmn.pPrim, cmn.mleft10)}
                >
                  <CloseRoundedIcon className={cls(cmn.pSec)} style={{ height: '16px', width: '16px' }} />
                </IconButton>
              </div>
            </div>
          </SkPaper>

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
                <Collapse in={!!amountErrorMessage || amountErrorMessage === ''}>
                  <div className={cls(cmn.mbott20, cmn.mleft10)}>
                    <AmountErrorMessage />
                  </div>
                </Collapse>

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

        </div>
      </Stack>
    </Container>)
}
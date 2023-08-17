import { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';

// import TransferFrom from '../TransferFrom';
import {
  TransferETF,
  TransferETA,
  SkPaper,
  AmountInput,
  SwitchDirection,
  SkStepper,
  ChainsList,
  TokenList,
  interfaces,
  useCollapseStore,
  useMetaportStore,
  cls,
  common,
  styles,
  AmountErrorMessage,
  TokenBalance,
  DestTokenBalance,
  ErrorMessage
} from '@skalenetwork/metaport';



export default function Main(props: any) {

  // const [tokenOnce, setTokenOnce] = useState<boolean>(false);

  const expandedFrom = useCollapseStore((state) => state.expandedFrom)
  const setExpandedFrom = useCollapseStore((state) => state.setExpandedFrom)

  const expandedTo = useCollapseStore((state) => state.expandedTo)
  const setExpandedTo = useCollapseStore((state) => state.setExpandedTo)

  const expandedTokens = useCollapseStore((state) => state.expandedTokens)

  const token = useMetaportStore((state) => state.token)
  const setToken = useMetaportStore((state) => state.setToken)
  const tokenBalances = useMetaportStore((state) => state.tokenBalances)
  const tokens = useMetaportStore((state) => state.tokens)
  const chainName1 = useMetaportStore((state) => state.chainName1)
  const chainName2 = useMetaportStore((state) => state.chainName2)

  const setChainName1 = useMetaportStore((state) => state.setChainName1)
  const setChainName2 = useMetaportStore((state) => state.setChainName2)

  const transferInProgress = useMetaportStore((state) => state.transferInProgress)
  const mpc = useMetaportStore((state) => state.mpc)

  const amountErrorMessage = useMetaportStore((state) => state.amountErrorMessage)
  const errorMessage = useMetaportStore((state) => state.errorMessage)

  useEffect(() => {
    setChainName1(mpc.config.chains ? mpc.config.chains[0] : '')
    setChainName2(mpc.config.chains ? mpc.config.chains[1] : '')
  }, []);

  useEffect(() => {
    if (tokens && tokens.erc20) {
      setToken(Object.values(tokens.erc20)[0])
    }
  }, [tokens]);


  const showFrom = !expandedTo && !expandedTokens && !errorMessage
  const showTo = !expandedFrom && !expandedTokens && !errorMessage
  const showInput = !expandedFrom && !expandedTo && !errorMessage
  const showSwitch = !expandedFrom && !expandedTo && !expandedTokens && !errorMessage
  const showStepper = !expandedFrom && !expandedTo && !expandedTokens && !errorMessage
  const showError = !!errorMessage;


  return (
    <Container maxWidth="sm">
      <Stack spacing={0}>
        <h2 className={cls(common.noMargTop, common.margBott20)}>Transfer</h2>
        {/* <SkPaper background='transparent'> */}

        <Collapse in={showError}>
          <ErrorMessage errorMessage={errorMessage} />
        </Collapse>


        <SkPaper gray className={common.noPadd}>
          <Collapse in={showFrom}>
            <div className={cls(common.paddTop20, common.margLeft20, common.margRi20, common.flex)}>
              <p className={cls(common.noMarg, common.p, common.p4, common.pSecondary, common.flex, common.flexGrow)}>From</p>
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
              setChain={setChainName1}
              disabledChain={chainName2}
              disabled={transferInProgress}
              from={true}
            />
          </Collapse>

          <Collapse in={showInput}>
            <SkPaper gray className={cls()}>
              <AmountInput />
              <Collapse in={!!amountErrorMessage || amountErrorMessage === ''}>
                <div className={cls(common.margBott20, common.margLeft10)}>
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
          <SkPaper gray className={common.noPadd}>
            <div className={cls(common.paddTop20, common.margLeft20, common.margRi20, common.flex)}>
              <p className={cls(common.noMarg, common.p, common.p4, common.pSecondary, common.flex, common.flexGrow)}>To</p>
              <DestTokenBalance />
            </div>
            <ChainsList
              config={mpc.config}
              expanded={expandedTo}
              setExpanded={setExpandedTo}
              chain={chainName2}
              setChain={setChainName2}
              disabledChain={chainName1}
              disabled={transferInProgress}
            />
          </SkPaper>
        </Collapse>
        <Collapse in={showStepper} className={common.margTop20} >
          <SkStepper skaleNetwork={mpc.config.skaleNetwork} />
        </Collapse>

      </Stack>
    </Container>)
}
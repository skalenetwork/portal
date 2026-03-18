import { useEffect } from 'react'
import { useWalletClient, useSwitchChain, useAccount } from 'wagmi'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { type types, metadata, dc, units, constants } from '@/core'

import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'

import AnimatedLoadingIcon from '../AnimatedLoadingIcon'
import SkPaper from '../SkPaper'

import localStyles from './SkStepper.module.scss'

import ChainIcon from '../ChainIcon'
import AddToken from '../AddToken'

import { useMetaportStore } from '../../store/MetaportStore'
import { BALANCE_UPDATE_INTERVAL_MS } from '../../core/constants'
import { CHAINS_META } from '../../core/metadata'
import { Check, RotateCcw, Send, SendToBack, Coins } from 'lucide-react'

export default function SkStepper(props: { skaleNetwork: types.SkaleNetwork }) {
  const actionIconMap: Record<dc.ActionType, any> = {
    erc20_m2s: <Send size={17} />,
    erc20_s2m: <Send size={17} />,
    erc20_s2s: <Send size={17} />,
    eth_m2s: <Send size={17} />,
    eth_s2m: <Send size={17} />,
    eth_s2s: <Send size={17} />,
    eth_unlock: <Send size={17} />,
    wrap: <SendToBack size={17} />,
    unwrap: <SendToBack size={17} />,
    unwrap_stuck: <SendToBack size={17} />,
    recharge: <Coins size={17} />,
    trails_ext2m: <Send size={17} />,
    trails_ext2s: <Send size={17} />,
    trails_m2ext: <Send size={17} />
  }

  const { address, chainId } = useAccount()
  const { switchChainAsync } = useSwitchChain()
  const addRecentTransaction = useAddRecentTransaction()

  const { data: walletClient } = useWalletClient({ chainId })

  const stepsMetadata = useMetaportStore((state) => state.stepsMetadata)
  const currentStep = useMetaportStore((state) => state.currentStep)
  const amountErrorMessage = useMetaportStore((state) => state.amountErrorMessage)
  const loading = useMetaportStore((state) => state.loading)
  const trailsQuoteError = useMetaportStore((state) => state.trailsQuoteError)
  const btnText = useMetaportStore((state) => state.btnText)
  const check = useMetaportStore((state) => state.check)

  const execute = useMetaportStore((state) => state.execute)
  const startOver = useMetaportStore((state) => state.startOver)

  const token = useMetaportStore((state) => state.token)
  const mpc = useMetaportStore((state) => state.mpc)
  const chainName2 = useMetaportStore((state) => state.chainName2)
  const ima2 = useMetaportStore((state) => state.ima2)

  const chainName1 = useMetaportStore((state) => state.chainName1)
  const transferInProgress = useMetaportStore((state) => state.transferInProgress)

  const amount = useMetaportStore((state) => state.amount)
  const transactionsHistory = useMetaportStore((state) => state.transactionsHistory)
  const cpData = useMetaportStore((state) => state.cpData)

  useEffect(() => {
    try {
      const latestTx = transactionsHistory[transactionsHistory.length - 1]
      if (latestTx) {
        addRecentTransaction({
          hash: latestTx.transactionHash,
          description: latestTx.txName,
          confirmations: 1
        })
      }
    } catch {
      console.error('Failed to add tx to rainbowkit')
    }
  }, [transactionsHistory])

  useEffect(() => {
    if (!address) return
    if (transferInProgress) return
    if (loading) return

    const numericAmount = Number(amount)
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) return

    const refresh = () => {
      check(amount, address, { silent: true })
    }

    const intervalId = setInterval(refresh, BALANCE_UPDATE_INTERVAL_MS)
    return () => clearInterval(intervalId)
  }, [
    address,
    transferInProgress,
    loading,
    currentStep,
    amount,
    token?.keyname,
    chainName1,
    chainName2,
    check
  ])

  if (stepsMetadata.length === 0) return <div></div>

  const currentStepMeta = stepsMetadata[currentStep]
  const rechargeNotReady =
    currentStepMeta?.type === dc.ActionType.recharge && cpData.recommendedRechargeAmount == null
  const rechargeInsufficientBalance =
    currentStepMeta?.type === dc.ActionType.recharge &&
    cpData.recommendedRechargeAmount != null &&
    cpData.accountBalance != null &&
    cpData.accountBalance < units.toWei(String(cpData.recommendedRechargeAmount), constants.DEFAULT_ERC20_DECIMALS)

  const actionDisabled =
    amountErrorMessage || trailsQuoteError || loading || amount == '' || Number(amount) === 0 || rechargeNotReady || rechargeInsufficientBalance

  function stepBtnText(step: dc.StepMetadata): string {
    if (step.type === dc.ActionType.recharge && cpData.recommendedRechargeAmount == null) return 'Loading...'
    return step.btnText
  }

  const chainsMeta = CHAINS_META[props.skaleNetwork]

  if (stepsMetadata && stepsMetadata.length === 1 && currentStep !== stepsMetadata.length) {
    let step = stepsMetadata[0]
    return (
      <div>
        {loading ? (
          <Button
            disabled
            startIcon={<AnimatedLoadingIcon />}
            variant="contained"
            size="medium"
            className="btn-action p-4! w-full capitalize! bg-accent-foreground/50!"
          >
            {btnText}
          </Button>
        ) : (
          <Button
            startIcon={actionIconMap[step.type]}
            variant="contained"
            size="medium"
            className={`
            btn-action w-full normal-case! p-4!



            bg-accent-foreground! text-accent! disabled:bg-accent-foreground/50!
            
            ease-in-out transition-transform duration-150 active:scale-[0.97]`}
            onClick={() => execute(address, switchChainAsync, walletClient)}
            disabled={!!actionDisabled}
          >
            {Number(amount) === 0 ? 'Enter an amount' : stepBtnText(step)}
          </Button>
        )}
      </div>
    )
  }

  return (
    <Collapse in={stepsMetadata && stepsMetadata.length !== 0}>
      <Box>
        <Collapse in={currentStep !== stepsMetadata.length}>
          <Stepper className={localStyles.stepper} activeStep={currentStep} orientation="vertical">
            {stepsMetadata.map((step, i) => (
              <Step key={i}>
                <StepLabel
                  className={localStyles.labelStep}
                  style={i !== currentStep ? { filter: 'opacity(0.5) saturate(0)' } : undefined}
                >
                  <div className="flex items-center ml-1">
                    <div className="flex items-center">
                      <h4 className="m-0 flex text-foreground">{step.headline}</h4>
                      <div className="ml-1.5 mr-1.5 flex">
                        <ChainIcon
                          skaleNetwork={props.skaleNetwork}
                          chainName={step.onSource ? step.from : step.to}
                          size="xs"
                          chainsMeta={chainsMeta}
                        />
                      </div>
                      <h4 className="m-0 flex text-foreground">
                        {metadata.getAlias(
                          props.skaleNetwork,
                          chainsMeta,
                          step.onSource ? step.from : step.to
                        )}
                      </h4>
                    </div>
                  </div>
                </StepLabel>
                <StepContent className="">
                  <Box className="my-2!">
                    {step.type === dc.ActionType.recharge && (
                      <p className="text-xs font-medium text-muted-foreground -mt-2 mb-2 ml-1">
                        ETH deposit to cover gas for delivering your transfer on destination
                        network.
                      </p>
                    )}
                    <div className="mt-2.5">
                      {loading ? (
                        <Button
                          disabled
                          startIcon={<AnimatedLoadingIcon />}
                          variant="contained"
                          size="medium"
                          className="btn-action mt-1.5 p-3.5! w-full capitalize! bg-accent-foreground/50!"
                        >
                          {btnText}
                        </Button>
                      ) : (
                        <Button
                          startIcon={actionIconMap[step.type]}
                          variant="contained"
                          size="medium"
                          className={`
                            btn-action mt-1.5 w-full capitalize! text-accent! p-3.5!
                            bg-accent-foreground! disabled:bg-accent-foreground/50!
                            ease-in-out transition-transform duration-150 active:scale-[0.97]`}
                          onClick={() => execute(address, switchChainAsync, walletClient)}
                          disabled={!!actionDisabled}
                        >
                          {amount === '' || Number(amount) === 0
                            ? 'Enter an amount'
                            : stepBtnText(step)}
                        </Button>
                      )}
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Collapse>

        {currentStep === stepsMetadata.length && (
          <SkPaper gray className="p-6!">
            <div className="flex items-center">
              <span className="flex items-center justify-center w-[35px] h-[35px] rounded-full bg-emerald-100 dark:bg-emerald-400/15 shrink-0">
                <Check size={14} className="text-emerald-500 dark:text-emerald-400" />
              </span>
              <span className="ml-3.5 grow">
                <div>
                  <p className="text-sm capitalize text-foreground font-medium m-0">Completed</p>
                  <p className="text-xs text-secondary-foreground m-0">Tokens received</p>
                </div>
              </span>
              <div className="flex items-center gap-2">
                <AddToken
                  token={token}
                  destChainName={chainName2}
                  mpc={mpc}
                  provider={ima2.provider}
                  iconOnly
                />
                <span>
                  <IconButton
                    onClick={startOver}
                    className="md:hidden! text-accent! bg-accent-foreground! p-2!"
                  >
                    <RotateCcw size={20} />
                  </IconButton>
                  <Button
                    onClick={startOver}
                    size="small"
                    startIcon={<RotateCcw size={15} />}
                    className="hidden! md:inline-flex! capitalize! text-accent! bg-accent-foreground! disabled:bg-accent-foreground/50! text-xs! px-3.5! py-2.5!"
                  >
                    Start over
                  </Button>
                </span>
              </div>
            </div>
          </SkPaper>
        )}
      </Box>
    </Collapse>
  )
}

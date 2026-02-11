import { useEffect, useState } from 'react'
import { useWalletClient, useSwitchChain, useAccount } from 'wagmi'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { type types, metadata, helper, constants, dc } from '@/core'

import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'

import AnimatedLoadingIcon from '../AnimatedLoadingIcon'

import localStyles from './SkStepper.module.scss'

import ChainIcon from '../ChainIcon'
import AddToken from '../AddToken'

import { useMetaportStore } from '../../store/MetaportStore'
import { useCPStore } from '../../store/CommunityPoolStore'
import { SUCCESS_EMOJIS } from '../../core/constants'
import { CHAINS_META } from '../../core/metadata'
import { RotateCcw, Send, SendToBack } from 'lucide-react'

//

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
    unwrap_stuck: <SendToBack size={17} />
  }

  const { address, chainId } = useAccount()
  const { switchChainAsync } = useSwitchChain()
  const addRecentTransaction = useAddRecentTransaction()

  const { data: walletClient } = useWalletClient({ chainId })

  const stepsMetadata = useMetaportStore((state) => state.stepsMetadata)
  const currentStep = useMetaportStore((state) => state.currentStep)
  const amountErrorMessage = useMetaportStore((state) => state.amountErrorMessage)
  const loading = useMetaportStore((state) => state.loading)
  const btnText = useMetaportStore((state) => state.btnText)

  const execute = useMetaportStore((state) => state.execute)
  const startOver = useMetaportStore((state) => state.startOver)

  const token = useMetaportStore((state) => state.token)
  const mpc = useMetaportStore((state) => state.mpc)
  const chainName2 = useMetaportStore((state) => state.chainName2)
  const ima2 = useMetaportStore((state) => state.ima2)

  const amount = useMetaportStore((state) => state.amount)
  const transactionsHistory = useMetaportStore((state) => state.transactionsHistory)

  const cpData = useCPStore((state) => state.cpData)

  const [emoji, setEmoji] = useState<string>()
  useEffect(() => {
    setEmoji(helper.getRandom(SUCCESS_EMOJIS))
  }, [])

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

  if (stepsMetadata.length === 0) return <div></div>

  const exisGasOk = cpData.exitGasOk || chainName2 !== constants.MAINNET_CHAIN_NAME
  const actionDisabled =
    amountErrorMessage ||
    loading ||
    amount == '' ||
    Number(amount) === 0 ||
    (!exisGasOk && currentStep === 0)

  const chainsMeta = CHAINS_META[props.skaleNetwork]

  if (stepsMetadata && stepsMetadata.length === 1 && currentStep !== stepsMetadata.length) {
    let step = stepsMetadata[0]
    return (<div>
      {loading ? (
        <Button
          disabled
          startIcon={<AnimatedLoadingIcon />}
          variant="contained"
          size="medium"
          className="btn-action p-4! w-full capitalize! bg-muted-foreground/30!"
        >
          {btnText}
        </Button>
      ) : (
        <Button
          startIcon={actionIconMap[step.type]}
          variant="contained"
          size="medium"
          className={`
            btn-action w-full normal-case! text-accent! p-4!
            ${actionDisabled ? 'bg-muted-foreground/30! dark:bg-muted-foreground/10! text-muted! pointer-events-none' : 'bg-accent-foreground!'}
            ease-in-out transition-transform duration-150 active:scale-[0.97]`}
          onClick={() => execute(address, switchChainAsync, walletClient)}
          disabled={!!actionDisabled}
        >
          {Number(amount) === 0 ? 'Enter an amount' : step.btnText}
        </Button>
      )}
    </div>)
  }

  return (
    <Collapse in={stepsMetadata && stepsMetadata.length !== 0}>
      <Box>
        <Collapse in={currentStep !== stepsMetadata.length}>
          <Stepper className={localStyles.stepper} activeStep={currentStep} orientation="vertical" >
            {stepsMetadata.map((step, i) => (
              <Step key={i} >
                <StepLabel className={localStyles.labelStep}>
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
                        {metadata.getAlias(props.skaleNetwork, chainsMeta, step.onSource ? step.from : step.to)}
                      </h4>
                    </div>
                  </div>
                </StepLabel>
                <StepContent className="">
                  <Box className='my-2!'>
                    <div className="mt-2.5">
                      {loading ? (
                        <Button
                          disabled
                          startIcon={<AnimatedLoadingIcon />}
                          variant="contained"
                          size="medium"
                          className="btn-action mt-1.5 p-3.5! w-full capitalize! bg-accent-foreground/30!"
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
                            ${actionDisabled ? 'bg-muted-foreground/30! text-muted! pointer-events-none' : 'bg-accent-foreground!'}
                            ease-in-out transition-transform duration-150 active:scale-[0.97]`}
                          onClick={() => execute(address, switchChainAsync, walletClient)}
                          disabled={!!actionDisabled}
                        >
                          {step.btnText}
                        </Button>
                      )}
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Collapse>

        {
          currentStep === stepsMetadata.length && (
            <div>
              <div className="block">
                <p
                  className="text-base font-semibold text-foreground grow text-center mt-5"
                >
                  {emoji} Transfer completed
                </p>
                <p
                  className="text-sm font-semibold text-secondary-foreground grow text-center mt-1.5"
                >
                  Transfer details are available in History section
                </p>
              </div>
              <div className="flex flex-col md:flex-row mt-5">
                <AddToken
                  token={token}
                  destChainName={chainName2}
                  mpc={mpc}
                  provider={ima2.provider}
                />
                <Button
                  onClick={startOver}
                  color="primary"
                  size="medium"
                  className="grow w-full! md:w-fit! capitalize! text-accent! bg-foreground! disabled:bg-foreground/50! text-xs! px-6! py-4! ease-in-out transition-transform duration-150 active:scale-[0.97]"
                  startIcon={<RotateCcw size={17} />}
                >
                  Start over
                </Button>
              </div>
            </div >
          )
        }
      </Box >
    </Collapse >
  )
}

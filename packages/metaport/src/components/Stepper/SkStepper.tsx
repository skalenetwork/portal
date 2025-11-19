import { useEffect, useState } from 'react'
import { useWalletClient, useSwitchChain, useAccount } from 'wagmi'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { type types, metadata, helper, constants } from '@/core'

import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'

import SettingsBackupRestoreRoundedIcon from '@mui/icons-material/SettingsBackupRestoreRounded'
import AnimatedLoadingIcon from '../AnimatedLoadingIcon'

import localStyles from './SkStepper.module.scss'

import ChainIcon from '../ChainIcon'
import AddToken from '../AddToken'

import { useMetaportStore } from '../../store/MetaportStore'
import { useCPStore } from '../../store/CommunityPoolStore'
import { SUCCESS_EMOJIS } from '../../core/constants'
import { CHAINS_META } from '../../core/metadata'

export default function SkStepper(props: { skaleNetwork: types.SkaleNetwork }) {
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

  return (
    <Collapse in={stepsMetadata && stepsMetadata.length !== 0}>
      <Box className="">
        <Collapse in={currentStep !== stepsMetadata.length}>
          <Stepper className={localStyles.stepper} activeStep={currentStep} orientation="vertical">
            {stepsMetadata.map((step, i) => (
              <Step key={i}>
                <StepLabel className={localStyles.labelStep}>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <h4 className="m-0 flex">{step.headline}</h4>
                      <div className="ml-1.5 mr-1.5 flex">
                        <ChainIcon
                          skaleNetwork={props.skaleNetwork}
                          chainName={step.onSource ? step.from : step.to}
                          size="xs"
                          chainsMeta={chainsMeta}
                        />
                      </div>
                      <h4 className="m-0 flex">
                        {metadata.getAlias(props.skaleNetwork, chainsMeta, step.onSource ? step.from : step.to)}
                      </h4>
                    </div>
                  </div>
                </StepLabel>
                <StepContent className="mt-2.5">
                  <Box sx={{ mb: 2 }}>
                    <p className="flex text-secondary-foreground/60 text-xs flex-grow">{step.text}</p>
                    <div className="mt-2.5">
                      {loading ? (
                        <Button
                          disabled
                          startIcon={<AnimatedLoadingIcon />}
                          variant="contained"
                          color="primary"
                          size="medium"
                          className="btn-action mt-1.5"
                        >
                          {btnText}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          size="medium"
                          className="btn-action mt-1.5"
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
                  className="text-base font-semibold text-primary flex-grow text-center mt-5"
                >
                  {emoji} Transfer completed
                </p>
                <p
                  className="text-sm font-semibold text-secondary-foreground/60 flex-grow text-center mt-1.5"
                >
                  Transfer details are available in History section
                </p>
              </div>
              <div className="flex mt-5">
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
                  className="styles.btnAction"
                  startIcon={<SettingsBackupRestoreRoundedIcon />}
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

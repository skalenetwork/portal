import { useRef } from 'react'

import IconButton from '@mui/material/IconButton'
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded'
import { cls, cmn, styles } from '../core/css'

import { useUIStore } from '../store/Store'
import { useMetaportStore } from '../store/MetaportStore'

export default function SwitchDirection() {
  const myElement = useRef<HTMLDivElement | null>(null)

  const metaportTheme = useUIStore((state) => state.theme)

  const chainName1 = useMetaportStore((state) => state.chainName1)
  const chainName2 = useMetaportStore((state) => state.chainName2)
  const setChainName1 = useMetaportStore((state) => state.setChainName1)
  const setChainName2 = useMetaportStore((state) => state.setChainName2)

  const appName1 = useMetaportStore((state) => state.appName1)
  const appName2 = useMetaportStore((state) => state.appName2)
  const setAppName1 = useMetaportStore((state) => state.setAppName1)
  const setAppName2 = useMetaportStore((state) => state.setAppName2)

  const token = useMetaportStore((state) => state.token)

  const startOver = useMetaportStore((state) => state.startOver)
  const loading = useMetaportStore((state) => state.loading)
  const transferInProgress = useMetaportStore((state) => state.transferInProgress)

  async function doSwitch() {
    const element = myElement.current
    const rotate = () => {
      if (element) {
        element.classList.add('spin')
        setTimeout(() => {
          element.classList.remove('spin')
        }, 400)
      }
    }
    rotate()
    const chain1 = chainName1
    const app1 = appName1
    await setChainName1(chainName2)
    setAppName1(appName2)
    await setChainName2(chain1, token)
    setAppName2(app1)
    startOver()
  }

  return (
    <div className={cls(styles.sk__btnSwitch, cmn.flex)}>
      <div className={cls(cmn.flex, cmn.flexg)}></div>
      <div
        className={cls(cmn.flex, styles.btnSwitchAnimation)}
        ref={myElement}
        style={{
          background: metaportTheme.background,
          borderRadius: '50%',
          zIndex: metaportTheme.zIndex
        }}
      >
        <IconButton
          size="medium"
          color="primary"
          style={{
            backgroundColor: metaportTheme.primary,
            borderColor: metaportTheme.background,
            zIndex: metaportTheme.zIndex
          }}
          disabled={loading || transferInProgress}
          onClick={doSwitch}
        >
          <ArrowDownwardRoundedIcon />
        </IconButton>
      </div>
      <div className={cls(cmn.flex, cmn.flexg)}></div>
    </div>
  )
}

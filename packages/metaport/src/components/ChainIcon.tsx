import { metadata, types } from '@/core'
import OfflineBoltRoundedIcon from '@mui/icons-material/OfflineBoltRounded'
import { useThemeMode } from './ThemeProvider'
import { chainIconPath, CHAINS_META } from '../core/metadata'

import { styles } from '../core/css'

export default function ChainIcon(props: {
  skaleNetwork: types.SkaleNetwork
  chainName: string
  bg?: boolean
  chainsMeta?: types.ChainsMetadataMap,
  className?: string
  app?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}) {
  const { mode } = useThemeMode()
  const iconPath = chainIconPath(props.skaleNetwork, props.chainName, props.app)
  const size = props.size ?? 'sm'
  const className = styles.chainIcon + ' ' + styles[`chainIcon${size}`]
  const bg = props.bg ?? true
  let chainsMeta = props.chainsMeta
  if (props.chainsMeta === undefined) {
    chainsMeta = CHAINS_META[props.skaleNetwork]
  }
  if (iconPath !== undefined) {
    return (
      <div
        className={'logo-wrapper ' + styles.chainIconBg + ' ' + [styles[`chainIconBg${size}`], bg].join(' ') + ' ' + props.className}
        style={bg ? { background: metadata.chainBg(props.skaleNetwork, chainsMeta, props.chainName, props.app, mode) } : undefined}
      >
        <img className={className} src={iconPath.default ?? iconPath} /></div>)
  }
  return <OfflineBoltRoundedIcon className={styles.defaultChainIcon + ' text-primary ' + className} />
}

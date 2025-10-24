import { types } from '@/core'
import OfflineBoltRoundedIcon from '@mui/icons-material/OfflineBoltRounded'
import { chainIconPath } from '../core/metadata'

import { styles } from '../core/css'

export default function ChainIcon(props: {
  skaleNetwork: types.SkaleNetwork
  chainName: string
  className?: string
  app?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}) {
  const iconPath = chainIconPath(props.skaleNetwork, props.chainName, props.app)
  const size = props.size ?? 'sm'
  const className = styles[`chainIcon${size}`] + ' ' + props.className
  if (iconPath !== undefined) {
    return <img className={className} src={iconPath.default ?? iconPath} />
  }
  return <OfflineBoltRoundedIcon className="styles.defaultChainIcon, 'text-white', className" />
}

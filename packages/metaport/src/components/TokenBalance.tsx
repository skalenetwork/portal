import { cls, cmn } from '../core/css'
import { formatBalance, truncateDecimals } from '../core/convertation'

export default function TokenBalance(props: {
  balance: bigint
  symbol: string
  decimals?: string
  truncate?: number
  primary?: boolean
  size?: 'xs' | 'sm'
}) {
  if (props.balance === undefined || props.balance === null) return
  let balance = formatBalance(props.balance, props.decimals)
  if (props.truncate) {
    balance = truncateDecimals(balance, props.truncate)
  }
  let size = props.size ?? 'xs'
  return (
    <div className={cls(cmn.flex, cmn.flexcv)}>
      <p
        className={cls(
          cmn.p,
          [cmn.p4, size === 'xs'],
          [cmn.p3, size === 'sm'],
          [cmn.pSec, !props.primary],
          [cmn.pPrim, props.primary],
          cmn.flex,
          cmn.flexcv,
          cmn.mri5
        )}
      >
        {balance} {props.symbol}
      </p>
    </div>
  )
}

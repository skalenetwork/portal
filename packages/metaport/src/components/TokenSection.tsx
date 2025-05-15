import Button from '@mui/material/Button'
import { cls, cmn } from '../core/css'
import TokenBalance from './TokenBalance'
import TokenIcon from './TokenIcon'
import { getTokenName } from '../core/metadata'

interface TokenSectionProps {
  text: string
  icon: React.ReactNode
  tokens: Array<{ key: string; tokenData: any; balance: bigint | null }>
  onTokenClick: (tokenData: any) => void
}

export default function TokenSection({ text, icon, tokens, onTokenClick }: TokenSectionProps) {
  return (
    <div className={cls(cmn.mtop20)}>
      <div className={cls(cmn.flex, cmn.flexcv, cmn.flexg, cmn.pSec, cmn.mleft10, cmn.mbott5)}>
        <div className={cls(cmn.flexcv, cmn.flex, cmn.mri10)}>{icon}</div>
        <p className={cls(cmn.p, cmn.p3, cmn.p600, cmn.flexg, cmn.cap)}>{text}</p>
      </div>
      {tokens
        .sort((a, b) => a.key.localeCompare(b.key))
        .map(({ key, tokenData, balance }) => (
          <Button
            key={key}
            color="secondary"
            size="small"
            className={cls(cmn.fullWidth, cmn.pleft10, cmn.ptop5, cmn.pbott5)}
            onClick={() => onTokenClick(tokenData)}
          >
            <div
              className={cls(
                cmn.flex,
                cmn.flexcv,
                cmn.fullWidth,
                cmn.mtop10,
                cmn.mbott10,
                cmn.bordRad
              )}
            >
              <div className={cls(cmn.flex, cmn.flexc)}>
                <TokenIcon tokenSymbol={tokenData?.meta.symbol} iconUrl={tokenData?.meta.iconUrl} />
              </div>
              <div className={cls(cmn.flexg)}>
                <p
                  className={cls(
                    cmn.p,
                    cmn.p3,
                    cmn.p600,
                    cmn.pPrim,
                    cmn.flex,
                    cmn.mri10,
                    cmn.mleft10
                  )}
                >
                  {getTokenName(tokenData)}
                </p>
                {tokenData.address ? (
                  <p className={cls(cmn.p, cmn.p4, cmn.pSec, cmn.p500, cmn.flex, cmn.mleft10)}>
                    {tokenData.address.substring(0, 5) +
                      '...' +
                      tokenData.address.substring(tokenData.address.length - 3)}
                  </p>
                ) : (
                  <p className={cls(cmn.p, cmn.p4, cmn.pSec, cmn.p500, cmn.flex, cmn.mleft10)}>
                    Ethereum
                  </p>
                )}
              </div>
              <div className={cmn.mri10}>
                <TokenBalance
                  balance={balance}
                  symbol={tokenData?.meta.symbol}
                  decimals={tokenData?.meta.decimals}
                  truncate={4}
                  size="sm"
                  primary
                />
              </div>
            </div>
          </Button>
        ))}
    </div>
  )
}

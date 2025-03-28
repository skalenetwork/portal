import Collapse from '@mui/material/Collapse'

import { cls, cmn } from '../core/css'

import { useMetaportStore } from '../store/MetaportStore'

export default function AmountErrorMessage() {
  const amountErrorMessage = useMetaportStore((state) => state.amountErrorMessage)
  return (
    <Collapse in={!!amountErrorMessage || amountErrorMessage === ''}>
      <p
        className={cls(
          cmn.flex,
          cmn.p3,
          cmn.p,
          cmn.pSec,
          cmn.errorMessage,
          cmn.flexg,
          cmn.mtop10,
          cmn.mleft10
        )}
      >
        🔴 {amountErrorMessage}
      </p>
    </Collapse>
  )
}

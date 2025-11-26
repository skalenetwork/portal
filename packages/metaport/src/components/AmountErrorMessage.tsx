import Collapse from '@mui/material/Collapse'

import { useMetaportStore } from '../store/MetaportStore'

export default function AmountErrorMessage() {
  const amountErrorMessage = useMetaportStore((state) => state.amountErrorMessage)
  return (
    <Collapse in={!!amountErrorMessage || amountErrorMessage === ''}>
      <p
        className="flex grow m-3 text-xs text-secondary-foreground font-semibold"
      >
        🔴 {amountErrorMessage}
      </p>
    </Collapse>
  )
}

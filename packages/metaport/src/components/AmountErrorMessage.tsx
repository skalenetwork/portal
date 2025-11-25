import Collapse from '@mui/material/Collapse'

import { useMetaportStore } from '../store/MetaportStore'

export default function AmountErrorMessage() {
  const amountErrorMessage = useMetaportStore((state) => state.amountErrorMessage)
  return (
    <Collapse in={!!amountErrorMessage || amountErrorMessage === ''}>
      <p
        className="flex grow mt-2.5 ml-2.5 text-sm text-gray-400 text-red-400"
      >
        🔴 {amountErrorMessage}
      </p>
    </Collapse>
  )
}

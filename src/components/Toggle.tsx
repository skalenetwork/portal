import { useState } from 'react'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

export default function ToggleButtons() {
  const [alignment, setAlignment] = useState<string | null>('left')

  const handleAlignment = (_: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
    setAlignment(newAlignment)
  }

  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
      style={{ width: '100%' }}
    >
      <ToggleButton value="left" aria-label="left aligned">
        1
      </ToggleButton>
      <ToggleButton value="center" aria-label="centered">
        2
      </ToggleButton>
      <ToggleButton value="right" aria-label="right aligned">
        3
      </ToggleButton>
      <ToggleButton value="justify" aria-label="justified" disabled>
        4
      </ToggleButton>
      <ToggleButton value="justify" aria-label="justified" disabled>
        5
      </ToggleButton>
      <ToggleButton value="justify" aria-label="justified" disabled>
        6
      </ToggleButton>
      <ToggleButton value="justify" aria-label="justified" disabled>
        7
      </ToggleButton>
      <ToggleButton value="justify" aria-label="justified" disabled>
        8
      </ToggleButton>
      <ToggleButton value="justify" aria-label="justified" disabled>
        9
      </ToggleButton>
      <ToggleButton value="justify" aria-label="justified" disabled>
        10
      </ToggleButton>
      <ToggleButton value="justify" aria-label="justified" disabled>
        11
      </ToggleButton>
      <ToggleButton value="justify" aria-label="justified" disabled>
        12
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

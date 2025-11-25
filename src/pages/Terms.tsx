import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'

import TermsOfService from '../data/terms-of-service.mdx'

export default function Terms() {
  return (
    <Container maxWidth="md" className="textPage">
      <Stack spacing={0}>
        <div className="flex">
          <h2 className="m-0 text-2xl font-bold text-foreground">Terms of Service</h2>
        </div>
        <p className="text-sm text-gray-400">SKALE Network Blockchain Bridge Terms of Service</p>
        <TermsOfService />
      </Stack>
    </Container>
  )
}

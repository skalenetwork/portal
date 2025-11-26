import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'

import TermsOfService from '../data/terms-of-service.mdx'
import { SkPaper } from '@skalenetwork/metaport'

export default function Terms() {
  return (
    <Container maxWidth="md" className="textPage">
      <Stack spacing={0}>
        <h2 className="m-0 text-xl font-bold text-foreground">Terms of Service</h2>
        <p className="text-xs text-secondary-foreground font-semibold">
          SKALE Network Blockchain Bridge Terms of Service
        </p>
        <SkPaper gray className="p-6! pt-2! mt-4 text-foreground! tosMd">
          <TermsOfService />
        </SkPaper>

      </Stack>
    </Container>
  )
}

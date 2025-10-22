import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'

import { cmn, cls } from '@skalenetwork/metaport'

import TermsOfService from '../data/terms-of-service.mdx'

export default function Terms() {
  return (
    <Container maxWidth="md" className="textPage">
      <Stack spacing={0}>
        <div className="flex">
          <h2 className={cls(cmn.nom)}>Terms of Service</h2>
        </div>
        <p className={cls("text-sm", cmn.pSec)}>
          SKALE Network Blockchain Bridge Terms of Service
        </p>
        <TermsOfService />
      </Stack>
    </Container>
  )
}

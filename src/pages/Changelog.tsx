import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Changelog from '../data/changelog.mdx'
import { cmn, cls, SkPaper } from '@skalenetwork/metaport'

export default function ChangelogPage() {
  return (
    <Container maxWidth="md">
      <Stack spacing={0}>
        <div className={cls(cmn.flex)}>
          <h2 className={cls(cmn.nom)}>Changelog</h2>
        </div>
        <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec)}>Gateway to the SKALE Ecosystem</p>
        <SkPaper gray className={cls('markdown', cmn.mtop20)}>
          <div className={cls(cmn.mleft10, cmn.mri10)}>
            <Changelog />
          </div>
        </SkPaper>
      </Stack>
    </Container>
  )
}

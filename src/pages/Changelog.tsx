import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Changelog from '../data/changelog.mdx'
import { cls, SkPaper } from '@skalenetwork/metaport'

export default function ChangelogPage() {
  return (
    <Container maxWidth="md">
      <Stack spacing={0}>
        <div className="flex">
          <h2 className="m-0">Changelog</h2>
        </div>
        <p className="text-sm text-sec">
          Stay informed with our latest updates
        </p>
        <SkPaper gray className={cls('markdown', 'mt-5')}>
          <div className="ml-2.5 mr-2.5">
            <Changelog />
          </div>
        </SkPaper>
      </Stack>
    </Container>
  )
}

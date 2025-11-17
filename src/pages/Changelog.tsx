import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Changelog from '../data/changelog.mdx'
import { SkPaper } from '@skalenetwork/metaport'

export default function ChangelogPage() {
  return (
    <Container maxWidth="md">
      <Stack spacing={0}>
        <div className="flex">
          <h2 className="m-0 text-2xl font-bold">Changelog</h2>
        </div>
        <p className="text-sm text-secondary-foreground/60">
          Stay informed with our latest updates
        </p>
        <SkPaper gray className="markdown mt-5">
          <div className="ml-2.5 mr-2.5">
            <Changelog />
          </div>
        </SkPaper>
      </Stack>
    </Container>
  )
}

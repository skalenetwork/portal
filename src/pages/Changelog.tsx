import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Changelog from '../data/changelog.mdx'
import { SkPaper } from '@/bridge'

export default function ChangelogPage() {
  return (
    <Container maxWidth="md">
      <Stack spacing={0}>
        <div className="flex">
          <h2 className="m-0 text-xl font-bold text-foreground">Changelog</h2>
        </div>
        <p className="text-xs text-muted-foreground font-semibold">
          Stay informed with our latest updates
        </p>
        <SkPaper gray className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold mt-5">
          <div className="ml-2.5 mr-2.5 text-foreground">
            <Changelog />
          </div>
        </SkPaper>
      </Stack>
    </Container>
  )
}

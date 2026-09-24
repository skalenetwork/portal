import { Glob } from 'bun'

const RULES = {
  arbitraryType: { glob: 'src/**/*.tsx', re: /\b(?:text|leading|tracking)-\[[^\]]+\]/g },
  arbitraryRadius: { glob: 'src/**/*.tsx', re: /\brounded-\[[^\]]+\]/g },
  arbitrarySpacing: { glob: 'src/**/*.tsx', re: /\b[pm][xytblr]?-\[[^\]]+\]|\bgap-\[[^\]]+\]/g },
  rawColor: { glob: 'src/**/*.tsx', re: /#[0-9a-fA-F]{3,8}\b|\brgba?\(/g },
  important: { glob: 'src/**/*.scss', re: /!important/g }
} as const

const counts: Record<string, number> = {}
for (const [name, { glob, re }] of Object.entries(RULES)) {
  let n = 0
  for await (const file of new Glob(glob).scan('.')) {
    if (file.includes('/meta/') || file.includes('metaportConfig')) continue
    n += (await Bun.file(file).text()).match(re)?.length ?? 0
  }
  counts[name] = n
}

const path = 'scripts/style-baseline.json'
const baseline = (await Bun.file(path).exists()) ? await Bun.file(path).json() : null

if (!baseline) {
  await Bun.write(path, JSON.stringify(counts, null, 2) + '\n')
  console.log('baseline written', counts)
  process.exit(0)
}

let failed = false
for (const [name, n] of Object.entries(counts)) {
  const max = baseline[name] ?? 0
  const mark = n > max ? 'FAIL' : n < max ? 'DROP' : ' ok '
  if (n > max) failed = true
  console.log(`[${mark}] ${name.padEnd(18)} ${n} (baseline ${max})`)
}
if (failed) {
  console.error('\nNew design-system violations. Use tokens and the type/spacing scales.')
  process.exit(1)
}

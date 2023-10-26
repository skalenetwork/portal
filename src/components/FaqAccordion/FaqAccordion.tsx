/**
 * @license
 * SKALE bridge-ui
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @file FaqAccordion.tsx
 * @copyright SKALE Labs 2023-Present
 */

import * as React from 'react'
import { cls, cmn, SkPaper } from '@skalenetwork/metaport'

import AccordionSection from '../AccordionSection'
import { FAQ } from '../../core/constants'

export default function FaqAccordion() {
  const [expanded, setExpanded] = React.useState<string | false>(false)

  function handleChange(panel: string | false) {
    setExpanded(expanded && panel === expanded ? false : panel)
  }

  return (
    <SkPaper gray className={cls(cmn.mtop20, cmn.mbott20)}>
      {FAQ.map((question: any, index: number) => (
        <AccordionSection
          handleChange={handleChange}
          expanded={expanded}
          panel={`panel${index}`}
          title={question.question}
        >
          <p className={cls(cmn.p, cmn.p2, cmn.pSec, cmn.mleft10, cmn.mri10)}>{question.answer}</p>
        </AccordionSection>
      ))}
    </SkPaper>
  )
}

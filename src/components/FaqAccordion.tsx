/**
 * @license
 * SKALE portal
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

import { useState } from 'react'
import { SkPaper } from '@skalenetwork/metaport'

import AccordionSection from './AccordionSection'
import { FAQ } from '../core/constants'

export default function FaqAccordion() {
  const [expanded, setExpanded] = useState<string | false>(false)

  function handleChange(panel: string | false) {
    setExpanded(expanded && panel === expanded ? false : panel)
  }

  return (
    <SkPaper gray className="mt-5 mb-5">
      {FAQ.map((question: any, index: number) => (
        <AccordionSection
          handleChange={handleChange}
          expanded={expanded}
          panel={`panel${index}`}
          title={question.question}
        >
          <p className="text-base text-secondary-foreground ml-2.5 mr-2.5">{question.answer}</p>
        </AccordionSection>
      ))}
    </SkPaper>
  )
}

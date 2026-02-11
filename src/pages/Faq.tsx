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
 * @file Faq.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { Helmet } from 'react-helmet'

import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'

import FaqAccordion from '../components/FaqAccordion'
import { META_TAGS } from '../core/meta'

export default function Faq() {
  return (
    <Container maxWidth="md">
      <Helmet>
        <title>{META_TAGS.faq.title}</title>
        <meta name="description" content={META_TAGS.faq.description} />
        <meta property="og:title" content={META_TAGS.faq.title} />
        <meta property="og:description" content={META_TAGS.faq.description} />
      </Helmet>
      <Stack spacing={0}>
        <div className="flex">
          <h2 className="m-0 text-xl font-bold text-foreground">FAQ</h2>
        </div>
        <p className="text-xs text-secondary-foreground font-semibold">
          Common questions about SKALE Bridge
        </p>
        <FaqAccordion />
      </Stack>
    </Container>
  )
}

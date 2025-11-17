/**
 * @license
 * SKALE portal
 *
 * This pr            <h2 className="m-0 text-3xl font-bold">Stats</h2>
            <p className="text-sm text-secondary-foreground/60">SKALE Network statistics</p>ram is free software: you can redistribute it and/or modify
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
 * @file Stats.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { Helmet } from 'react-helmet'

import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'


import { DASHBOARD_URL } from '../core/constants'
import { META_TAGS } from '../core/meta'
import SkPageInfoIcon from '../components/SkPageInfoIcon'

export default function Stats() {
  return (
    <Container maxWidth="lg">
      <Helmet>
        <title>{META_TAGS.stats.title}</title>
        <meta name="description" content={META_TAGS.stats.description} />
        <meta property="og:title" content={META_TAGS.stats.title} />
        <meta property="og:description" content={META_TAGS.stats.description} />
      </Helmet>
      <Stack spacing={0}>
        <div className="flex items-center">
          <div className="flex-grow" style={{ zIndex: '2' }}>
            <h2 className="m-0 text-2xl font-bold">Stats</h2>
            <p className="text-sm text-secondary-foreground/60">SKALE Network statistics</p>
          </div>
          <SkPageInfoIcon meta_tag={META_TAGS.stats} />
        </div>

        <iframe
          style={{
            height: 'calc(100vh - 170px)',
            border: 'none',
            margin: '-15px -15px',
            zIndex: '1'
          }}
          src={DASHBOARD_URL}
        ></iframe>
      </Stack>
    </Container>
  )
}

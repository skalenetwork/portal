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
 * @file MetricsWarning.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { cmn, cls } from '@skalenetwork/metaport'
import { type types } from '@/core'
import { Container } from '@mui/material'
import RestoreRoundedIcon from '@mui/icons-material/RestoreRounded'

import Message from './Message'

import { timestampToDate } from '../core/helper'

const FOUR_HOURS_IN_SECONDS = 4 * 60 * 60

export default function MetricsWarning(props: { metrics: types.IMetrics | null }) {
  if (!props.metrics || Date.now() / 1000 - props.metrics.last_updated < FOUR_HOURS_IN_SECONDS)
    return
  return (
    <Container maxWidth="md">
      <Message
        className={cls(cmn.mbott20)}
        icon={<RestoreRoundedIcon />}
        text={`Apps metrics may be outdated. Last updated: ${timestampToDate(
          props.metrics.last_updated,
          true
        )}`}
        type="warning"
      />
    </Container>
  )
}

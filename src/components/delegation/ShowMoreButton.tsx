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
 * @file ShowMoreButton.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { Button } from '@mui/material'
import { cls, cmn } from '@skalenetwork/metaport'
import ExpandCircleDownRoundedIcon from '@mui/icons-material/ExpandCircleDownRounded'

interface ShowMoreButtonProps {
  onClick: () => void
  remainingItems: number
  loading?: boolean
  className?: string
}

const ShowMoreButton: React.FC<ShowMoreButtonProps> = ({
  onClick,
  remainingItems,
  loading,
  className
}) => {
  return (
    <Button
      onClick={onClick}
      color="primary"
      className="cmn.mtop10, cmn.mbott10, className, 'btn'"
      startIcon={<ExpandCircleDownRoundedIcon />}
      disabled={loading}
    >
      {loading ? 'Loading more delegations' : `Show more delegations (${remainingItems})`}
    </Button>
  )
}

export default ShowMoreButton

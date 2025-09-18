/**
 * @license
 * SKALE Metaport
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
/**
 * @file AnimatedLoadingIcon.tsx
 * @copyright SKALE Labs 2025-Present
 */

import { useEffect, useState } from 'react'
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded'
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded'
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded'
import HourglassFullRoundedIcon from '@mui/icons-material/HourglassFullRounded'

export default function AnimatedLoadingIcon(props: { interval?: number }) {
    const interval = props.interval ?? 1000
    const icons = [
        HourglassEmptyRoundedIcon,
        HourglassTopRoundedIcon,
        HourglassBottomRoundedIcon,
        HourglassFullRoundedIcon
    ]
    const [idx, setIdx] = useState(0)
    useEffect(() => {
        const id = setInterval(() => setIdx(i => (i + 1) % icons.length), interval)
        return () => clearInterval(id)
    }, [interval])
    const Icon = icons[idx]
    return <Icon />
}

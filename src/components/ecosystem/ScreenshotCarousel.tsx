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
 * @file ScreenshotCarousel.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const ARROW =
  'absolute top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-all'

export default function ScreenshotCarousel({
  screenshots,
  appName
}: {
  screenshots: string[]
  appName: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(true)

  const sync = () => {
    const el = ref.current
    if (!el) return
    setAtStart(el.scrollLeft <= 0)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1)
  }

  const scroll = (direction: number) =>
    ref.current?.scrollBy({ left: direction * ref.current.clientWidth * 0.8, behavior: 'smooth' })

  return (
    <div className="relative mt-2.5">
      <div
        ref={ref}
        onScroll={sync}
        className="flex gap-2.5 h-100 overflow-x-auto snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {screenshots.map((screenshot, index) => (
          <img
            key={index}
            src={screenshot}
            alt={`${appName} screenshot ${index + 1}`}
            onLoad={sync}
            className="h-full w-auto max-w-none object-cover rounded-[25px] snap-start"
          />
        ))}
      </div>
      <button onClick={() => scroll(-1)} disabled={atStart} className={`${ARROW} left-4`}>
        <ChevronLeft className="text-foreground" size={17} />
      </button>
      <button onClick={() => scroll(1)} disabled={atEnd} className={`${ARROW} right-4`}>
        <ChevronRight className="text-foreground" size={17} />
      </button>
    </div>
  )
}

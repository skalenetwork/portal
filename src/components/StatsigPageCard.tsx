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
 * @file StatsigPageCard.tsx
 * @copyright SKALE Labs 2025-Present
 */

import { useStatsigClient, useFeatureGate } from '@statsig/react-bindings'
import PageCard from './PageCard'

interface StatsigPageCardProps {
  name: string
  description: string
  icon: JSX.Element
  url?: string
  position: number
}

export default function StatsigPageCard(props: StatsigPageCardProps): JSX.Element {
  const statsigClient = useStatsigClient()
  const isExperimentEnabled = useFeatureGate('home_page_top_card_test_enabled')

  const handleCardClick = () => {
    statsigClient.logEvent('home_bottom_card_clicked', 'bottom_card', {
      cardName: props.name,
      position: props.position.toString(),
      url: props.url || '',
      isExperimentRunning: isExperimentEnabled.toString()
    })
  }

  return (
    <div onClick={handleCardClick}>
      <PageCard
        name={props.name}
        description={props.description}
        icon={props.icon}
        url={props.url}
      />
    </div>
  )
}

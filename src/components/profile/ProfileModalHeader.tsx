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
 * @file ProfileModalHeader.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React from 'react'
import Headline from '../Headline'
import { networks } from '@/core'
import { NETWORKS } from '../../core/constants'
import GetSFuel from '../GetSFuel'
import { MetaportCore } from '@skalenetwork/metaport'
import { CircleUser } from 'lucide-react'

interface ProfileModalHeaderProps {
  mpc: MetaportCore
}

const ProfileModalHeader: React.FC<ProfileModalHeaderProps> = ({ mpc }) => (
  <div className="profileModalHeader items-center">
    <div className="grow">
      <Headline text="Wallet Info" icon={<CircleUser size={17} className="ml-2.5" />} />
    </div>
    <div className="profileModalStatus">
      {networks.hasFeatureInAny(NETWORKS, 'sfuel') && <GetSFuel mpc={mpc} />}
    </div>
  </div>
)

export default ProfileModalHeader

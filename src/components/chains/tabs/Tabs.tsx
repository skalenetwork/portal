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
 * @file Tabs.tsx
 * @copyright SKALE Labs 2024-Present
 */

import * as React from 'react'
import { Link } from 'react-router-dom'

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { IconButton, Tooltip } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

import { Settings2 } from 'lucide-react'

import { networks, type types } from '@/core'

import { NETWORKS } from '../../../core/constants'

export default function ChainTabs(props: {
  chainMeta: types.ChainMetadata
  handleChange: (event: React.SyntheticEvent, newValue: number) => void
  tabs: any[]
  tab: number
  schainName: string
}) {
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <div className="mt-0 flex items-center">
      <div className="grow">
        <Tabs
          variant={isMdUp ? 'scrollable' : 'standard'}
          value={props.tab}
          onChange={props.handleChange}
          scrollButtons="auto"
          style={{ maxWidth: 'calc(100vw - 32px)' }}
          className="skTabs bg-background! rounded-full p-1! w-fit"
        >
          {props.tabs.map((tab, index) =>
            tab ? (
              <Tab
                key={index}
                label={tab.label}
                icon={tab.icon}
                iconPosition="start"
                className={`btn btnSm tab fwmobile ${
                  props.tab === index
                    ? 'text-foreground! bg-foreground/10! shadow-xs!'
                    : 'text-muted-foreground!'
                }`}
              />
            ) : null
          )}
          <div className="grow"></div>
        </Tabs>
      </div>
      {networks.hasFeatureInAny(NETWORKS, 'paymaster') && (
        <Tooltip arrow title="Manage Chain">
          <Link to={`/chains/admin/${props.schainName}`}>
            <IconButton className="btn btnSm tab h-full! text-foreground! text-xs bg-foreground/5! ease-in-out transition-transform duration-150 active:scale-[0.97] mr-2!">
              <Settings2 size={17} />
            </IconButton>
          </Link>
        </Tooltip>
      )}
    </div>
  )
}

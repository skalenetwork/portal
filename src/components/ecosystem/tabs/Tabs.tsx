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

import { cls, cmn, interfaces } from '@skalenetwork/metaport'

import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'

export default function ChainTabs(props: {
  chainMeta: interfaces.ChainMetadata
  handleChange: (event: React.SyntheticEvent, newValue: number) => void
  tabs: any[]
  tab: number
  schainName: string
}) {
  return (
    <div className={cls(cmn.mtop10, cmn.fullWidth)}>
      <Tabs
        centered
        value={props.tab}
        onChange={props.handleChange}
        scrollButtons="auto"
      >
        {props.tabs.map((tab, index) =>
          tab ? (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
              className={cls('btn', 'btnSm', cmn.mri10, cmn.mleft10, 'tab')}
            />
          ) : null
        )}
        <Link to={`/admin/${props.schainName}`} className="tabLink">
          <Tab
            label="Manage"
            icon={<AdminPanelSettingsRoundedIcon />}
            iconPosition="start"
            className={cls('btn', 'btnSm', cmn.mri10, cmn.mleft10, 'tab')}
          />
        </Link>
      </Tabs>
    </div>
  )
}

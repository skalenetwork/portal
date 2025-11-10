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

import { cls, cmn } from '@skalenetwork/metaport'
import { type types } from '@/core'

import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import { Button } from '@mui/material'

export default function ChainTabs(props: {
  chainMeta: types.ChainMetadata
  handleChange: (event: React.SyntheticEvent, newValue: number) => void
  tabs: any[]
  tab: number
  schainName: string
  isXs: boolean
}) {
  return (
    <div className={cls(cmn.mtop10, cmn.fullWidth)}>
      <Tabs
        variant={props.isXs ? 'scrollable' : 'standard'}
        value={props.tab}
        onChange={props.handleChange}
        scrollButtons="auto"
        style={{ maxWidth: 'calc(100vw - 32px)', marginLeft: '-5px' }}
        className="skTabs"
      >
        {props.tabs.map((tab, index) =>
          tab ? (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
              className={cls('btn', 'btnSm', cmn.mri5, cmn.mleft5, 'tab', 'fwmobile')}
            />
          ) : null
        )}
        <Link to={`/chains/admin/${props.schainName}`}>
          <Button
            startIcon={<AdminPanelSettingsRoundedIcon />}
            className={cls('btn', 'btnSm', cmn.mri5, cmn.mleft5, 'tab', cmn.pSec, cmn.p500)}
          >
            Manage
          </Button>
        </Link>
      </Tabs>
    </div>
  )
}

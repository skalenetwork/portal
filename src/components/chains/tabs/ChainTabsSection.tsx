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
 * @file ChainTabsSection.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { useEffect, useState } from 'react'

import { cmn, cls, MetaportCore, SkPaper, explorer } from '@skalenetwork/metaport'
import { type types } from '@/core'

import WidgetsRoundedIcon from '@mui/icons-material/WidgetsRounded'
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded'
import PlaylistAddCheckCircleRoundedIcon from '@mui/icons-material/PlaylistAddCheckCircleRounded'
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded'

import ChainTabs from './Tabs'
import DeveloperInfo from './DeveloperInfo'
import Tokens from './Tokens'
import VerifiedContracts from './VerifiedContracts'
import FeaturedApps from '../../ecosystem/tabs/FeaturedApps'
import { useApps } from '../../../useApps'

const BASE_TABS = [
  {
    label: 'Developer info',
    icon: <ConstructionRoundedIcon />
  },
  {
    label: 'Contracts',
    icon: <PlaylistAddCheckCircleRoundedIcon />
  }
]

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      className="fwmobile"
    >
      {value === index && children}
    </div>
  )
}

export default function ChainTabsSection(props: {
  mpc: MetaportCore
  chainsMeta: types.ChainsMetadataMap
  schainName: string
  isXs: boolean
}) {
  const network = props.mpc.config.skaleNetwork
  const chainMeta = props.chainsMeta[props.schainName]

  const { featuredApps, newApps, trendingApps } = useApps(props.chainsMeta, null)

  const chainFeaturedApps = featuredApps.filter((app) => app.chain === props.schainName)

  const explorerUrl = explorer.getExplorerUrl(network, props.schainName)

  const BASE_TABS_CONTENT = [
    <DeveloperInfo schainName={props.schainName} skaleNetwork={network} />,
    <VerifiedContracts mpc={props.mpc} schainName={props.schainName} explorerUrl={explorerUrl} />
  ]

  const [tab, setTab] = useState<number>(0)
  const [tabs, setTabs] = useState<any[]>(BASE_TABS)
  const [tabsContent, setTabsContent] = useState<any[]>(BASE_TABS_CONTENT)

  useEffect(() => {
    const tokenConnections = props.mpc.config.connections[props.schainName] ?? {}
    const chainTokens = tokenConnections.erc20 ?? {}
    const hasTokens = Object.keys(chainTokens).length !== 0
    const currentTabs = [...BASE_TABS]
    const currentTabsContent = [...BASE_TABS_CONTENT]
    if (hasTokens) {
      currentTabs.unshift({ label: 'Tokens', icon: <AccountBalanceWalletRoundedIcon /> })
      currentTabsContent.unshift(<Tokens mpc={props.mpc} schainName={props.schainName} />)
    }
    if (
      props.chainsMeta[props.schainName] &&
      props.chainsMeta[props.schainName].apps &&
      chainFeaturedApps.length > 0
    ) {
      currentTabs.unshift({ label: 'Featured Apps', icon: <WidgetsRoundedIcon /> })
      currentTabsContent.unshift(
        <SkPaper gray className={cls(cmn.mtop20)}>
          <div className={cls(cmn.mtop10, cmn.mbott10, cmn.mleft5, cmn.mri5)}>
            <FeaturedApps
              featuredApps={chainFeaturedApps}
              skaleNetwork={network}
              chainsMeta={props.chainsMeta}
              newApps={newApps}
              trendingApps={trendingApps}
              useCarousel={false}
              gray={false}
            />
          </div>
        </SkPaper>
      )
    }
    setTabs(currentTabs)
    setTabsContent(currentTabsContent)
  }, [])

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  return (
    <div className={cls(cmn.mtop20)} style={{ paddingBottom: '60px' }}>
      <ChainTabs
        chainMeta={chainMeta}
        handleChange={handleChange}
        tab={tab}
        tabs={tabs}
        schainName={props.schainName}
        isXs={props.isXs}
      />
      {tabsContent.map((content, index) => (
        <CustomTabPanel key={index} value={tab} index={index}>
          {content}
        </CustomTabPanel>
      ))}
    </div>
  )
}

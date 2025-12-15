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
import { Bolt, Coins, FileCheck, Heart } from 'lucide-react'

import { MetaportCore, SkPaper, explorer } from '@skalenetwork/metaport'
import { type types } from '@/core'

import ChainTabs from './Tabs'
import DeveloperInfo from './DeveloperInfo'
import Tokens from './Tokens'
// import VerifiedContracts from './VerifiedContracts'
import FeaturedApps from '../../ecosystem/tabs/FeaturedApps'
import { useApps } from '../../../useApps'

const BASE_TABS = [
  {
    label: 'Developer info',
    icon: <Bolt size={17} />
  }
  // {
  //   label: 'Contracts',
  //   icon: <FileCheck size={17} />
  // }
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
  chain: types.ISChain
  isXs: boolean
}) {
  const network = props.mpc.config.skaleNetwork
  const chainMeta = props.chainsMeta[props.chain.name]

  const { featuredApps, newApps, trendingApps } = useApps(props.chainsMeta, null)

  const chainFeaturedApps = featuredApps.filter((app) => app.chain === props.chain.name)

  // const explorerUrl = explorer.getExplorerUrl(chainMeta, network, props.schainName)

  const BASE_TABS_CONTENT = [
    <DeveloperInfo chain={props.chain} skaleNetwork={network} shortAlias={chainMeta?.shortAlias} />
    // <VerifiedContracts mpc={props.mpc} schainName={props.schainName} explorerUrl={explorerUrl} />
  ]

  const [tab, setTab] = useState<number>(0)
  const [tabs, setTabs] = useState<any[]>(BASE_TABS)
  const [tabsContent, setTabsContent] = useState<any[]>(BASE_TABS_CONTENT)

  useEffect(() => {
    const tokenConnections = props.mpc.config.connections[props.chain.name] ?? {}
    const chainTokens = tokenConnections.erc20 ?? {}
    const hasTokens = Object.keys(chainTokens).length !== 0
    const currentTabs = [...BASE_TABS]
    const currentTabsContent = [...BASE_TABS_CONTENT]

    // if (
    //   props.chainsMeta[props.schainName] &&
    //   props.chainsMeta[props.schainName].apps &&
    //   chainFeaturedApps.length > 0
    // ) {
    //   currentTabs.unshift({ label: 'Featured Apps', icon: <Heart size={17} /> })
    //   currentTabsContent.unshift(
    //     <div className="mt-2.5 mb-2.5 ml-1.5 mr-1.5">
    //       <FeaturedApps
    //         featuredApps={chainFeaturedApps}
    //         skaleNetwork={network}
    //         chainsMeta={props.chainsMeta}
    //         newApps={newApps}
    //         trendingApps={trendingApps}
    //         useCarousel={false}
    //         gray={false}
    //         showSeeMoreButton={true}
    //         chainName={props.schainName}
    //       />
    //     </div>
    //   )
    // }
    if (hasTokens) {
      currentTabs.push({ label: 'Tokens', icon: <Coins size={17} /> })
      currentTabsContent.push(<Tokens mpc={props.mpc} schainName={props.chain.name} />)
    }
    setTabs(currentTabs)
    setTabsContent(currentTabsContent)
  }, [])

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  return (
    <SkPaper gray className="mt-3 p-3! mb-12">
      <div className="mt-1 mb-4">
        <ChainTabs
          chainMeta={chainMeta}
          handleChange={handleChange}
          tab={tab}
          tabs={tabs}
          schainName={props.chain.name}
          isXs={props.isXs}
        />
      </div>
      <div>
        {tabsContent.map((content, index) => (
          <CustomTabPanel key={index} value={tab} index={index}>
            {content}
          </CustomTabPanel>
        ))}
      </div>
    </SkPaper>
  )
}

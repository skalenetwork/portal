import './App.scss'

import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useLocation, Routes, Route } from 'react-router-dom'
import { useMetaportStore, PROXY_ENDPOINTS, type MetaportState } from '@skalenetwork/metaport'

import Bridge from './pages/Bridge'
import Faq from './pages/Faq'
import Terms from './pages/Terms'
import Network from './pages/Chains'
import Schain from './pages/Schain'
import Stats from './pages/Stats'
import Apps from './pages/Apps'
import App from './components/App'
import History from './pages/History'
import Portfolio from './pages/Portfolio'
import Admin from './pages/Admin'
import Start from './pages/Start'
import TermsModal from './components/TermsModal'

import { getHistoryFromStorage, setHistoryToStorage } from './core/transferHistory'
import { BRIDGE_PAGES } from './core/constants'
import { pricingLaunchTsReached } from './core/paymaster'

// import chainsJson from './chainsJson.json';

export default function Router() {
  const location = useLocation()
  const currentUrl = `${window.location.origin}${location.pathname}${location.search}`

  const [schains, setSchains] = useState<any[]>([])
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false)

  const mpc = useMetaportStore((state: MetaportState) => state.mpc)
  const transfersHistory = useMetaportStore((state) => state.transfersHistory)
  const setTransfersHistory = useMetaportStore((state) => state.setTransfersHistory)

  const endpoint = PROXY_ENDPOINTS[mpc.config.skaleNetwork]

  useEffect(() => {
    setTransfersHistory(getHistoryFromStorage(mpc.config.skaleNetwork))
  }, [])

  useEffect(() => {
    if (transfersHistory.length !== 0) {
      setHistoryToStorage(transfersHistory, mpc.config.skaleNetwork)
    }
  }, [transfersHistory])

  async function loadSchains() {
    const response = await fetch(`https://${endpoint}/files/chains.json`)
    const chainsJson = await response.json()
    const schains = []
    for (const chain of chainsJson) {
      schains.push(chain.schain)
    }
    setSchains(schains)
  }

  function isBridgePage(): boolean {
    return BRIDGE_PAGES.some(
      (pathname) => location.pathname === pathname || location.pathname.includes(pathname)
    )
  }

  if (!termsAccepted && isBridgePage()) {
    return (
      <TermsModal mpc={mpc} termsAccepted={termsAccepted} setTermsAccepted={setTermsAccepted} />
    )
  }

  return (
    <div>
      <Helmet>
        <meta property="og:url" content={currentUrl} />
      </Helmet>
      <Routes>
        <Route index element={<Start />} />
        <Route path="bridge" element={<Bridge />} />
        <Route path="bridge">
          <Route path="history" element={<History />} />
        </Route>
        <Route path="portfolio" element={<Portfolio mpc={mpc} />} />
        <Route
          path="chains"
          element={<Network loadSchains={loadSchains} schains={schains} mpc={mpc} />}
        />
        <Route path="chains">
          <Route
            path=":name"
            element={<Schain loadSchains={loadSchains} schains={schains} mpc={mpc} />}
          />
        </Route>
        <Route path="apps" element={<Apps />} />
        <Route path="apps">
          <Route path=":name" element={<App />} />
        </Route>
        <Route path="stats" element={<Stats />} />
        <Route path="other">
          <Route path="faq" element={<Faq />} />
          <Route path="terms-of-service" element={<Terms />} />
        </Route>
        {pricingLaunchTsReached(mpc.config.skaleNetwork) ? (
          <Route path="admin">
            <Route path=":name" element={<Admin mpc={mpc} />} />
          </Route>
        ) : null}
      </Routes>
    </div>
  )
}

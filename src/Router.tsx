import './App.scss';

import { useState } from 'react'

import Bridge from './components/Bridge';
import Faq from './components/Faq';
import Terms from './components/Terms';
import Network from './components/Network';
import Schain from './components/Schain';
import Stats from './components/Stats';
import Apps from './components/Apps';
import App from './components/App';
import History from './components/History';
import Portfolio from './components/Portfolio';

import { useMetaportStore, PROXY_ENDPOINTS, MetaportState } from '@skalenetwork/metaport';
import { Routes, Route } from "react-router-dom";


export default function Router() {
    const [schains, setSchains] = useState<any[]>([])
    const mpc = useMetaportStore((state: MetaportState) => state.mpc)
    const endpoint = PROXY_ENDPOINTS[mpc.config.skaleNetwork]

    async function loadSchains() {
        let response = await fetch(`https://${endpoint}/files/chains.json`);
        let chainsJson = await response.json();
        let schains = [];
        for (let chain of chainsJson) {
            schains.push(chain.schain);
        }
        setSchains(schains)
    }

    return (
        <Routes>
            <Route index element={<Bridge />} />
            <Route path="bridge" >
                <Route
                    path="history"
                    element={<History />}
                />
            </Route>
            <Route path='portfolio' element={<Portfolio mpc={mpc} />} />
            <Route path='chains' element={<Network
                loadSchains={loadSchains}
                schains={schains}
                mpc={mpc}
            />} />
            <Route path="chains" >
                <Route
                    path=":name"
                    element={<Schain
                        loadSchains={loadSchains}
                        schains={schains}
                        mpc={mpc}
                    />}
                />
            </Route>
            <Route path='apps' element={<Apps />} />
            <Route path="apps" >
                <Route path=":name" element={<App />}
                />
            </Route>
            <Route path='stats' element={<Stats />} />
            <Route path="other" >
                <Route path="faq" element={<Faq />} />
                <Route path="terms-of-service" element={<Terms />} />
            </Route>
        </Routes>
        //     </CSSTransition>
        // </TransitionGroup>
    );
}

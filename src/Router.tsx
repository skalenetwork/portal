import './App.scss';

import { useState } from 'react'

import Main from './components/Main';
// import Transfer from './components/Transfer';
// import TransferV2 from './components/TransferV2';
import Faq from './components/Faq';
import Terms from './components/Terms';
import Network from './components/Network';
import Schain from './components/Schain';
import Stats from './components/Stats';
// import ExitGasWallet from './components/ExitGasWallet';
// import TransferTo from './components/TransferTo';
// import Overview from './components/Overview';
// import History from './components/History';


import { useMetaportStore, PROXY_ENDPOINTS } from '@skalenetwork/metaport';
import { Routes, Route } from "react-router-dom";


export default function Router() {
    const [schains, setSchains] = useState<any[]>([])
    const mpc = useMetaportStore((state) => state.mpc)
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
            <Route index element={<Main />} />
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

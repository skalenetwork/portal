import './App.scss';

import Main from './components/Main';
// import Transfer from './components/Transfer';
// import TransferV2 from './components/TransferV2';
import Faq from './components/Faq';
import Terms from './components/Terms';
// import ExitGasWallet from './components/ExitGasWallet';
// import TransferTo from './components/TransferTo';
// import Overview from './components/Overview';
// import History from './components/History';

import { Routes, Route, useLocation } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";

export default function Router(props: any) {
    const location = useLocation();
    return (
        // <TransitionGroup component={null}>
        //     <CSSTransition key={location.key} classNames="fade" timeout={300}>
                <Routes>
                    <Route
                        index
                        element={<Main address={props.address} metaport={props.metaport} />}
                    />
                    {/* <Route path="bridge" >
                        <Route
                            path="exit"
                            element={<ExitGasWallet />}
                        />
                        <Route
                            path="overview"
                            element={<Overview address={props.address} />}
                        />
                        <Route
                            path="history"
                            element={<History address={props.address} />}
                        />
                        <Route path="transfer" >
                            <Route
                                path=":from"
                                element={<TransferTo address={props.address} metaport={props.metaport} theme={props.theme} />}
                            />
                            <Route
                                path=":from/:to"
                                element={<Transfer
                                    address={props.address}
                                    metaport={props.metaport}
                                    theme={props.theme}
                                />}
                            />
                        </Route>
                        <Route path="transferv2" >
                            <Route
                                path=":from"
                                element={<TransferTo address={props.address} metaport={props.metaport} theme={props.theme} />}
                            />
                            <Route
                                path=":from/:to"
                                element={<TransferV2
                                    address={props.address}
                                    metaport={props.metaport}
                                    theme={props.theme}
                                />}
                            />
                        </Route>
                    </Route>

                     */}
                    <Route path="other" >
                        <Route
                            path="faq"
                            element={<Faq />}
                        />
                        <Route
                            path="terms-of-service"
                            element={<Terms />}
                        />
                    </Route>
                </Routes>
        //     </CSSTransition>
        // </TransitionGroup>
    );
}

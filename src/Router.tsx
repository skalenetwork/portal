import './App.scss';

import Sandbox from './Sandbox';
import Main from './Main';
import TransferRequests from './TransferRequests';
import Transfer from './components/Transfer';

import { Routes, Route, useLocation } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";

export default function Router(props: any) {
    const location = useLocation();
    return (
        <TransitionGroup component={null}>
            <CSSTransition key={location.key} classNames="fade" timeout={300}>
                <Routes>
                    <Route
                        index
                        element={<Main address={props.address} metaport={props.metaport} />}
                    />

                    <Route path="transfer" >
                        <Route
                            path=":from/:to"
                            element={<Transfer address={props.address} metaport={props.metaport} />}
                        />
                    </Route>
                    <Route path="common" >
                        <Route
                            path="sandbox"
                            element={<Sandbox address={props.address} metaport={props.metaport} />}
                        />
                    </Route>
                    <Route path="erc20" >
                        <Route
                            path="transfer-requests"
                            element={<TransferRequests
                                address={props.address}
                                metaport={props.metaport}
                                setOpen={props.setOpen}
                            />}
                        />
                    </Route>
                </Routes>
            </CSSTransition>
        </TransitionGroup>
    );
}

import './App.scss';

import Main from './Main';
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
                </Routes>
            </CSSTransition>
        </TransitionGroup>
    );
}

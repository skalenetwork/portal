/**
 * @license
 * SKALE bridge-ui
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
 * @file TermsModal.ts
 * @copyright SKALE Labs 2022-Present
*/

import React from 'react';

import Modal from '@mui/material/Modal';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

import { METAPORT_CONFIG, MAINNET_CHAIN_NAME } from '../../core/constants';

import BridgePaper from '../BridgePaper';
import TermsOfService from '../Terms/terms-of-service.mdx'

import logo from '../../skale_lg.svg';


const style = {
    width: '100vw',
    height: '100vh',
    outline: 'none',
    backdropFilter: 'blur(5px)',
    WebkitBackdropFilter: 'blur(10px)'
};


export default function TermsModal(props: any) {
    const [scrolled, setScrolled] = React.useState<boolean>(false);

    function getAgreeButtonText() {
        if (!scrolled) return '⬆️ Read Terms of Service to continue ⬆️';
        return 'Agree to terms';
    }

    function handleTermsScroll(e: any) {
        const diff = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight;
        const bottom = Math.abs(diff) < 15;
        setScrolled(bottom);
    }
    if (props.termsAccepted) return null;
    return (<Modal open={!props.termsAccepted} className='br__modal'>
        <div style={style} className='mp__flex mp__flexCenteredVert'>
            <Container maxWidth="md">
                <BridgePaper rounded>
                    <BridgePaper rounded >
                        <img src={logo} className="logo mp__margBott20 mp__margTop10" alt="logo" />
                        {
                            METAPORT_CONFIG.skaleNetwork !== MAINNET_CHAIN_NAME ?
                                <p className='mp__p mp__p6 whiteText'>
                                    ❗ THIS IS A TEST WEBSITE ❗ <br /><br />
                                </p> : <div></div>}
                        <p className='mp__p mp__p6 whiteText'>
                            🖥️ For Desktop Use Only. <br /><br />
                            SKALE will NEVER ask you for your seed phrase or private keys. <br /><br />
                            Please make sure you are connected to the correct bridge and only use this official link: <Link target="_blank" rel="noopener noreferrer" href="https://bridge.skale.space/">https://bridge.skale.space/</Link>
                            <br />
                            <br />
                            Before you use the SKALE Bridge, you must review the terms of service carefully and confirm below.
                        </p>
                    </BridgePaper>
                    <div>
                        <BridgePaper rounded gray>
                            <div id='terms' className='br__modalScroll' style={{ paddingRight: '20px' }} onScroll={handleTermsScroll} >
                                <TermsOfService />
                            </div>
                        </BridgePaper>
                    </div>
                    <Button
                        onClick={() => { props.setTermsAccepted(true); }}
                        variant="contained"
                        disabled={!scrolled}
                        className='mp__margTop20 bridge__btn'
                        size='large'
                    >
                        {getAgreeButtonText()}
                    </Button>
                </BridgePaper>
            </Container>
        </div>
    </Modal>)
}

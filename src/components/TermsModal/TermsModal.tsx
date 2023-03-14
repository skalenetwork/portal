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
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

import BridgePaper from '../BridgePaper';
import TermsOfService from '../Terms/terms-of-service.mdx'

import logo from '../../skale_lg.svg';


const style = {
    width: '100vw',
    height: '100vh',
    outline: 'none',
    backdropFilter: 'blur(5px)',
    '-webkit-backdrop-filter': 'blur(10px)'
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
                    <Grid container spacing={2} >

                        <Grid item md={12} sm={12} xs={12}>
                            <BridgePaper rounded >
                                <img src={logo} className="logoBig mp__margBott20 mp__margTop10" alt="logo" />
                                <p className='mp__p mp__p6 whiteText'>
                                    We will NEVER ask you for your seed phrase or private keys. <br /><br />
                                    SKALE Network is in beta - <Link target="_blank" rel="noopener noreferrer" href="https://docs.skale.network/learn/mainnet-beta">learn more</Link>. <br />
                                    Before you use SKALE Bridge, you should review our terms of service carefully and confirm below 👇
                                </p>
                            </BridgePaper>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <div style={{}}>
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

                        </Grid>
                    </Grid>
                </BridgePaper>
            </Container>
        </div>
    </Modal>)
}
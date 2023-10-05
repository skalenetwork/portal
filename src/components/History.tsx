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
 * @file History.tsx
 * @copyright SKALE Labs 2023-Present
*/

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button'
import Container from '@mui/material/Container';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import { cmn, cls, styles, History as TransfersHistory, useMetaportStore } from '@skalenetwork/metaport';

import { setHistoryToStorage } from '../core/transferHistory'


export default function History() {
    const mpc = useMetaportStore((state) => state.mpc)
    const transfersHistory = useMetaportStore((state) => state.transfersHistory)
    const transactionsHistory = useMetaportStore((state) => state.transactionsHistory)
    const clearTransactionsHistory = useMetaportStore((state) => state.clearTransactionsHistory)

    function clearTransferHistory() {
        clearTransactionsHistory()
        setHistoryToStorage(transfersHistory, mpc.config.skaleNetwork)
    }

    return (<Container maxWidth="md">
        <Stack spacing={0}>
            <div className={cls(cmn.flex, cmn.flexcv)}>
                <div className={cls(cmn.flexg)}>
                    <h2 className={cls(cmn.nom)}>
                        History ({transfersHistory.length + transactionsHistory.length})
                    </h2>
                    <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec)}>
                        SKALE Bridge transfers history
                    </p>
                </div>
                <div className={cls(cmn.flex)}>
                </div>
            </div>
            <TransfersHistory size='md' />
            <div>
                {transfersHistory.length !== 0 ? <Button
                    onClick={clearTransferHistory}
                    color="error"
                    size="small"
                    className={cls(styles.btnAction, cmn.mbott20)}
                    startIcon={<DeleteRoundedIcon />}
                >
                    Clear transfers history
                </Button> : <p className={cls(cmn.p, cmn.p2, cmn.pSec, cmn.mtop20, cmn.pCent)}>
                    No past transfers found
                </p>}
            </div>
        </Stack>
    </Container>)
}
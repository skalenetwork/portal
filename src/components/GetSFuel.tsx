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
 * @file GetSFuel.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { Box, Button, Tooltip } from '@mui/material'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import { cls, styles, cmn, type MetaportCore, useWagmiAccount } from '@skalenetwork/metaport'
import { usesFuel } from '../useSFuel'

export default function GetSFuel({ mpc }: { mpc: MetaportCore }) {
  const { sFuelOk, isMining, mineSFuel } = usesFuel(mpc)
  const { address } = useWagmiAccount()
  if (!address) return null
  return (
    <Box
      sx={{ alignItems: 'center', textAlign: 'center', display: { xs: 'none', sm: 'flex' } }}
      className={cls(cmn.mleft5)}
    >
      <Tooltip arrow title={sFuelOk ? 'sFUEL balance is OK' : 'Click to get sFUEL for all chains'}>
        <Button
          onClick={sFuelOk ? undefined : mineSFuel}
          disabled={isMining}
          className={cls('mp__btnConnect', styles.paperGrey, [cmn.pPrim, !isMining], cmn.flex)}
          color="success"
        >
          <BoltRoundedIcon
            className={cls(cmn.mri5, styles.chainIconxs)}
            color={sFuelOk ? 'success' : 'primary'}
          />
          {isMining ? 'Getting sFUEL...' : sFuelOk ? 'sFUEL OK' : 'Get sFUEL'}
        </Button>
      </Tooltip>
    </Box>
  )
}

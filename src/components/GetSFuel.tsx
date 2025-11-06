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
import AutoModeRoundedIcon from '@mui/icons-material/AutoModeRounded'
import { type MetaportCore, useWagmiAccount } from '@skalenetwork/metaport'
import { usesFuel } from '../useSFuel'

export default function GetSFuel({ mpc }: { mpc: MetaportCore }) {
  const { sFuelOk, isMining, mineSFuel, sFuelCompletionPercentage, loading } = usesFuel(mpc)
  const { address } = useWagmiAccount()
  if (!address) return null

  function btnText() {
    if (isMining) return `Getting sFUEL - ${sFuelCompletionPercentage}%`
    if (loading) return 'Checking sFUEL'
    return sFuelOk ? 'sFUEL OK' : 'Get sFUEL'
  }

  return (
    <Box
      sx={{ alignItems: 'center', textAlign: 'center', display: { xs: 'none', sm: 'flex' } }}
      className="ml-1.5"
    >
      <Tooltip arrow title={sFuelOk ? 'sFUEL balance is OK' : 'Click to get sFUEL for all chains'}>
        <Button
          onClick={sFuelOk ? undefined : mineSFuel}
          disabled={isMining || loading || sFuelOk}
          className="'mp__btnConnect', styles.paperGrey, [text-primary, !isMining], flex"
          color="success"
        >
          {loading ? (
            <AutoModeRoundedIcon className="mr-1.5, styles.chainIconxs" />
          ) : (
            <BoltRoundedIcon
              className="mr-1.5, styles.chainIconxs"
              color={sFuelOk ? 'success' : 'primary'}
            />
          )}
          {btnText()}
        </Button>
      </Tooltip>
    </Box>
  )
}

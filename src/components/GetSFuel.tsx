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
import AutoModeRoundedIcon from '@mui/icons-material/AutoModeRounded'
import { type MetaportCore, useWagmiAccount } from '@skalenetwork/metaport'
import { usesFuel } from '../useSFuel'
import { Zap } from 'lucide-react'

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
          className="flex h-9 px-3 items-center text-foreground! bg-card! text-xs! normal-case! rounded-full! min-w-0!"
          color="success"
        >
          {loading ? (
            <AutoModeRoundedIcon className="h-5 w-5 pr-1" />
          ) : (
            <Zap className="text-green-400 h-5 w-5 pr-1" />
          )}
          {btnText()}
        </Button>
      </Tooltip>
    </Box>
  )
}

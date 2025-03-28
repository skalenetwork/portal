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
 * @file DeveloperInfo.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { cmn, cls, styles, SkPaper } from '@skalenetwork/metaport'
import { type types, endpoints, constants } from '@/core'

import Grid from '@mui/material/Grid'

import CopySurface from '../../CopySurface'

import { getRpcUrl, getRpcWsUrl, getFsUrl, getChainId } from '../../../core/chain'

export default function DeveloperInfo(props: {
  schainName: string
  skaleNetwork: types.SkaleNetwork
  className?: string
}) {
  const proxyBase = endpoints.getProxyEndpoint(props.skaleNetwork)
  const rpcUrl = getRpcUrl(proxyBase, props.schainName, constants.HTTPS_PREFIX)
  const rpcWssUrl = getRpcWsUrl(proxyBase, props.schainName, constants.WSS_PREFIX)
  const fsUrl = getFsUrl(proxyBase, props.schainName, constants.HTTPS_PREFIX)

  const chainId = getChainId(props.schainName)

  return (
    <SkPaper gray className={cls(cmn.mtop20)}>
      <Grid container spacing={2} className={cls(cmn.full)}>
        <Grid item md={12} xs={12}>
          <CopySurface className={cls(styles.fullHeight)} title="RPC Endpoint" value={rpcUrl} />
        </Grid>
        <Grid item md={6} xs={12}>
          <CopySurface
            className={cls(styles.fullHeight)}
            title="Websocket Endpoint"
            value={rpcWssUrl}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <CopySurface
            className={cls(styles.fullHeight)}
            title="Filestorage Endpoint"
            value={fsUrl}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <CopySurface
            className={cls(styles.fullHeight)}
            title="SKALE Manager name"
            value={props.schainName}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <CopySurface className={cls(styles.fullHeight)} title="Chain ID Hex" value={chainId} />
        </Grid>
      </Grid>
    </SkPaper>
  )
}

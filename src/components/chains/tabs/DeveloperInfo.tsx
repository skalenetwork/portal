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

import { type types, endpoints, constants } from '@/core'

import CopySurface from '../../CopySurface'

import {
  getRpcUrl,
  getRpcWsUrl,
  getFsUrl,
  getChainId,
  getChainIdInt,
  getAllocationTypeName,
  hasFilestorage
} from '../../../core/chain'
import {
  BadgeInfo,
  FastForward,
  FileBox,
  FileCodeCorner,
  FileDigit,
  GlobeLock,
  HardDrive,
  Rabbit,
  RadioTower,
  ScanQrCode,
  UserRoundCheck,
  UserStar
} from 'lucide-react'

export default function DeveloperInfo(props: {
  chain: types.ISChain
  skaleNetwork: types.SkaleNetwork
  className?: string
  shortAlias?: string | undefined
}) {
  const proxyBase = endpoints.getProxyEndpoint(props.skaleNetwork)
  const rpcUrl = getRpcUrl(proxyBase, props.shortAlias || props.chain.name, constants.HTTPS_PREFIX)
  const rpcWssUrl = getRpcWsUrl(
    proxyBase,
    props.shortAlias || props.chain.name,
    constants.WSS_PREFIX
  )
  const fsUrl = getFsUrl(proxyBase, props.shortAlias || props.chain.name, constants.HTTPS_PREFIX)

  const chainId = getChainId(props.chain.name)
  const chainIdInt = getChainIdInt(props.chain.name)
  const allocationType = getAllocationTypeName(props.chain.allocationType)
  const hasFs = hasFilestorage(props.chain.allocationType)

  return (
    <div className="p-2! pt-0!">
      <p className="text-foreground text-lg font-sans font-bold pb-2 pl-0.5"> Endpoint links</p>
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
        <div className="col-span-1 md:col-span-2">
          <CopySurface
            className="h-full"
            title="RPC Endpoint"
            value={rpcUrl}
            icon={<GlobeLock size={17} className="text-green-600 dark:text-green-400" />}
          />
        </div>
        <div className={`col-span-1 ${hasFs ? '' : 'md:col-span-2'}`}>
          <CopySurface
            className="h-full"
            title="WS RPC Endpoint"
            value={rpcWssUrl}
            icon={<RadioTower size={17} className="text-green-600 dark:text-green-400" />}
          />
        </div>
        {hasFs && (
          <div className="col-span-1">
            <CopySurface
              className="h-full"
              title="Filestorage Endpoint"
              value={fsUrl}
              icon={<FileBox size={17} className="text-blue-600 dark:text-blue-400" />}
            />
          </div>
        )}
      </div>
      <p className="text-foreground text-lg font-sans font-bold pb-2 pt-4 pl-0.5"> Chain details</p>
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
        <div className="col-span-1">
          <CopySurface
            className="h-full"
            title="Chain ID Int"
            value={chainIdInt.toString()}
            icon={<FileDigit size={17} />}
          />
        </div>
        <div className="col-span-1">
          <CopySurface
            className="h-full"
            title="Chain ID Hex"
            value={chainId}
            icon={<FileCodeCorner size={17} />}
          />
        </div>
        <div className="col-span-1">
          <CopySurface
            className="h-full"
            title="SKALE Manager name"
            value={props.chain.name}
            icon={<BadgeInfo size={17} />}
          />
        </div>
        <div className="col-span-1">
          <CopySurface
            className="h-full"
            title="Allocation Type"
            value={allocationType}
            icon={<HardDrive size={17} />}
          />
        </div>
        <div className="col-span-1">
          <CopySurface
            className="h-full"
            title="Multitransaction Mode"
            value={props.chain.multitransactionMode ? 'Enabled' : 'Disabled'}
            icon={<FastForward size={17} />}
          />
        </div>
        <div className="col-span-1">
          <CopySurface
            className="h-full"
            title="Mainnet Owner"
            value={props.chain.mainnetOwner}
            icon={<UserStar size={17} />}
          />
        </div>
      </div>
    </div>
  )
}

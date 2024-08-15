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
 * @file index.ts
 * @copyright SKALE Labs 2024-Present
 */

export { 
    ChainsMetadataMap,
    ChainMetadata,
    AppMetadata,
    AppMetadataMap,
    AppSocials,
    NetworksMetadataMap,
    AppWithTimestamp,
    CategoriesMap
} from './ChainsMetadata'
export * as staking from './staking'

export type AddressType = `0x${string}`
export type Size = 'xs' | 'sm' | 'md' | 'lg'
export type SkaleNetwork = 'mainnet' | 'staging' | 'legacy' | 'regression' | 'testnet'

export type TSChainArray = [
    string,
    AddressType,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    AddressType,
    boolean,
    boolean
]

export interface ISChain {
    name: string
    mainnetOwner: AddressType
    indexInOwnerList: number
    partOfNode: number
    lifetime: number
    startDate: number
    startBlock: number
    deposit: number
    index: number
    generation: number
    originator: AddressType
    multitransactionMode: boolean
    thresholdEncryption: boolean
}

export interface ISChainData {
    schain: TSChainArray
    nodes: INodeInfo[]
}

export interface INodeInfo {
    id: number
    name: string
    ip: string
    base_port: number
    domain: string
    schain_base_port: number
    httpRpcPort: number
    httpsRpcPort: number
    wsRpcPort: number
    wssRpcPort: number
    infoHttpRpcPort: number
    http_endpoint_ip: string
    https_endpoint_ip: string
    ws_endpoint_ip: string
    wss_endpoint_ip: string
    infoHttp_endpoint_ip: string
    http_endpoint_domain: string
    https_endpoint_domain: string
    ws_endpoint_domain: string
    wss_endpoint_domain: string
    infoHttp_endpoint_domain: string
    block_ts: number
}

export interface IGasInfo {
    LastBlock: string
    SafeGasPrice: string
    ProposeGasPrice: string
    FastGasPrice: string
    suggestBaseFee: string
    gasUsedRatio: string
}

export interface IMetrics {
    gas: number
    last_updated: number
    metrics: IMetricsChainMap
}

export interface IMetricsChainMap {
    [chainName: string]: IChainMetrics
}

export interface IChainMetrics {
    chain_stats: any
    apps_counters: IAppCountersMap
}

export interface IAppCountersMap {
    [appName: string]: IAppCounters | null
}

export interface IAppCounters {
    [contractAddress: AddressType]: IAddressCounters
}

export interface IAddressCounters {
    gas_usage_count: string
    token_transfers_count: string
    transactions_count: string
    validations_count: string
}

export interface IStats {
    schains_number: number
    summary: IStatsMap
    schains: { [schainName: string]: IStatsMap }
}

export interface IStatsMap {
    total: IStatsData
    total_7d: IStatsData
    total_30d: IStatsData
    group_by_month: any
}

export interface IStatsData {
    tx_count_total: number
    block_count_total: number
    gas_total_used: number
    gas_fees_total_gwei: number
    gas_fees_total_eth: number
    gas_fees_total_usd: number
    users_count_total: number
}

export interface IAppId {
    app: string
    chain: string
    totalTransactions?: number
}

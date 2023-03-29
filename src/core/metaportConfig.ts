/**
 * @license
 * SKALE Bridge UI
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @file metaportConfig.ts
 * @copyright SKALE Labs 2023-Present
 */

import { dataclasses, interfaces } from '@skalenetwork/metaport';
import { METAPORT_CONFIG, DEFAULT_ERC20_DECIMALS } from './constants';


/**
Retrieves token data from the Metaport configuration object based on the provided parameters.
@param chainName - the name of the chain for the token
@param tokenType - the type of token being queried
@param tokenKeyname - the keyname of the token being queried
@returns the token object if found in the Metaport configuration, undefined otherwise
*/
function getTokenDataFromMetaportTokens(
    chainName: string,
    tokenType: dataclasses.TokenType,
    tokenKeyname: string
): interfaces.Token | undefined {
    const tokens = METAPORT_CONFIG.tokens;
    if (tokens[chainName] &&
        tokens[chainName][tokenType] &&
        tokens[chainName][tokenType][tokenKeyname]) {
        return tokens[chainName][tokenType][tokenKeyname];
    }
}


/**
Retrieves token data from the Metaport configuration object based on the provided parameters.
@param fromChainName - the name of the source chain for the token
@param toChainName - the name of the destination chain for the token (optional)
@param tokenType - the type of token being queried (erc20, erc721, etc.)
@param tokenKeyname - the keyname of the token being queried
@returns the token object if found in the Metaport configuration, undefined otherwise
*/
function getTokenDataFromMetaportConfig(
    fromChainName: string,
    toChainName: string | undefined,
    tokenType: dataclasses.TokenType,
    tokenKeyname: string
): interfaces.Token | undefined {
    let configToken;
    configToken = getTokenDataFromMetaportTokens(fromChainName, tokenType, tokenKeyname);
    if (configToken) return configToken;
    if (toChainName) {
        configToken = getTokenDataFromMetaportTokens(toChainName, tokenType, tokenKeyname);
        if (configToken) return configToken;
    } else {
        Object.keys(METAPORT_CONFIG.tokens).find((chainName: string) => {
            configToken = getTokenDataFromMetaportTokens(chainName, tokenType, tokenKeyname);
            if (configToken) return configToken;
        });
    }
    return configToken;
}


/**
Retrieves the decimal value for a token from the Metaport configuration object based on the provided parameters.
If the token is not found in the configuration, it returns the default decimal value.
@param fromChainName - the name of the source chain for the token
@param toChainName - the name of the destination chain for the token (optional)
@param tokenType - the type of token being queried
@param tokenKeyname - the keyname of the token being queried
@returns the decimal value for the token or the default decimal value if the token is not found
*/
export function getTokenDecimals(
    fromChainName: string,
    toChainName: string | undefined,
    tokenType: dataclasses.TokenType,
    tokenKeyname: string
): string {
    const tokenData = getTokenDataFromMetaportConfig(
        fromChainName,
        toChainName,
        tokenType,
        tokenKeyname
    )
    return tokenData && tokenData.decimals ? tokenData.decimals : DEFAULT_ERC20_DECIMALS;
}

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
 * @file ChainLogo.tsx
 * @copyright SKALE Labs 2022-Present
 */

import Jazzicon from "react-jazzicon";


function hashCode(str: string) {
  let hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function getPseudoRandomNumber(
  seed: string,
  min: number = 1000000000,
  max: number = 100000000000000
): number {
  const seedValue = hashCode(seed);
  const range = max - min;
  const rng = Math.sin(seedValue) * 10000;
  const randomInt = min + Math.floor((rng - Math.floor(rng)) * range);
  return randomInt;
}


export default function ChainLogo(props: {
  chainName: string,
  app?: string,
  className?: string,
  logos: any
}) {

  function getIcon(schainName: string, app?: string): any {
    let iconPath = schainName;
    if (app) {
      iconPath += `-${app}`;
    }

    iconPath = iconPath.replace(/-([a-z])/g, (_, g) => g.toUpperCase())

    let pngPath = iconPath + '.png';
    let gifPath = iconPath + '.gif';
    let svgPath = iconPath + '.svg';
    if (props.logos[pngPath]) {
      iconPath = pngPath;
    } else if (props.logos[gifPath]) {
      iconPath = gifPath;
    } else if (props.logos[svgPath]) {
      iconPath = svgPath;
    }
    const iconModule = props.logos[iconPath]
    if (iconModule) {
      return <img className={props.className} src={iconModule.default ?? iconModule} />
    }
    return <div className="br__tileDefaultLogo">
      <Jazzicon diameter={80} svgStyles={{
        width: '100%',
        height: '100%',
      }} seed={getPseudoRandomNumber(schainName)} />
    </div>;
  }
  return getIcon(props.chainName, props.app)
}

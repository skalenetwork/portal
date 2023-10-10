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
 * @file Admin.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { useEffect } from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { useParams } from "react-router-dom";

import { cmn, cls, type MetaportCore, getChainAlias } from "@skalenetwork/metaport";

export default function Admin(props: { mpc: MetaportCore }) {
  let { name } = useParams();
  name = name ?? "";
  const alias = getChainAlias(props.mpc.config.skaleNetwork, name);

  useEffect(() => {}, []);

  return (
    <Container maxWidth="md">
      <Stack spacing={0}>
        <div className={cls(cmn.flex)}>
          <h2 className={cls(cmn.nom, cmn.flexg)}>Manage {alias}</h2>
        </div>
        <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec)}>
          Manage your SKALE Chain
        </p>
        <div></div>
      </Stack>
    </Container>
  );
}

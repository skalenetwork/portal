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
 * @file TermsModal.ts
 * @copyright SKALE Labs 2022-Present
 */

import React, { type Dispatch, type SetStateAction } from "react";
import { useLocation } from "react-router-dom";

import Modal from "@mui/material/Modal";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

import {
  type MetaportCore,
  SkPaper,
  cls,
  cmn,
  styles,
} from "@skalenetwork/metaport";

import { MAINNET_CHAIN_NAME, BRIDGE_PAGES } from "../../core/constants";
import TermsOfService from "../Terms/terms-of-service.mdx";
import logo from "../../assets/skale_lg.svg";

const style = {
  width: "100vw",
  height: "100vh",
  outline: "none",
  backdropFilter: "blur(5px)",
  WebkitBackdropFilter: "blur(10px)",
};

export default function TermsModal(props: {
  mpc: MetaportCore;
  termsAccepted: boolean;
  setTermsAccepted: Dispatch<SetStateAction<boolean>>;
}) {
  const location = useLocation();
  const [scrolled, setScrolled] = React.useState<boolean>(false);

  function getAgreeButtonText(): string {
    if (!scrolled) return "⬆️ Read Terms of Service to continue ⬆️";
    return "Agree to terms";
  }

  function isBridgePage(): boolean {
    return (
      BRIDGE_PAGES.some(
        (pathname) =>
          location.pathname === pathname ||
          location.pathname.includes(pathname),
      ) || location.pathname === "/"
    );
  }

  function handleTermsScroll(e: any): void {
    const diff =
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight;
    const bottom = Math.abs(diff) < 15;
    setScrolled(bottom);
  }
  if (props.termsAccepted || !isBridgePage()) return null;
  return (
    <Modal open={!props.termsAccepted} className="br__modal">
      <div style={style} className={cls(cmn.flex, cmn.flexcv)}>
        <Container maxWidth="md">
          <SkPaper gray>
            <SkPaper>
              <div className={cls(cmn.mtop20, cmn.mleft20)}>
                <img
                  src={logo}
                  className={cls(cmn.mbott20, "logo")}
                  alt="logo"
                />
                {props.mpc.config.skaleNetwork !== MAINNET_CHAIN_NAME ? (
                  <p className={cls(cmn.p, cmn.p2)}>
                    ❗ THIS IS A TEST WEBSITE
                  </p>
                ) : (
                  <div></div>
                )}
                <p className={cls(cmn.p, cmn.p2, cmn.nom)}>
                  🖥️ For Desktop Use Only <br />
                  <br />
                  SKALE will NEVER ask you for your seed phrase or private keys.{" "}
                  <br />
                  <br />
                  Please make sure you are connected to the correct bridge and
                  only use this official link:{" "}
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://bridge.skale.space/"
                  >
                    https://bridge.skale.space/
                  </Link>
                  <br />
                  Before you use the SKALE Bridge, you must review the terms of
                  service carefully and confirm below.
                </p>
              </div>
              <SkPaper background="transparent">
                <div
                  id="terms"
                  className={cls("br__modalScroll", cmn.mtop20, cmn.mleft10)}
                  style={{ paddingRight: "20px" }}
                  onScroll={handleTermsScroll}
                >
                  <TermsOfService />
                </div>
              </SkPaper>
            </SkPaper>
            <Button
              onClick={() => {
                props.setTermsAccepted(true);
              }}
              variant="contained"
              disabled={!scrolled}
              className={cls(styles.btnAction, cmn.mtop10)}
              size="large"
            >
              {getAgreeButtonText()}
            </Button>
          </SkPaper>
        </Container>
      </div>
    </Modal>
  );
}

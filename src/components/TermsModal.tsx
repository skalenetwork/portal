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
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import DesktopMacRoundedIcon from '@mui/icons-material/DesktopMacRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import GradingRoundedIcon from '@mui/icons-material/GradingRounded';
import {
  type MetaportCore,
  SkPaper,
  cls,
  cmn,
  styles,
} from "@skalenetwork/metaport";

import { BRIDGE_PAGES } from "../core/constants";
import TermsOfService from "./Terms/terms-of-service.mdx";
import logo from "../assets/skale_lg.svg";

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
          <SkPaper gray className='br__modalWrap'>
            <img
              src={logo}
              className={cls(cmn.mbott20, cmn.mtop10, cmn.mleft5, "logo")}
              alt="logo"
            />
            <Box >
              <Grid container spacing={2}>
                <Grid item md={3} sm={6} xs={12}>
                  <SkPaper className={cls(styles.fullHeight, 'modalBlock modalBlock1')} >
                    <div className={cls(cmn.m10)}>
                      <DesktopMacRoundedIcon style={{ color: 'rgb(163 96 255)' }} />
                      <p className={cls(cmn.p, cmn.p2, cmn.p700, cmn.mtop5)}>
                        This website is for Desktop Use Only
                      </p>
                    </div>
                  </SkPaper>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <SkPaper className={cls(styles.fullHeight, 'modalBlock modalBlock2')} >
                    <div className={cls(cmn.m10)}>
                      <KeyRoundedIcon style={{ color: 'rgb(238 195 0)' }} />
                      <p className={cls(cmn.p, cmn.p2, cmn.p700, cmn.mtop5)}>
                        SKALE will NEVER ask you for your seed phrase or private keys
                      </p>
                    </div>
                  </SkPaper>
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                  <SkPaper className={cls(styles.fullHeight, 'modalBlock modalBlock3')} >
                    <div className={cls(cmn.m10)}>
                      <LockRoundedIcon style={{ color: '#14e96a' }} />
                      <p className={cls(cmn.p, cmn.p2, cmn.p700, cmn.mtop5)}>
                        Make sure you are connected to the correct bridge and only use this official link:
                        <br />
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://bridge.skale.space/"
                        >
                          https://bridge.skale.space/
                        </Link>
                      </p>
                    </div>
                  </SkPaper>
                </Grid>
              </Grid>
            </Box>
            <SkPaper className={cls(cmn.mtop20, 'br__modalInner modalBlock modalBlock4')} >
              <div className={cls(cmn.m10, 'scrollable')}>
                <GradingRoundedIcon style={{ color: '#329cff' }} />
                <p className={cls(cmn.p, cmn.p3, cmn.pSec, cmn.p700, cmn.mtop10, 'modalP')}>
                  Before you use the SKALE Bridge, you must review the terms of
                  service carefully and confirm below.
                </p>
                <div onScroll={handleTermsScroll} className={cls("br__modalScroll", cmn.mtop20)}>
                  <div
                    id="terms"
                    style={{ paddingRight: "20px" }}
                  >
                    <TermsOfService />
                  </div>
                </div>
              </div>
            </SkPaper>
            <Button
              onClick={() => {
                props.setTermsAccepted(true);
              }}
              variant="contained"
              disabled={!scrolled}
              className={cls(styles.btnAction, cmn.mtop20)}
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

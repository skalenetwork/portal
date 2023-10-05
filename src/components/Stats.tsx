import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { cmn, cls } from "@skalenetwork/metaport";

import { DASHBOARD_URL } from "../core/constants";

export default function Stats() {
  return (
    <Container maxWidth="lg">
      <Stack spacing={0}>
        <div className={cls(cmn.flex)}>
          <h2 className={cls(cmn.nom)}>Stats</h2>
        </div>
        <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec)}>
          SKALE Network statistics
        </p>
        <iframe
          style={{
            height: "calc(100vh - 170px)",
            border: "none",
            margin: "0 -15px",
          }}
          src={DASHBOARD_URL}
        ></iframe>
      </Stack>
    </Container>
  );
}

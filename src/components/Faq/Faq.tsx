import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import { cmn, cls } from "@skalenetwork/metaport";

import FaqAccordion from "../FaqAccordion";

export default function Faq() {
  return (
    <Container maxWidth="md">
      <Stack spacing={0}>
        <div className={cls(cmn.flex)}>
          <h2 className={cls(cmn.nom)}>FAQ</h2>
        </div>
        <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec)}>
          Common questions about SKALE Bridge
        </p>
        <div className={cmn.mtop20}>
          <FaqAccordion />
        </div>
      </Stack>
    </Container>
  );
}

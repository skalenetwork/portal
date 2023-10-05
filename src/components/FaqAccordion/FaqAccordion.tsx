import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { cls, cmn } from "@skalenetwork/metaport";

import { FAQ } from "../../core/constants";

export default function FaqAccordion() {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <div>
      {FAQ.map((question: any, index: number) => (
        <Accordion
          key={index}
          expanded={expanded === `panel${index}`}
          onChange={handleChange(`panel${index}`)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id={"panel1bh-header-" + index}
          >
            <p className={cls(cmn.p, cmn.p2, cmn.pPrim, cmn.mtop5, cmn.mbott5)}>
              {question.question}
            </p>
          </AccordionSummary>
          <AccordionDetails>
            <p className={cls(cmn.p, cmn.p2, cmn.pSec, cmn.mleft20, cmn.mri20)}>
              {question.answer}
            </p>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

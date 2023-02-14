import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


import { FAQ } from '../../core/constants';

export default function FaqAccordion() {
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    return (
        <div>
            {FAQ.map((question: any, index: number) => (
                <Accordion expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id={"panel1bh-header-" + index}
                    >
                        <Typography sx={{ width: '100%', flexShrink: 0 }}>
                            {question.question}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            {question.answer}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
}
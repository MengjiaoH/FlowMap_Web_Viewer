import React from 'react'
import { observer } from "mobx-react";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import SeedBox from './FilterComponents/SeedBox'

const Filter = () => {
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                >
                    <Typography sx={{ width: '70%', flexShrink: 0 }}>
                        Extract Subset
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <SeedBox/>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export default observer(Filter)
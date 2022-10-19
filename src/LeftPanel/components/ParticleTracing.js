import React, {useContext, useState, useEffect} from 'react'
import { observer } from "mobx-react";
import Store from '../../Context/RootStore'
import InferFromModel from './ParticleTracing/InferFromModel'
// import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TimelineIcon from '@mui/icons-material/Timeline';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
// import FilledInput from '@mui/material/FilledInput';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import InputLabel from '@mui/material/InputLabel';
// import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';

const ParticleTracing = () => {
    const store = useContext(Store);
    const [expanded, setExpanded] = useState(false);
    const [num_fm, setNumFM] = useState(0);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const startTrace = () => {
        InferFromModel(store);
        store.renderStore.Update_Trajs();
    }

    useEffect(() => {
        setNumFM(store.modelStore.num_fm);
    }, [store.modelStore.num_fm])

    const changeNumFM = (event) =>{
        setNumFM(event.target.value);
        store.renderStore.Update_NumFM(event.target.value);

    }

    return (
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                >
                    <Typography sx={{ width: '70%', flexShrink: 0 }}>
                        Particle Tracing
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '100%' },
                        }}
                        noValidate
                        autoComplete="off"
                        >
                        <Button component="label" variant="outlined" startIcon={<TimelineIcon />} size="small" onClick={startTrace}> Start Tracing 
                        </Button>
                        <FormControl fullWidth sx={{ m: 1 }}>
                            <TextField id="outlined-basic" label="#Number of Flow Maps" variant="outlined" size="small" inputProps={{ min: 0, style: { fontSize: 12 } }}
                                    value={num_fm} 
                                    onChange={changeNumFM} 
                            />
                        </FormControl>
                            
                </Box>

                </AccordionDetails>
            </Accordion>
        
    )
}

export default observer(ParticleTracing)
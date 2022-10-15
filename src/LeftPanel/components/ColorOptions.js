import React, {useContext, useState, useEffect} from 'react'
import { observer } from "mobx-react";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import CheckIcon from '@mui/icons-material/Check';
// import IconButton from '@mui/material/IconButton';
// import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

import Store from '../../Context/RootStore'
import ConstantColor from './ColorOptionsComponents/ConstantColor';
import ColorByAttributes from './ColorOptionsComponents/ColorByAttributes';
import interpolate_color from './ColorOptionsComponents/InterpolateColor';

const ColorOptions = () => {
    const store = useContext(Store);
    const [expanded, setExpanded] = React.useState(false);
    const [value, setValue] = React.useState('1');
    const [constant_color, setConstantColor] = useState('#277BC0');

    const handleChange = (panel) => (_, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
   
    const handleTapChange = (_, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        setConstantColor(store.colorOptionsStore.constant_color);
    }, [store.colorOptionsStore.constant_color])

    const handleColorChange = () =>{
        console.log("value", value);
        if (value === '1'){
            if (constant_color.hex){
                // console.log("color", constant_color.hex);
                store.renderStore.SetConstantColor(constant_color.hex, store.pipeline_selected);
                console.log("color_array", store.renderStore.colors);
            }
        }
        if (value === '2'){
            // color by attribute values
            console.log("interpolate color")
            interpolate_color(store);
            console.log("color_array", store.renderStore.colors)
        }

    }
    return (
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            >
                <Typography sx={{ width: '70%', flexShrink: 0 }}>
                    Color Options
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box sx={{ width: '100%', typography: 'body2' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleTapChange} aria-label="lab API tabs example">
                            <Tab label="Constant Color Picker" value="1" wrapped />
                            <Tab label="Color By Attributes" value="2" wrapped/>
                        </TabList>
                        </Box>
                        <TabPanel value="1">
                            <ConstantColor/>
                        </TabPanel>
                        <TabPanel value="2">
                            <ColorByAttributes/>
                        </TabPanel>
                    </TabContext>
                    
                    <Button component="label" variant="outlined" startIcon={<CheckIcon />} size="small" onClick={handleColorChange}>Apply Color
                    </Button>
                </Box>
                    
            </AccordionDetails>
        </Accordion>
    )
}

export default observer(ColorOptions)
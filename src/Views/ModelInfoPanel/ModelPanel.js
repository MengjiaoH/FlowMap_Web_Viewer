import React, {useMemo, useState} from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ParticleTraceTab from "./ParticleTraceTab";
import ModelInfoPanel from "./ModelInfoPanel";
import {Divider, Typography} from "@mui/material";

function TabPanel(props) {
    const {children, value, index} = props;

    return (<div
        role="tabpanel"
        hidden={value !== index}
        id={`model_info_tab_panel_${index}`}
        aria-labelledby={`model_info_tab_${index}`}
    >
        {value === index && (<Box sx={{p: 3}}>
            {children}
        </Box>)}
    </div>);
}

function ModelPanel(props) {
    const [value, setValue] = useState(0)

    const tabChange = useMemo(() => {
        return function (event, new_value) {
            setValue(new_value)
        }
    }, [])

    return (<div>
        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
            <Tabs value={value} onChange={tabChange} aria-label="basic tabs example" className="drag-handle">
                <Tab label="Model Info" id={'model_info_tab_0'}
                     aria-controls={'model_info_tab_panel_0'}/>

                <Tab label="Particle Trace" id={'model_info_tab_1'}
                     aria-controls={'model_info_tab_panel_1'}/>
            </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
            <ModelInfoPanel/>
        </TabPanel>

        <TabPanel value={value} index={1}>
            <ParticleTraceTab/>
        </TabPanel>


    </div>);

}

export default ModelPanel;
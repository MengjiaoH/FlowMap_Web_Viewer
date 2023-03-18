import React, {useContext, useMemo, useState} from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import VolumeConfigPanel from "./VolumeConfigPanel";
import {global_data} from "../../Context/DataContainer";
import {observer} from "mobx-react";
import TFEditor from "./TFEditor";

function TabPanel(props) {
    const {children, value, index} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`volume_config_tab_panel_${index}`}
            aria-labelledby={`volume_config_tab_${index}`}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function VolumePanel(props) {
    const g_data = useContext(global_data)
    const loaded = useMemo(() => {
        return g_data.volume_config.loaded
    }, [g_data.volume_config.loaded])
    const [value, setValue] = useState(0)

    const tabChange = useMemo(() => {
        return function (event, new_value) {
            setValue(new_value)
        }
    }, [])

    return (
        <div>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={value} onChange={tabChange} aria-label="basic tabs example" className="drag-handle">
                    <Tab label="Volume Config" id={'volume_config_tab_0'} aria-controls={'volume_config_tab_panel_0'}/>
                    <Tab label="Transfer Function"
                         id={'volume_config_tab_1'}
                         aria-controls={'volume_config_tab_panel_1'}
                         disabled={!loaded}/>
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <VolumeConfigPanel/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <TFEditor/>
            </TabPanel>
        </div>
    );
}

export default observer(VolumePanel)
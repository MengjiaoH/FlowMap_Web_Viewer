import React, {useMemo, useState} from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import SeedPlacement from "./SeedPlacement";
import SeedboxConfig from "./SeedboxConfig";

function TabPanel(props) {
    const { children, value, index} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`seed_config_tab_panel_${index}`}
            aria-labelledby={`seed_config_tab_${index}`}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function SeedPanel(props) {
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
                    <Tab label="Seed Placement" id={'seed_config_tab_0'} aria-controls={'seed_config_tab_panel_0'}/>
                    <Tab label="Seedbox Config" id={'seed_config_tab_1'} aria-controls={'seed_config_tab_panel_1'}/>
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <SeedPlacement />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <SeedboxConfig />
            </TabPanel>
        </div>
    );
}

export default SeedPanel
import React, {useMemo, useState} from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import LineStyleForm from "./LineStyleForm";

function TabPanel(props) {
    const {children, value, index} = props;

    return (<div
            role="tabpanel"
            hidden={value !== index}
            id={`line_style_config_tab_panel_${index}`}
            aria-labelledby={`line_style_config_tab_${index}`}
        >
            {value === index && (<Box sx={{p: 3}}>
                    {children}
                </Box>)}
        </div>);
}

function LineStylePanel(props) {
    const [value, setValue] = useState(0)

    const tabChange = useMemo(() => {
        return function (event, new_value) {
            setValue(new_value)
        }
    }, [])

    return (<div>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={value} onChange={tabChange} aria-label="basic tabs example" className="drag-handle">
                    <Tab label="Line Style Config" id={'line_style_config_tab_0'}
                         aria-controls={'line_style_config_tab_panel_0'}/>
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <LineStyleForm/>
            </TabPanel>
        </div>);

}

export default LineStylePanel
import {observer} from "mobx-react";
import FormControl from "@mui/material/FormControl";
import {Divider, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import React, {useContext, useMemo} from "react";
import Box from "@mui/material/Box";
import {global_data} from "../../Context/DataContainer";

function ModelInfoPanel(props) {
    const g_data = useContext(global_data)
    const bounds = useMemo(() => {
        return g_data.modelinfo.bounds
    }, [g_data.modelinfo.bounds])

    const start_cycle = useMemo(() => {
        return g_data.modelinfo.start_cycle
    }, [g_data.modelinfo.start_cycle])

    const stop_cycle = useMemo(() => {
        return g_data.modelinfo.stop_cycle
    }, [g_data.modelinfo.stop_cycle])

    const interval = useMemo(() => {
        return g_data.modelinfo.interval
    }, [g_data.modelinfo.interval])

    const step_size = useMemo(() => {
        return g_data.modelinfo.step_size
    }, [g_data.modelinfo.step_size])

    const loadJsonData = (e) =>  {
        g_data.modelinfo.loadDataset(e.target.value)
    }

return <FormControl variant="filled" sx={{ m: 1, width:"100%"}}>
    <InputLabel id="demo-simple-select-label">Model</InputLabel>
    <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={g_data.modelinfo.dataset}
        label="Model"  onChange={loadJsonData}
    >

        <MenuItem value={"ABC"}>ABC</MenuItem>
        <MenuItem value={"Hurricane"}>Hurricane</MenuItem>
    </Select>
    <Typography component="div">
        <Box sx={{textAlign: 'left', m: 1}}>
            <Typography variant="h6" fontFamily='sans-serif'>Bounds: </Typography>
        </Box>
        <Box sx={{textAlign: 'left', ml: 4}}>
            <Typography variant="body1" fontFamily='sans-serif'>X Range:[{bounds[0]}, {bounds[1]}]</Typography>
            <Typography variant="body1" fontFamily='sans-serif'>Y Range:[{bounds[2]}, {bounds[3]}]</Typography>
            <Typography variant="body1" fontFamily='sans-serif'>Z Range:[{bounds[4]}, {bounds[5]}]</Typography>
        </Box>
        <Divider/>
        <Box sx={{textAlign: 'left', m: 1}}>
            <Typography variant="h6" fontFamily='sans-serif'>Flow Maps: </Typography>
        </Box>
        <Box sx={{textAlign: 'left', ml: 4}}>
            <Typography variant="body1" fontFamily='sans-serif'>Start Cycle: {start_cycle}</Typography>
            <Typography variant="body1" fontFamily='sans-serif'>Stop Cycle: {stop_cycle}</Typography>
            <Typography variant="body1" fontFamily='sans-serif'>Interval: {interval}</Typography>
            <Typography variant="body1" fontFamily='sans-serif'>Step Size: {step_size}</Typography>
        </Box>
    </Typography>
</FormControl>

}

export default observer(ModelInfoPanel)
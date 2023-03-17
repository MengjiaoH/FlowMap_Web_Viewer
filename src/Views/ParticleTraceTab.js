import {observer} from "mobx-react";
import React, {useContext} from "react";
import {global_data} from "../Context/DataContainer";
import FormLabel from "@mui/material/FormLabel";
import {Typography} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Form from "react-bootstrap/Form";
import Button from "@mui/material/Button";
import BoltIcon from '@mui/icons-material/Bolt';
import TimelineIcon from '@mui/icons-material/Timeline';
import FormControl from "@mui/material/FormControl";

function ParticleTraceTab(props) {

    const g_data = useContext(global_data)

    const setNFlowMaps = (e) => {
        g_data.particle_trace_config.setNFlowMap(Number(e.target.value))
    }

    const traceParticles = () => {
        g_data.trajectories.traceParticles(g_data.particle_trace_config.fakeTrace)
    }

    return <FormControl>
        <Box component="form" sx={{'& > :not(style)': {m: 1, width: '100%'},}} noValidate autoComplete="off">
            <TextField type="number" id="n_flow_map_input" label="# of flow maps" variant="outlined" size="small"
                       inputProps={{min: 0, style: {fontSize: 12}}}
                       value={g_data.particle_trace_config.n_flow_map} onChange={setNFlowMaps}
            />
        </Box>
        <Box component="form" sx={{'& > :not(style)': {m: 1, width: '100%'},}} noValidate autoComplete="off">
            <Button component="label"
                    variant="outlined"
                    startIcon={<BoltIcon/>}
                    endIcon={<TimelineIcon />}
                    size="small"
                    onClick={traceParticles}>
                Trace Particles
            </Button>
        </Box>


    </FormControl>
}

export default observer(ParticleTraceTab)
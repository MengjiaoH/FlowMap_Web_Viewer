import {observer} from "mobx-react";
import React, { useContext} from "react";
import {global_data} from "../../Context/DataContainer";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import BoltIcon from '@mui/icons-material/Bolt';
import TimelineIcon from '@mui/icons-material/Timeline';
import FormControl from "@mui/material/FormControl";
import TraceModel from "../../ModelInference/ModelInference";
import DeleteIcon from "@mui/icons-material/Delete";

function ParticleTraceTab(props) {

    const g_data = useContext(global_data)

    const setNFlowMaps = (e) => {
        g_data.modelinfo.setNFlowMaps(Number(e.target.value))
    }

    const traceParticles = () => {
        TraceModel(g_data)
    }

    const deleteTraces = () => {
        g_data.trajectories.deleteTrace()
    }


    return <FormControl>
        <Box component="form" sx={{'& > :not(style)': {m: 1, width: '100%'},}} noValidate autoComplete="off">
            <TextField type="number" id="n_flow_map_input" label="# of flow maps" variant="outlined" size="small"
                       inputProps={{min: 0, style: {fontSize: 12}}}
                       value={g_data.modelinfo.n_flow_maps} onChange={setNFlowMaps}
            />
        </Box>
        <Box component="form" sx={{'& > :not(style)': {m: 1, width: '100%'},}} noValidate autoComplete="off">
            <Button component="label"
                    variant="outlined"
                    startIcon={<BoltIcon/>}
                    endIcon={<TimelineIcon/>}
                    size="small"
                    onClick={traceParticles}>
                Trace Particles
            </Button>
            <Button component="label" variant="outlined" startIcon={<DeleteIcon/>} onClick={deleteTraces}
                    size="small"> Delete Traces
            </Button>
        </Box>




    </FormControl>
}

export default observer(ParticleTraceTab)
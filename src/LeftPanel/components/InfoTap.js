import React, {useContext, useState, useEffect} from 'react'
import { observer } from "mobx-react";
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import Store from '../../Context/RootStore'

const InfoTap = () => {
    const store = useContext(Store);
    const [x_bounds, setBoundX] = useState([0, 0]);
    const [y_bounds, setBoundY] = useState([0, 0]);
    const [z_bounds, setBoundZ] = useState([0, 0]);
    const [start_cycle, setStart] = useState(0);
    const [stop_cycle, setStop] = useState(0);
    const [interval, setInterval] = useState(0);
    const [step_size, setStepSize] = useState(0);
    const [mode, setMode] = useState('');
    const [num_models, setNumModels] = useState(0);




    useEffect(() => {
        const dataBounds = store.modelStore.global_domain;
        setBoundX([dataBounds[0], dataBounds[3]]);
        setBoundY([dataBounds[1], dataBounds[4]]);
        setBoundZ([dataBounds[2], dataBounds[5]]);

    }, [store.modelStore.global_domain])

    useEffect(() =>{
        setStart(store.modelStore.start_cycles[0]);
    }, [store.modelStore.start_cycle])

    useEffect(() =>{
        const last = store.modelStore.stop_cycles.length;
        setStop(store.modelStore.stop_cycles[last-1]);
    }, [store.modelStore.stop_cycle])

    useEffect(() =>{
        setInterval(store.modelStore.interval);
    }, [store.modelStore.interval])

    useEffect(() =>{
        setStepSize(store.modelStore.step_size);
    }, [store.modelStore.step_size])

    useEffect(() =>{
        setNumModels(store.modelStore.num_models);
    }, [store.modelStore.num_models])

    // useEffect(() =>{
    //     setMode(store.modelStore.mode);
    // }, [store.modelStore.mode])

    return (
        <Typography component="div">
            <Box sx={{ textAlign: 'left', m: 1 }}>
                <Typography variant="h6" fontFamily='sans-serif'>Bounds: </Typography>
            </Box>
            <Box sx={{ textAlign: 'left', m: 1 }}>
                <Typography variant="body1" fontFamily='sans-serif'>X Range:[{x_bounds[0]}, {x_bounds[1]}]</Typography>
                <Typography variant="body1" fontFamily='sans-serif'>Y Range:[{y_bounds[0]}, {y_bounds[1]}]</Typography>
                <Typography variant="body1" fontFamily='sans-serif'>Z Range:[{z_bounds[0]}, {z_bounds[1]}]</Typography>
            </Box>
            <Divider/>
            <Box sx={{ textAlign: 'left', m: 1 }}>
                <Typography variant="h6" fontFamily='sans-serif'>Flow Maps: </Typography>
            </Box>
            <Box sx={{ textAlign: 'left', m: 1 }}>
                <Typography variant="body1" fontFamily='sans-serif'>Start Cycle: {start_cycle}</Typography>
                <Typography variant="body1" fontFamily='sans-serif'>Stop Cycle:  {stop_cycle}</Typography>
                <Typography variant="body1" fontFamily='sans-serif'>Interval:    {interval}</Typography>
                <Typography variant="body1" fontFamily='sans-serif'>Step Size:   {step_size}</Typography>
                <Typography variant="body1" fontFamily='sans-serif'>Number of Models:   {num_models}</Typography>
                {/* <Typography variant="body1" fontFamily='sans-serif'>Training Data Approach:   {step_size}</Typography> */}
            </Box>
        </Typography>
        
    )
}

export default observer(InfoTap)
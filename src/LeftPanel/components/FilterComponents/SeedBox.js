import React, {useContext, useState, useEffect} from 'react'
import { observer } from "mobx-react";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import UpdateIcon from '@mui/icons-material/Update';

import Store from '../../../Context/RootStore'

const SeedBox = () => {
    const store = useContext(Store);
    const [range_x, setX] = useState([0, 0]);
    const [range_y, setY] = useState([0, 0]);
    const [range_z, setZ] = useState([0, 0]);
    const [bbox_x, setBboxX] = useState([0, 0]);
    const [bbox_y, setBboxY] = useState([0, 0]);
    const [bbox_z, setBboxZ] = useState([0, 0]);


    const changeLowerX = (event) => {
        setX([event.target.value, range_x[1]]);
    }
    const changeUpperX = (event) => {
        setX([range_x[0], event.target.value]);
    }
    const changeLowerY = (event) => {
        setY([event.target.value, range_y[1]]);
    }
    const changeUpperY = (event) => {
        setY([range_y[0], event.target.value]);
    }
    const changeLowerZ = (event) => {
        setZ([event.target.value, range_z[1]]);
    }
    const changeUpperZ = (event) => {
        setZ([range_z[0], event.target.value]);
    }

    useEffect(() => {
        const bounds = store.modelStore.global_domain;
        setBboxX([bounds[0], bounds[3]]);
        setBboxY([bounds[1], bounds[4]]);
        setBboxZ([bounds[2], bounds[5]]);

    }, [store.modelStore.global_domain])

    const addOneSeedBox = () => {
        // console.log("add a seed box");
        // add the seed box dimension and position to the array
        const dims = [+range_x[1] - +range_x[0], +range_y[1] - +range_y[0], +range_z[1] - +range_z[0]];
        const pos = [+range_x[0] + dims[0]/ 2, +range_y[0] + dims[1]/2, +range_z[0] + dims[2]/2];
        store.seedBoxStore.AddOneSeedBox(dims[0], dims[1], dims[2], pos[0], pos[1], pos[2]);
        // add to pipeline
        const index = store.seedBoxStore.num_seed_boxes;
        // console.log("num of seed boxes", index)
        store.AddToPipeline("Seed Box " + index, dims, pos);
    };

    const updateSeedBox = () => {
        // console.log("update seed box");
        const dims = [+range_x[1] - +range_x[0], +range_y[1] - +range_y[0], +range_z[1] - +range_z[0]];
        const pos = [+range_x[0] + dims[0]/ 2, +range_y[0] + dims[1]/2, +range_z[0] + dims[2]/2];
        // update seed box store for rendering seed box
        store.seedBoxStore.EditSeedBoxPos(pos, store.pipeline_selected-1);
        store.seedBoxStore.EditSeedBoxDim(dims, store.pipeline_selected-1);
        // update pipeline for rendering text info
        store.UpdatePipelineBoxPos(store.pipeline_selected, pos);
        store.UpdatePipelineBoxDim(store.pipeline_selected, dims);
    };

    useEffect(() => {
        if (store.pipeline_selected > 0){
            const dims = store.pipeline_box_dims[store.pipeline_selected];
            const pos = store.pipeline_box_pos[store.pipeline_selected];
            setX([pos[0] - dims[0]/2, pos[0] + dims[0]/2]);
            setY([pos[1] - dims[1]/2, pos[1] + dims[1]/2]);
            setZ([pos[1] - dims[1]/2, pos[1] + dims[1]/2]);
        }

    }, [store.pipeline_selected, store.pipeline_box_dims, store.pipeline_box_pos])
    

    return (
        
        <Box sx={{ width: 450, p:1}}>
            <Stack direction="row" alignItems="center" gap={0.5}>
                <Typography variant="body1">X Bounds: </Typography>
                <FormControl onChange={changeLowerX} sx={{ minWidth:50}}>
                        <TextField
                        sx={{ width: 85}}
                            value = {range_x[0]}
                            id="filled-number"
                            label="lower"
                            type="number"
                            InputProps={{ inputProps: { min: bbox_x[0], max: bbox_x[1], step:0.1} }}
                            variant="filled"
                        />
                </FormControl>
                <FormControl onChange={changeUpperX} sx={{ minWidth:50}}>
                        <TextField
                        sx={{ width: 85}}
                            value = {range_x[1]}
                            id="filled-number"
                            label="upper"
                            type="number"
                            InputProps={{ inputProps: { min: bbox_x[0], max: bbox_x[1], step:0.1} }}
                            variant="filled"
                        />
                </FormControl>
            </Stack>
            <Stack direction="row" alignItems="center" gap={0.5}>
                <Typography variant="body1">Y Bounds: </Typography>
                <FormControl onChange={changeLowerY} sx={{ minWidth:50}}>
                        <TextField
                        sx={{ width: 85}}
                            value = {range_y[0]}
                            id="filled-number"
                            label="lower"
                            type="number"
                            InputProps={{ inputProps: { min: bbox_y[0], max: bbox_y[1], step:0.1} }}
                            variant="filled"
                        />
                </FormControl>
                <FormControl onChange={changeUpperY} sx={{ minWidth:50}}>
                        <TextField
                        sx={{ width: 85}}
                            value = {range_y[1]}
                            id="filled-number"
                            label="upper"
                            type="number"
                            InputProps={{ inputProps: { min: bbox_y[0], max: bbox_y[1], step:0.1} }}
                            variant="filled"
                        />
                </FormControl>
                <IconButton color="primary" aria-label="add seed box" component="label" onClick={addOneSeedBox}>
                    <AddBoxIcon />
                </IconButton>
                <IconButton color="primary" aria-label="add seed box" component="label" onClick={updateSeedBox}>
                    <UpdateIcon />
                </IconButton>
            </Stack>
            <Stack direction="row" alignItems="center" gap={0.5} >
                <Typography variant="body1">Z Bounds: </Typography>
                <FormControl onChange={changeLowerZ} sx={{ minWidth:50}}>
                        <TextField
                        sx={{ width: 85}}
                            value = {range_z[0]}
                            id="filled-number"
                            label="lower"
                            type="number"
                            InputProps={{ inputProps: { min: bbox_z[0], max: bbox_z[1], step:0.1} }}
                            variant="filled"
                        />
                </FormControl>
                <FormControl onChange={changeUpperZ} sx={{ minWidth:50}}>
                        <TextField
                        sx={{ width: 85}}
                            value = {range_z[1]}
                            id="filled-number"
                            label="upper"
                            type="number"
                            InputProps={{ inputProps: { min: bbox_z[0], max: bbox_z[1], step:0.1} }}
                            variant="filled"
                        />
                </FormControl>
            </Stack>
        </Box>
    )
}

export default observer(SeedBox)
import React, {useContext, useState, useEffect} from 'react'
import { observer } from "mobx-react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Store from '../../Context/RootStore'


const Pipeline = (props) => {
    const store = useContext(Store);

    const [clickedVisibility, setClickedVisibility] = useState(false);

    const ChangeVisibility = () =>{
        setClickedVisibility(!clickedVisibility);
        if(props.id === 0){
            // change the bounding box visibility
            store.bboxStore.BoundingBoxVisibility = clickedVisibility;
            // invisible seeds if has any 
            store.renderStore.SetSeedsInVisible(props.id, clickedVisibility);
        }else{
            store.seedBoxStore.UpdateSeedBoxVisibility(props.id - 1, clickedVisibility);
            store.renderStore.SetSeedsInVisible(props.id, clickedVisibility);
        }
        // console.log(store.renderStore.render_seeds);
    }
    
    const handleClick = () =>{
        store.UpdatePipelineColor(props.id);
        store.bboxStore.UpdateColor(store.pipeline_color[0]);
        store.seedBoxStore.UpdateSeedBoxColor(props.id);
        // Update the seed box dimension in the Panel 
        
    }

    const DeletePipeline = () =>{
        if (props.id === 0){
            store.Reset();
        }else{
            // delete the seed box
            store.seedBoxStore.DeleteSeedBox(props.id - 1);
            // delete the pipeline
            store.DeletePipeline(props.id);
        }

    }

    return(
        <div>
        <Box sx={{ flexGrow: 1 }}>
        <Stack direction="row" alignItems="center" spacing={0}>
            <IconButton color="primary" component="label" onClick={ChangeVisibility}>
                {clickedVisibility ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" /> }
            </IconButton>
            <IconButton color="primary" component="label" onClick={DeletePipeline}>
                <DeleteIcon fontSize="small" />
            </IconButton>
            <Button variant="text"  sx={{ color: props.color, p:0}}
                onClick={ handleClick }>
                <Typography variant="body2">{props.name}</Typography>
            </Button>
        </Stack>
        <Grid container spacing={2}>
            <Grid item xs={2}>
            </Grid>
            <Grid item xs={8}>
            <Typography variant="body2" align='left' color={props.color}>Dimension: [{props.dims[0]}, {props.dims[1]}, {props.dims[2]}]</Typography>
            </Grid>
        </Grid>
        <Grid container spacing={2}>
            <Grid item xs={2}>
            </Grid>
            <Grid item xs={8}>
            <Typography variant="body2" align='left' color={props.color}>Position: [{props.pos[0]}, {props.pos[1]}, {props.pos[2]}]</Typography>
            </Grid>
        </Grid>
        </Box>
        </div>
    )
};

const PipelineTap = () => {
    const store = useContext(Store);
    const [data, setData] = useState([]);
    const [color, setColor] = useState([]);
    const [seed_boxes_dim, setBoxDims] = useState([]);
    const [seed_boxes_pos, setBoxPos] = useState([]);

    useEffect(() => {
        setData(store.pipeline_browser);
        setColor(store.pipeline_color);
    }, [store.pipeline_browser, store.pipeline_color])

    useEffect(() => {
        setBoxDims(store.pipeline_box_dims);
        setBoxPos(store.pipeline_box_pos);
    }, [store.pipeline_box_dims, store.pipeline_box_pos])

    const Browser = data.map((d, i) =>
        <Pipeline key={i} id = {i} name={d} color={color[i]} dims={seed_boxes_dim[i]} pos={seed_boxes_pos[i]}/>
    )
   
    return Browser;
}

export default observer(PipelineTap)
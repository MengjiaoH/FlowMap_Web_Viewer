import React, {useState, useEffect, useContext, useRef} from 'react'
import { observer } from "mobx-react";
import Store from '../../Context/RootStore'
import { Box, Select, TransformControls} from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
// import Tooltip from '@mui/material/Tooltip';

function RenderBox(props){
    const store = useContext(Store);
    const [selected, setSelected] = useState([])

    const transform = useRef()
    
    const active = selected[0]
    
    const [pos_x, setPosX] = useState(null)
    const [pos_y, setPosY] = useState(null)
    const [pos_z, setPosZ] = useState(null)

    const boxref = useRef();

    useFrame(() =>{
        if(boxref.current){
            setPosX(boxref.current.position.x);
            setPosY(boxref.current.position.y);
            setPosZ(boxref.current.position.z);
        }

    })

    useEffect(() =>{
        const seed_pos = store.seedBoxStore.seed_box_pos[props.id];
        if (pos_x !== null && pos_y !== null && pos_z !== null){
            if (pos_x !== seed_pos[0] || pos_y !== seed_pos[1] || pos_z !== seed_pos[2]){
                // console.log("pos_changed", pos_x, pos_y, pos_z, seed_pos[0], seed_pos[1], seed_pos[2])
                store.seedBoxStore.EditSeedBoxPos([pos_x, pos_y, pos_z], props.id);
                // edit the pipeline 
                store.UpdatePipelineBoxPos(props.id + 1, [pos_x.toFixed(2), pos_y.toFixed(2), pos_z.toFixed(2)]);
            }
        }
    }, [pos_x, pos_y, pos_z, props.id, store.seedBoxStore, store])

    useEffect(() => {
        if (selected.length !== 0){
            store.seedBoxStore.SelectedBoxIndex = props.id;
        }
        
    }, [selected, store.seedBoxStore, props.id])

    useEffect(() => {
        if (transform.current) {
            const controls = transform.current;
            // console.log("box ref", boxref.current.material.color)
            const highlightColor_mousedown = () =>{
                // if the current box is selected:
                const global_id = props.id + 1;
                if (store.pipeline_color[global_id] === 'red'){
                    boxref.current.material.color.r = 1;
                    store.UpdatePipelineColor(global_id);
                }else{ // if the current box is not selected:
                    boxref.current.material.color.r = 1;
                    store.UpdatePipelineColor(global_id);
                }
            }
            const highlightColor_mouseup = () =>{
                //
                const global_id = props.id + 1;
                if (store.pipeline_selected === global_id){
                    // console.log("selected changed to red", store.pipeline_selected, global_id)
                    boxref.current.material.color.r = 0;
                    store.UpdatePipelineColor(global_id);
                }else{ // if the current box is not selected:
                    // console.log("not selected changed to black")
                    boxref.current.material.color.r = 0;
                    store.UpdatePipelineColor(global_id);
                }
            }
            controls.addEventListener('mouseDown', highlightColor_mousedown)
            controls.addEventListener('mouseUp', highlightColor_mouseup)
        }
      })

    return(
        <Select box onChange={setSelected}>
            {props.visibility && <Box ref ={boxref} position={props.position}  args={props.dimensions}>
                <meshPhongMaterial color={props.color} wireframe />
            </Box>}
            {active && <TransformControls ref ={transform} object={active}/>}
        </Select>
    ) 

}
const RenderSeedBox = () => {
    const store = useContext(Store);
    const [seed_box_dims, setBoxDims] = useState([]);
    const [seed_box_pos, setBoxPos] = useState([]);
    const [seed_box_color, setBoxColor] = useState([]);
    const [seed_box_visibility, setBoxVisibility] = useState([])

    useEffect(() => {
        // console.log("render seed box dims", store.seedBoxStore.seed_box_dims)
        setBoxDims(store.seedBoxStore.seed_box_dims);
        setBoxPos(store.seedBoxStore.seed_box_pos);
        setBoxColor(store.seedBoxStore.seed_box_color);
    },[store.seedBoxStore.seed_box_dims, store.seedBoxStore.seed_box_pos, store.seedBoxStore.seed_box_color])

    useEffect(() =>{
        setBoxVisibility(store.seedBoxStore.seed_box_visibility);

    }, [store.seedBoxStore.seed_box_visibility])

    const boxes = seed_box_dims.map((dims, i) => 
      <RenderBox key ={i} id ={i} position={seed_box_pos[i]} dimensions={dims} color={seed_box_color[i]} visibility={seed_box_visibility[i]}/>
    )
    return boxes;
}

export default observer(RenderSeedBox)
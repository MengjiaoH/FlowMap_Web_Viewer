import React, {useContext, useState, useEffect} from 'react'
import { observer } from "mobx-react";
import Store from '../../../Context/RootStore'
import { SketchPicker } from 'react-color';
import Box from '@mui/material/Box';

// import {Colorscale} from 'react-colorscales';
// import { DEFAULT_SCALE } from "./constants.js";
import "./style.css"

const ConstantColor = () => {
    const store = useContext(Store);
    // const colorscale = DEFAULT_SCALE;
    const [color, setColor] = useState('#277BC0');

    useEffect(() =>{
        store.colorOptionsStore.ConstantColor = color ;
    }, [color, store.colorOptionsStore])

    return (
 
        <Box sx={{ flexGrow: 1, p:2 }}> 
            <SketchPicker color={color} onChange={setColor} />
        </Box>

    )
}

export default observer(ConstantColor)
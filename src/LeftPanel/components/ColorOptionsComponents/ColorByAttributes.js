import React, {useContext, useState} from 'react'
import { observer } from "mobx-react";
import Store from '../../../Context/RootStore'

import vtkURLExtract from '@kitware/vtk.js/Common/Core/URLExtract';
import vtkXMLImageDataReader from '@kitware/vtk.js/IO/XML/XMLImageDataReader';
import Button from '@mui/material/Button';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import {Colorscale} from 'react-colorscales';
import { DEFAULT_SCALE } from "./constants.js";
import "./style.css"

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

const ColorByAttributes = () => {
    const store = useContext(Store);
    const colorscale = DEFAULT_SCALE;
    const userParams = vtkURLExtract.extractURLParameters();
    const [minval, setMin] = useState(0);
    const [maxval, setMax] = useState(0);

    const handleChangeFTLE = (event) => {
        console.log(event.target.files[0])
        preventDefaults(event);
        const file = event.target.files[0];
        const ext = file.name.split('.').slice(-1)[0];
        const options = { file: file, ext, ...userParams };
        const reader = new FileReader();
        reader.onload = function onLoad(e) {
        //   store.controlStore.AttributeFileUploaded = true;
        //   store.setAttributeFile = reader.result;
        // Use VTI file 
          const vtiReader = vtkXMLImageDataReader.newInstance();
          vtiReader.parseAsArrayBuffer(reader.result);
          const source = vtiReader.getOutputData(0);
          const dataArray = source.getPointData().getScalars() || source.getPointData().getArrays()[0];
          store.colorOptionsStore.setAttributeData = dataArray;
        //   console.log("attribute data array", dataArray.getNumberOfValues())
        // console.log("dimensions", source.getDimensions())
        const dims = source.getDimensions();
        store.colorOptionsStore.setAttributeDims = dims;
          const dataRange = dataArray.getRange();
          setMin(dataRange[0].toFixed(2));
          setMax(dataRange[1].toFixed(2));
          store.colorOptionsStore.setAttributeRange = dataRange;
        };
        reader.readAsArrayBuffer(options.file);
    }

    return (        
        <Box sx={{ flexGrow: 1, mb: 1, justifyContent: "center", alignItems: 'center',}}> 
                {/* <FormGroup aria-label="position" row> */}
                    <Button component="label" variant="outlined" startIcon={<UploadFileIcon />} sx={{ mb: "1rem", }} size="small"> Upload 
                        <input hidden type="file" onChange={handleChangeFTLE}/> 
                    </Button>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Typography>Minimum: {minval}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography>Maximum: {maxval}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                        </Grid>
                        <Grid item xs={8}>
                            <Colorscale
                                colorscale={colorscale}
                                onClick={() => {}}
                                width={200}
                            />
                        </Grid>
                        <Grid item xs={2}>
                        </Grid>
                    </Grid>
        </Box>
    )
}

export default observer(ColorByAttributes)
import {observer} from "mobx-react";
import React, {useContext, useMemo} from "react";
import {global_data} from "../../Context/DataContainer";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Button from "@mui/material/Button";
import vtkXMLImageDataReader from '@kitware/vtk.js/IO/XML/XMLImageDataReader';
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

function VolumeConfigPanel(props) {
    const g_data = useContext(global_data)

    const config = useMemo(() => {
        return g_data.volume_config
    }, [g_data.volume_config])

    const title = useMemo(() => {
        if (config.loaded) {
            return config.data_name
        } else {
            return "no data loaded"
        }
    }, [config.data_name, config.loaded])

    const setDimX = (e) => {
        config.setDimX(Number(e.target.value))
    }

    const setDimY = (e) => {
        config.setDimY(Number(e.target.value))
    }

    const setDimZ = (e) => {
        config.setDimZ(Number(e.target.value))
    }

    const handleUploadDataFile = (e) => {
        const filename = e.target.files[0]
        const reader = new FileReader()
        reader.onload = () => {
            const vti_reader = vtkXMLImageDataReader.newInstance()
            vti_reader.parseAsArrayBuffer(reader.result)
            const source = vti_reader.getOutputData(0);
            const dims = source.getDimensions()
            const data_array = source.getPointData().getScalars() || source.getPointData().getArrays()[0];
            const [min_v, max_v] = data_array.getRange();
            config.setScalars(data_array.getData(), min_v, max_v, filename.name, dims)
        }
        reader.readAsArrayBuffer(filename)

    }

    const setDVRSwitch = (e) => {
        config.setVolumeRendering(e.target.checked)
    }

    return <FormControl>
        <FormLabel>{title}</FormLabel>
        <Box component="form" sx={{'& > :not(style)': {m: 1, width: '100%'},}} noValidate autoComplete="off">
            <Stack direction="row" spacing={0}>
                <FormLabel>Volume Dims</FormLabel>
                <TextField type="number" label="X" variant="outlined" size="small"
                           inputProps={{min: 1, style: {fontSize: 12}}}
                           value={config.dims[0]} onChange={setDimX}
                />
                <TextField type="number" label="Y" variant="outlined" size="small"
                           inputProps={{min: 1, style: {fontSize: 12}}}
                           value={config.dims[1]} onChange={setDimY}
                />
                <TextField type="number" label="Z" variant="outlined" size="small"
                           inputProps={{min: 1, style: {fontSize: 12}}}
                           value={config.dims[2]} onChange={setDimZ}
                />
            </Stack>

            <Stack direction="row" spacing={5}>
                <FormLabel>Upload Data</FormLabel>
                <Button component="label" variant="outlined" startIcon={<UploadFileIcon/>} size="small"> Upload
                    <input hidden type="file" onChange={handleUploadDataFile}/>
                </Button>
            </Stack>
            <Stack direction="row" spacing={5}>
                <FormControlLabel control={<Switch checked={config.volume_rendering} disabled={!config.loaded}/>}
                                  label={'Volume Rendering'} value={'dvrswitch'} onChange={setDVRSwitch}/>

            </Stack>

        </Box>
    </FormControl>

}

export default observer(VolumeConfigPanel)
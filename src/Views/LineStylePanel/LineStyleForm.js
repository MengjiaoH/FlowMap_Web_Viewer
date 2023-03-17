import React, {useContext, useMemo} from 'react'
import {observer} from "mobx-react";
import {global_data} from "../../Context/DataContainer";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import {Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Form from "react-bootstrap/Form";
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';


function LineStyleForm(props) {
    const g_data = useContext(global_data)
    const config = useMemo(() => {
        return g_data.line_style_config
    }, [g_data.line_style_config])

    const setSeedColor = (e) => {
        config.setSeedColor(e.target.value)
    }

    const setSeedScale = (e) =>{
        config.setSeedScale(Number(e.target.value))
    }

    const setLineSegments = (e) => {
        config.setLineSegments(Number(e.target.value))
    }

    const setLineRadius = (e) => {
        config.setLineRadius(Number(e.target.value))
    }

    const setLineColor = (e) => {
        config.setLineColor(e.target.value)
    }

    const applyColor = (e) => {
        g_data.trajectories.applyStyle()
    }


    return <FormControl>
        <FormLabel id="seed_placement_radio_group_label"><Typography>Seeds:</Typography></FormLabel>
        <Box component="form" sx={{'& > :not(style)': {m: 1, width: '100%'},}} noValidate autoComplete="off">
            <TextField type="number" id="seedbox-config-size-y" label="seed scale" variant="outlined" size="small"
                       inputProps={{min: 0, style: {fontSize: 12}}}
                       value={config.seed_scale} onChange={setSeedScale}
            />
                <Form.Control
                    type="color"
                    value={config.seed_color}
                    onChange={setSeedColor}
                />
        </Box>
        <FormLabel id="seed_placement_radio_group_label"><Typography>Lines:</Typography></FormLabel>
        <Box component="form" sx={{'& > :not(style)': {m: 1, width: '100%'},}} noValidate autoComplete="off">
            <TextField type="number" id="seedbox-config-size-y" label="line segments" variant="outlined" size="small"
                       inputProps={{min: 0, style: {fontSize: 12}}}
                       value={config.line_segments} onChange={setLineSegments}
            />
            <TextField type="number" id="seedbox-config-size-z" label="line radius" variant="outlined" size="small"
                       inputProps={{min: 0, style: {fontSize: 12}}}
                       value={config.line_radius} onChange={setLineRadius}
            />

            <Form.Control
                type="color"
                value={config.line_color}
                onChange={setLineColor}
            />
        </Box>
        <Box component="form" sx={{'& > :not(style)': {m: 1, width: '100%'},}} noValidate autoComplete="off">
            <Button component="label"
                    variant="outlined"
                    startIcon={<CheckIcon/>}
                    size="small"
                    onClick={applyColor}>
                Apply Style
            </Button>
        </Box>


    </FormControl>
}

export default observer(LineStyleForm)
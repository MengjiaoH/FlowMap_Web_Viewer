import React, {useState, useContext, useEffect, useMemo} from 'react'
import {observer} from "mobx-react";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import {global_data} from "../Context/DataContainer";
import {Typography} from "@mui/material";

function SeedPlacement(props) {
    const g_data = useContext(global_data)
    const config = useMemo(() => {
        return g_data.seedbox_config
    }, [g_data.seedbox_config])

    const setDisplay = (event) => {
        config.setDisplay(event.target.checked)
    }

    const setActive = (event) => {
        config.setActive(event.target.checked)
    }

    const setSizeX = (e) => {
        config.setSizeX(Number(e.target.value))
    }

    const setSizeY = (e) => {
        config.setSizeY(Number(e.target.value))
    }

    const setSizeZ = (e) => {
        config.setSizeZ(Number(e.target.value))
    }

    const setPositionX = (e) => {
        config.setPositionX(Number(e.target.value))
    }

    const setPositionY = (e) => {
        config.setPositionY(Number(e.target.value))
    }

    const setPositionZ = (e) => {
        config.setPositionZ(Number(e.target.value))
    }


    return <FormControl>
        <Box component="form" sx={{'& > :not(style)': {m: 1, width: '100%'},}} noValidate autoComplete="off">
            <Stack direction="row" alignItems="center" spacing={0}>
                <FormControlLabel value="display" control={
                    <Switch checked={config.display} onChange={setDisplay}/>
                } label="Display"/>
                <FormControlLabel value="active" control={
                    <Switch checked={config.active} onChange={setActive}/>
                } label="Active"/>
            </Stack>
        </Box>
        <FormLabel id="seed_placement_radio_group_label"><Typography>Size:</Typography></FormLabel>
        <Box component="form" sx={{'& > :not(style)': {m: 1, width: '100%'},}} noValidate autoComplete="off">
            {/*<Stack direction="row" alignItems="center" spacing={0}>*/}
            <TextField type="number" id="seedbox-config-size-x" label="size_x" variant="outlined" size="small"
                       inputProps={{min: 0, style: {fontSize: 12}}}
                       value={config.size[0]} onChange={setSizeX}
            />
            <TextField type="number" id="seedbox-config-size-y" label="size_y" variant="outlined" size="small"
                       inputProps={{min: 0, style: {fontSize: 12}}}
                       value={config.size[1]} onChange={setSizeY}
            />
            <TextField type="number" id="seedbox-config-size-z" label="size_z" variant="outlined" size="small"
                       inputProps={{min: 0, style: {fontSize: 12}}}
                       value={config.size[2]} onChange={setSizeZ}
            />
            {/*</Stack>*/}
        </Box>
        <FormLabel id="seed_placement_radio_group_label"><Typography>Position:</Typography></FormLabel>
        <Box component="form" sx={{'& > :not(style)': {m: 1, width: '100%'},}} noValidate autoComplete="off">
            {/*<Stack direction="row" alignItems="center" spacing={0}>*/}
            <TextField type="number" id="seedbox-config-position-x" label="position_x" variant="outlined" size="small"
                       inputProps={{style: {fontSize: 12}}}
                       value={config.position[0]} onChange={setPositionX}
            />
            <TextField type="number" id="seedbox-config-position-y" label="position_y" variant="outlined" size="small"
                       inputProps={{style: {fontSize: 12}}}
                       value={config.position[1]} onChange={setPositionY}
            />
            <TextField type="number" id="seedbox-config-position-z" label="position_z" variant="outlined" size="small"
                       inputProps={{style: {fontSize: 12}}}
                       value={config.position[2]} onChange={setPositionZ}
            />
            {/*</Stack>*/}
        </Box>

    </FormControl>
}

export default observer(SeedPlacement)
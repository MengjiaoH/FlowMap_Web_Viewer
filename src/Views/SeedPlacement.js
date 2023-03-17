import React, {useContext, useMemo} from 'react'
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
import {manual_gen, random_gen, uniform_gen} from "./GenSeeds";

function SeedPlacement(props) {
    const g_data = useContext(global_data)
    const config = useMemo(() => {
        return g_data.seed_placement_config
    }, [g_data.seed_placement_config])


    const handleChangeNumSeedsRandom = (event) => {
        config.setNRandomSeed(Number(event.target.value))
    }

    const handleChangeUniformedX = (event) => {
        config.setUniformX(Number(event.target.value))
    }
    const handleChangeUniformedY = (event) => {
        config.setUniformY(Number(event.target.value))
    }
    const handleChangeUniformedZ = (event) => {
        config.setUniformZ(Number(event.target.value))
    }
    const handleChangeSeedX = (event) => {
        config.setManualX(Number(event.target.value))
    }
    const handleChangeSeedY = (event) => {
        config.setManualY(Number(event.target.value))
    }
    const handleChangeSeedZ = (event) => {
        config.setManualZ(Number(event.target.value))
    }

    const setRandomStrategy = (event) => {
        config.setUseRandomStrategy(event.target.checked)
    }

    const setUniformStrategy = (event) => {
        config.setUseUniformStrategy(event.target.checked)
    }

    const setManualStrategy = (event) => {
        config.setUseManualStrategy(event.target.checked)
    }

    const handleUploadSeedFile = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const reader = new FileReader()
        reader.onload = async (event) => {
        };
        reader.readAsText(event.target.files[0])
    }

    const addSeeds = () => {
        const activate_bounds = g_data.seedbox_config.active ? g_data.seedbox_config.getBounds() : g_data.domain.getBounds()
        console.log("activate_bounds", activate_bounds)
        let seeds = []
        if (config.use_random_strategy) {
            seeds = seeds.concat(random_gen(activate_bounds, config.n_random_seed))
        }
        if (config.use_uniform_strategy) {
            seeds = seeds.concat(uniform_gen(activate_bounds, ...config.uniform))
        }
        if (config.use_manual_strategy) {
            seeds = seeds.concat(manual_gen(activate_bounds, ...config.manual))
        }

        console.log(seeds)

        g_data.trajectories.addSeeds(seeds)
    }

    const deleteSeeds = () => {
        g_data.trajectories.reset()
    }

    return <FormControl>

        <Box component="form" sx={{'& > :not(style)': {m: 1, width: '100%'},}} noValidate autoComplete="off">
            <Stack direction="row" alignItems="center" spacing={0}>
                <FormControlLabel value="random" control={
                    <Switch checked={config.use_random_strategy} onChange={setRandomStrategy}/>
                } label="Random"/>
                <TextField type='number' id="outlined-basic" label="#Seeds" variant="outlined" size="small"
                           inputProps={{min: 0, style: {fontSize: 12}}}
                           value={config.n_random_seed} onChange={handleChangeNumSeedsRandom}
                />
            </Stack>
        </Box>

        <Box component="form" sx={{'& > :not(style)': {m: 1, width: '100%'},}} noValidate autoComplete="off">
            <Stack direction="row" alignItems="center" spacing={0}>
                <FormControlLabel value="uniform" control={
                    <Switch checked={config.use_uniform_strategy} onChange={setUniformStrategy}/>
                } label="Uniform"/>
                <TextField type="number" id="outlined-basic-x" label="X" variant="outlined" size="small"
                           inputProps={{min: 0, style: {fontSize: 12}}}
                           value={config.uniform[0]} onChange={handleChangeUniformedX}
                />
                <TextField type="number" id="outlined-basic-y" label="Y" variant="outlined" size="small"
                           inputProps={{min: 0, style: {fontSize: 12}}}
                           value={config.uniform[1]} onChange={handleChangeUniformedY}
                />
                <TextField type="number" id="outlined-basic-z" label="Z" variant="outlined" size="small"
                           inputProps={{min: 0, style: {fontSize: 12}}}
                           value={config.uniform[2]} onChange={handleChangeUniformedZ}
                />
            </Stack>

        </Box>

        <Box component="form" sx={{'& > :not(style)': {m: 1, width: '100%'},}} noValidate autoComplete="off">
            <Stack direction="row" alignItems="center" spacing={0}>
                <FormControlLabel value="manual" control={
                    <Switch checked={config.use_manual_strategy} onChange={setManualStrategy}/>
                } label="Insert Manually"/>
                <TextField type="number" label="X" variant="outlined" size="small"
                           inputProps={{min: 0, style: {fontSize: 12}}}
                           value={config.manual[0]} onChange={handleChangeSeedX}
                />
                <TextField type="number" label="Y" variant="outlined" size="small"
                           inputProps={{min: 0, style: {fontSize: 12}}}
                           value={config.manual[1]} onChange={handleChangeSeedY}
                />
                <TextField type="number" label="Z" variant="outlined" size="small"
                           inputProps={{min: 0, style: {fontSize: 12}}}
                           value={config.manual[2]} onChange={handleChangeSeedZ}
                />
            </Stack>
        </Box>

        <Box component="form" sx={{'& > :not(style)': {m: 1, width: '100%'},}} noValidate autoComplete="off">
            <Stack direction="row" alignItems="center" spacing={2}>
                <FormLabel id="seed_placement_file_uploader_label">
                    <Typography>Upload Seeds File</Typography>
                </FormLabel>
                <Button component="label" variant="outlined" startIcon={<UploadFileIcon/>} size="small"> Upload
                    <input hidden type="file" onChange={handleUploadSeedFile}/>
                </Button>
            </Stack>
        </Box>
        <Box component="form" sx={{'& > :not(style)': {m: 1, width: '100%'},}} noValidate autoComplete="off"
        >
            <Stack direction="row" alignItems="center" spacing={2}>
                <Button component="label" variant="outlined" startIcon={<AddBoxIcon/>} size="small"
                        onClick={addSeeds}> Add Seeds
                </Button>
                <Button component="label" variant="outlined" startIcon={<DeleteIcon/>} onClick={deleteSeeds}
                        size="small"> Delete Seeds
                </Button>
            </Stack>
        </Box>
    </FormControl>
}

export default observer(SeedPlacement)
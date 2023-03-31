import React, {useContext, useMemo} from 'react'
import {observer} from "mobx-react";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import {global_data} from "../../Context/DataContainer";
import {Slider} from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import Button from '@mui/material/Button';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from "@mui/material/TextField";
import {manual_gen, random_gen, uniform_gen} from "./GenSeeds";

function SeedPlacement(props) {
    const g_data = useContext(global_data)
    const config = useMemo(() => {
        return g_data.seedbox_config
    }, [g_data.seedbox_config])

    const position = useMemo(() => {
        return g_data.seedbox_config.position
    }, [g_data.seedbox_config.position])

    const size = useMemo(() => {
        return g_data.seedbox_config.size
    }, [g_data.seedbox_config.size])

    const [bx_min, bx_max, by_min, by_max, bz_min, bz_max] = useMemo(() => {
        return g_data.modelinfo.bounds
    }, [g_data.modelinfo.bounds])


    const [min_pos_x, max_pos_x, disable_pos_x] = useMemo(() => {
        return [bx_min, bx_max - size[0], Math.abs(bx_max - size[0] - bx_min) < 1e-6 && position[0] === bx_min]
    }, [bx_max, bx_min, size, position])

    const [min_pos_y, max_pos_y, disable_pos_y] = useMemo(() => {
        return [by_min, by_max - size[1], Math.abs(by_max - size[1] - by_min) < 1e-6 && position[1] === by_min]
    }, [by_max, by_min, size, position])

    const [min_pos_z, max_pos_z, disable_pos_z] = useMemo(() => {
        return [bz_min, bz_max - size[2], Math.abs(bz_max - size[2] - bz_min) < 1e-6 && position[2] === bz_min]
    }, [bz_max, bz_min, size, position])

    const [min_size_x, max_size_x, disable_size_x] = useMemo(() => {
        return [0, bx_max - position[0], Math.abs(bx_max - position[0] - 0) < 1e-6 && size[0] === 0]
    }, [bx_max, position, size])

    const [min_size_y, max_size_y, disable_size_y] = useMemo(() => {
        return [0, by_max - position[1], Math.abs(by_max - position[1] - 0) < 1e-6 && size[1] === 0]
    }, [by_max, position, size])

    const [min_size_z, max_size_z, disable_size_z] = useMemo(() => {
        return [0, bz_max - position[2], Math.abs(bz_max - position[2] - 0) < 1e-6 && size[2] === 0]
    }, [bz_max, position, size])


    const setDisplay = (event) => {
        config.setDisplay(event.target.checked)
    }

    const setActive = (event) => {
        config.setActive(event.target.checked)
    }

    const setSizeX = (e, v) => {
        config.setSizeX(Number(v))
    }

    const setSizeY = (e, v) => {
        config.setSizeY(Number(v))
    }

    const setSizeZ = (e, v) => {
        config.setSizeZ(Number(v))
    }

    const setPositionX = (e, v) => {
        config.setPositionX(Number(v))
    }

    const setPositionY = (e, v) => {
        config.setPositionY(Number(v))
    }

    const setPositionZ = (e, v) => {
        config.setPositionZ(Number(v))
    }

    const addSeeds = () => {
        const activate_bounds = g_data.seedbox_config.active ? g_data.seedbox_config.getBounds() : g_data.modelinfo.getBounds()

        let seeds = []
        if (g_data.seed_placement_config.use_random_strategy) {
            seeds = seeds.concat(random_gen(activate_bounds, g_data.seed_placement_config.n_random_seed))
        }
        if (g_data.seed_placement_config.use_uniform_strategy) {
            seeds = seeds.concat(uniform_gen(activate_bounds, ...g_data.seed_placement_config.uniform))
        }
        if (g_data.seed_placement_config.use_manual_strategy) {
            seeds = seeds.concat(manual_gen(activate_bounds, ...g_data.seed_placement_config.manual))
        }
        g_data.trajectories.addSeeds(seeds)
    }

    const deleteSeeds = () => {
        g_data.trajectories.reset()
    }

    const sampling_forms = useMemo(() => {
        return <Box component="form" sx={{'& > :not(style)': {p: 1, width: '100%'},}} noValidate autoComplete="off">
            <Stack direction="row" alignItems="center" spacing={5}>
                <FormLabel>position_x</FormLabel>
                <Slider valueLabelDisplay={'auto'} min={min_pos_x} max={max_pos_x}
                        disabled={disable_pos_x}
                        step={(max_pos_x - min_pos_x) / 100}
                        value={position[0]}
                        onChange={setPositionX}
                />
                <TextField disabled={disable_pos_x} value={position[0]} size={'small'}
                           inputProps={{min: min_pos_x, max: max_pos_x, style: {fontSize: 12}}}
                           onChange={function (e) {
                               let v = Number(e.target.value)
                               if (Number.isNaN(v)) v = min_pos_x
                               if (v < min_pos_x) v = min_pos_x
                               if (v > max_pos_x) v = max_pos_x
                               config.setPositionX(v)
                           }}/>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={5}>
                <FormLabel>position_y</FormLabel>
                <Slider valueLabelDisplay={'auto'} min={min_pos_y} max={max_pos_y}
                        disabled={disable_pos_y}
                        step={(max_pos_y - min_pos_y) / 100}
                        value={position[1]}
                        onChange={setPositionY}/>
                <TextField disabled={disable_pos_y} value={position[1]} size={'small'}
                           inputProps={{min: min_pos_y, max: max_pos_y, style: {fontSize: 12}}}
                           onChange={function (e) {
                               let v = Number(e.target.value)
                               if (Number.isNaN(v)) v = min_pos_y
                               if (v < min_pos_y) v = min_pos_y
                               if (v > max_pos_y) v = max_pos_y
                               config.setPositionY(v)
                           }}/>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={5}>
                <FormLabel>position_z</FormLabel>
                <Slider valueLabelDisplay={'auto'} min={min_pos_z} max={max_pos_z}
                        disabled={disable_pos_z}
                        step={(max_pos_z - min_pos_z) / 100}
                        value={position[2]}
                        onChange={setPositionZ}/>
                <TextField disabled={disable_pos_z} value={position[2]} size={'small'}
                           inputProps={{min: min_pos_z, max: max_pos_z, style: {fontSize: 12}}}
                           onChange={function (e) {
                               let v = Number(e.target.value)
                               if (Number.isNaN(v)) v = min_pos_z
                               if (v < min_pos_z) v = min_pos_z
                               if (v > max_pos_z) v = max_pos_z
                               config.setPositionZ(v)
                           }}/>
            </Stack>
        </Box>
    }, [config, disable_pos_x, disable_pos_y, disable_pos_z, max_pos_x, max_pos_y, max_pos_z, min_pos_x, min_pos_y, min_pos_z, position, setPositionX, setPositionY, setPositionZ])


    return <FormControl>
        <Box component="form" sx={{'& > :not(style)': {p: 0, width: '100%'},}} noValidate autoComplete="off">
            <Stack direction="row" alignItems="center" spacing={5}>
                <FormControlLabel value="display" control={
                    <Switch checked={config.display} onChange={setDisplay}/>
                } label="Display"/>
                <FormControlLabel value="active" control={
                    <Switch checked={config.active} onChange={setActive}/>
                } label="Active"/>
            </Stack>
        </Box>
        {sampling_forms}

        <Box component="form" sx={{'& > :not(style)': {p: 1, width: '100%'},}} noValidate autoComplete="off">
            <Stack direction="row" alignItems="center" spacing={5}>
                <FormLabel>size_x</FormLabel>
                <Slider valueLabelDisplay={'auto'} min={min_size_x} max={max_size_x}
                        disabled={disable_size_x}
                        step={(max_size_x - min_size_x) / 100}
                        value={size[0]}
                        onChange={setSizeX}
                />
                <TextField disabled={disable_size_x} value={size[0]} size={'small'}
                           inputProps={{min: min_size_x, max: max_size_x, style: {fontSize: 12}}}
                           onChange={function (e) {
                               let v = Number(e.target.value)
                               if (Number.isNaN(v)) v = min_size_x
                               if (v < min_size_x) v = min_size_x
                               if (v > max_size_x) v = max_size_x
                               config.setSizeX(v)
                           }}/>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={5}>
                <FormLabel>size_y</FormLabel>
                <Slider valueLabelDisplay={'auto'} min={min_size_y} max={max_size_y}
                        disabled={disable_size_y}
                        step={(max_size_y - min_size_y) / 1000}
                        value={size[1]}
                        onChange={setSizeY}/>
                <TextField disabled={disable_size_x} value={size[1]} size={'small'}
                           inputProps={{min: min_size_y, max: max_size_y, style: {fontSize: 12}}}
                           onChange={function (e) {
                               let v = Number(e.target.value)
                               if (Number.isNaN(v)) v = min_size_y
                               if (v < min_size_y) v = min_size_y
                               if (v > max_size_y) v = max_size_y
                               config.setSizeY(v)
                           }}/>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={5}>
                <FormLabel>size_z</FormLabel>
                <Slider valueLabelDisplay={'auto'} min={min_size_z} max={max_size_z}
                        disabled={disable_size_z}
                        step={(max_size_z - min_size_z) / 100}
                        value={size[2]}
                        onChange={setSizeZ}/>
                <TextField disabled={disable_size_x} value={size[2]} size={'small'}
                           inputProps={{min: min_size_z, max: max_size_z, style: {fontSize: 12}}}
                           onChange={function (e) {
                               let v = Number(e.target.value)
                               if (Number.isNaN(v)) v = min_size_z
                               if (v < min_size_z) v = min_size_z
                               if (v > max_size_z) v = max_size_z
                               config.setSizeZ(v)
                           }}/>
            </Stack>
        </Box>
        <Box component="form" sx={{'& > :not(style)': {m: 1, width: '100%'},}} noValidate autoComplete="off">
            <Stack direction="row" spacing={2}>
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
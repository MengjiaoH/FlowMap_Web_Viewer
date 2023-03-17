import React, {useContext, useMemo} from 'react'
import {observer} from "mobx-react";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import {global_data} from "../Context/DataContainer";
import {Slider, Typography} from "@mui/material";
import FormLabel from "@mui/material/FormLabel";

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
        return g_data.domain.bounds
    }, [g_data.domain.bounds])


    const [min_pos_x, max_pos_x] = useMemo(() => {
        return [bx_min, bx_max - size[0]]
    }, [bx_max, bx_min, size])

    const [min_pos_y, max_pos_y] = useMemo(() => {
        return [by_min, by_max - size[1]]
    }, [by_max, by_min, size])

    const [min_pos_z, max_pos_z] = useMemo(() => {
        return [bz_min, bz_max - size[2]]
    }, [bz_max, bz_min, size])

    const [min_size_x, max_size_x] = useMemo(() => {
        return [0, bx_max - position[0]]
    }, [bx_max, position, size])

    const [min_size_y, max_size_y] = useMemo(() => {
        return [0, by_max - position[1]]
    }, [by_max, position, size])

    const [min_size_z, max_size_z] = useMemo(() => {
        return [0, bz_max - position[2]]
    }, [bz_max, position, size])

    const disable_pos_x = useMemo(() => {
        return Math.abs(max_pos_x - min_pos_x) < 1e-6 && position[0] === bx_min
    })

    const disable_pos_y = useMemo(() => {
        return Math.abs(max_pos_y - min_pos_y) < 1e-6 && position[1] === by_min
    })

    const disable_pos_z = useMemo(() => {
        return Math.abs(max_pos_z - min_pos_z) < 1e-6 && position[2] === bz_min
    })

    const disable_size_x = useMemo(() => {
        return Math.abs(max_size_x - min_size_x) < 1e-6 && size[0] === 0
    })

    const disable_size_y = useMemo(() => {
        return Math.abs(max_size_y - min_size_y) < 1e-6 && size[1] === 0
    })

    const disable_size_z = useMemo(() => {
        return Math.abs(max_size_z - min_size_z) < 1e-6 && size[2] === 0
    })

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


    return <FormControl>
        <Box component="form" sx={{'& > :not(style)': {p: 1, width: '100%'},}} noValidate autoComplete="off">
            <Stack direction="row" alignItems="center" spacing={0}>
                <FormControlLabel value="display" control={
                    <Switch checked={config.display} onChange={setDisplay}/>
                } label="Display"/>
                <FormControlLabel value="active" control={
                    <Switch checked={config.active} onChange={setActive}/>
                } label="Active"/>
            </Stack>
        </Box>

        <Box component="form" sx={{'& > :not(style)': {p: 1, width: '100%'},}} noValidate autoComplete="off">
            <Stack direction="row" alignItems="center" spacing={5}>
                <FormLabel>position_x</FormLabel>
                <Slider valueLabelDisplay={'auto'} min={min_pos_x} max={max_pos_x}
                        disabled={disable_pos_x}
                        step={(max_pos_x - min_pos_x) / 100}
                        value={position[0]}
                        onChange={setPositionX}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={5}>
                <FormLabel>position_y</FormLabel>
                <Slider valueLabelDisplay={'auto'} min={min_pos_y} max={max_pos_y}
                        disabled={disable_pos_y}
                        step={(max_pos_y - min_pos_y) / 100}
                        value={position[1]}
                        onChange={setPositionY}/>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={5}>
                <FormLabel>position_z</FormLabel>
                <Slider valueLabelDisplay={'auto'} min={min_pos_z} max={max_pos_z}
                        disabled={disable_pos_z}
                        step={(max_pos_z - min_pos_z) / 100}
                        value={position[2]}
                        onChange={setPositionZ}/>
            </Stack>
        </Box>
        <Box component="form" sx={{'& > :not(style)': {p: 1, width: '100%'},}} noValidate autoComplete="off">
            <Stack direction="row" alignItems="center" spacing={5}>
                <FormLabel>size_x</FormLabel>
                <Slider valueLabelDisplay={'auto'} min={min_size_x} max={max_size_x}
                        disabled={disable_size_x}
                        step={(max_size_x - min_size_x) / 100}
                        value={size[0]}
                        onChange={setSizeX}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={5}>
                <FormLabel>size_y</FormLabel>
                <Slider valueLabelDisplay={'auto'} min={min_size_y} max={max_size_y}
                        disabled={disable_size_y}
                        step={(max_size_y - min_size_y) / 100}
                        value={size[1]}
                        onChange={setSizeY}/>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={5}>
                <FormLabel>size_z</FormLabel>
                <Slider valueLabelDisplay={'auto'} min={min_size_z} max={max_size_z}
                        disabled={disable_size_z}
                        step={(max_size_z - min_size_z) / 100}
                        value={size[2]}
                        onChange={setSizeZ}/>
            </Stack>
        </Box>
    </FormControl>
}

export default observer(SeedPlacement)
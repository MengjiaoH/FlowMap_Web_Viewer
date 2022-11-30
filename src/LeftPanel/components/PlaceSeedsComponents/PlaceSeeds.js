import React, {useState, useContext, useEffect} from 'react'
import { observer } from "mobx-react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
// import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';

import Store from '../../../Context/RootStore';
import GenSeeds from '../SeedPlacement/GenSeeds';
import DeleteSeeds from '../SeedPlacement/DeleteSeeds'

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

const PlaceSeeds = () => {
    const store = useContext(Store);
    const [value, setValue] = useState("random"); // random / uniform Default is random
    const [num_seeds_random, setNumSeeds] = useState(0);
    const [num_seeds_uniformed_x, setUniformedX] = useState(0);
    const [num_seeds_uniformed_y, setUniformedY] = useState(0);
    const [num_seeds_uniformed_z, setUniformedZ] = useState(0);
    const [insert_seed_x, setSeedX] = useState(0);
    const [insert_seed_y, setSeedY] = useState(0);
    const [insert_seed_z, setSeedZ] = useState(0);

    const handleChange = (event) => {
        setValue(event.target.value);
        store.placeSeedsStore.SeedingStrategy = event.target.value;
    };

    const handleChangeNumSeedsRandom = (event) =>{
        setNumSeeds(event.target.value);
    }

    const handleChangeUnifomedX = (event) =>{
        setUniformedX(event.target.value);
        
    }
    const handleChangeUnifomedY = (event) =>{
        setUniformedY(event.target.value);
        store.placeSeedsStore.UniformSeedsDimY = event.target.value;
    }
    const handleChangeUnifomedZ = (event) =>{
        setUniformedZ(event.target.value);
        store.placeSeedsStore.UniformSeedsDimY = event.target.value;
    }
    const handleChangeSeedX = (event) =>{
        // console.log(event.target.value)
        setSeedX(+event.target.value);
    }
    const handleChangeSeedY = (event) =>{
        setSeedY(+event.target.value);
    }
    const handleChangeSeedZ = (event) =>{
        setSeedZ(+event.target.value);
    }

    const handleUploadSeedFile = (event) =>{
        preventDefaults(event);
        const reader = new FileReader()
        reader.onload = async (event) => { 
            const text = (event.target.result);
            const new_text = text.split(/(\s+)/);
            new_text.forEach((c) =>{
                if (c !== ' ' && c !== '\n' && c !== ' \n' && c !== ''){
                    store.placeSeedsStore.LoadSeedsFromFile(c);
                }   
            })
        };
        reader.readAsText(event.target.files[0])
    }

    useEffect(() => {
        store.placeSeedsStore.NumRandomSeeds = num_seeds_random;
    }, [num_seeds_random, store.placeSeedsStore])

    useEffect(() => {
        store.placeSeedsStore.SetUniformSeedsDim([num_seeds_uniformed_x, num_seeds_uniformed_y, num_seeds_uniformed_z]);
    }, [num_seeds_uniformed_x, num_seeds_uniformed_y, num_seeds_uniformed_z, store.placeSeedsStore])

    useEffect(() => {
        // console.log(insert_seed_x, insert_seed_y, insert_seed_z)
        store.placeSeedsStore.SetManualSeedPos([insert_seed_x, insert_seed_y, insert_seed_z]);
    }, [insert_seed_x, insert_seed_y, insert_seed_z, store.placeSeedsStore])

    const AddSeeds = () =>{
        // generate seeds 
        GenSeeds(store);

    }

    const DeleteSeedsFunc = () =>{
        // delete the seeds from the current selected seed box or global domain 
        DeleteSeeds(store);
    }

    return (
        <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={value}
                    onChange={handleChange}
                >
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '100%' },
                        }}
                        noValidate
                        autoComplete="off"
                        >
                        <Stack direction="row" alignItems="center" spacing={0}>
                            <FormControlLabel value="random" control={<Radio />} label="Random" />
                            <TextField id="outlined-basic" label="#Seeds" variant="outlined" size="small" inputProps={{ min: 0, style: { fontSize: 12 } }}
                                value={num_seeds_random} onChange={handleChangeNumSeedsRandom} 
                            />
                        </Stack>
                    </Box>
                    
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '100%' },
                        }}
                        noValidate
                        autoComplete="off"
                        >
                            <Stack direction="row" alignItems="center" spacing={0}>
                                <FormControlLabel value="uniform" control={<Radio />} label="Uniform" />
                                <TextField id="outlined-basic-x" label="X" variant="outlined" size="small" inputProps={{ min: 0, style: { fontSize: 12 } }}
                                    value={num_seeds_uniformed_x} onChange={handleChangeUnifomedX} 
                                />
                                <TextField id="outlined-basic-y" label="Y" variant="outlined" size="small" inputProps={{ min: 0, style: { fontSize: 12 } }}
                                    value={num_seeds_uniformed_y} onChange={handleChangeUnifomedY} 
                                />
                                <TextField id="outlined-basic-z" label="Z" variant="outlined" size="small" inputProps={{ min: 0, style: { fontSize: 12 } }}
                                    value={num_seeds_uniformed_z} onChange={handleChangeUnifomedZ} 
                                />
                            </Stack>

                    </Box>

                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '100%' },
                        }}
                        noValidate
                        autoComplete="off"
                        >
                         <Stack direction="row" alignItems="center" spacing={0}>

                                <FormControlLabel value="manually" control={<Radio />} label="Insert Manually" />
                                <TextField label="X" variant="outlined" size="small" inputProps={{ min: 0, style: { fontSize: 12 } }}
                                    value={insert_seed_x} onChange={handleChangeSeedX} 
                                />
                                <TextField  type ="number"  label="Y" variant="outlined" size="small" inputProps={{ min: 0, style: { fontSize: 12 } }}
                                    value={insert_seed_y} onChange={handleChangeSeedY} 
                                />
                                <TextField  type ="number"  label="Z" variant="outlined" size="small" inputProps={{ min: 0, style: { fontSize: 12 } }}
                                    value={insert_seed_z} onChange={handleChangeSeedZ} 
                                />
                        </Stack>
                    </Box>

                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '100%' },
                        }}
                        noValidate
                        autoComplete="off"
                        >
                        <Stack direction="row" alignItems="center" spacing={0}>
                                <FormControlLabel value="upload" control={<Radio />} label="Upload Seed File" />
                                <Button component="label" variant="outlined" startIcon={<UploadFileIcon />} size="small"> Upload 
                                    <input hidden type="file" onChange={handleUploadSeedFile}/> 
                                </Button>
                        </Stack>
                    </Box>
                </RadioGroup>
                <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '100%' },
                        }}
                        noValidate
                        autoComplete="off"
                        >
                        <Stack direction="row" alignItems="center" spacing={2}>
                                <Button component="label" variant="outlined" startIcon={<AddBoxIcon />} size="small" onClick={AddSeeds}> Add Seeds 
                                </Button>
                                <Button component="label" variant="outlined" startIcon={<DeleteIcon />} onClick={DeleteSeedsFunc} size="small"> Delete Seeds
                                </Button>
                        </Stack>
                    </Box>
        </FormControl>
    )
}

export default observer(PlaceSeeds)
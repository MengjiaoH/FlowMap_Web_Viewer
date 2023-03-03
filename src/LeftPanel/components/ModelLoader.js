import React, {useContext, useEffect, useState} from 'react'
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { observer } from "mobx-react";
import Store from '../../Context/RootStore'
import {InferenceSession, Tensor, Env} from 'onnxruntime-web';
// import * as ort from 'onnxruntime-web';
const ort = require('onnxruntime-web');

const JsonLoader = (store, jsondata) => {
    const mode = jsondata.mode;
    store.modelStore.Mode = mode;
    // number of models 
    const num_models = jsondata.num_models;
    store.modelStore.SetNumModels = num_models;
    // console.log("number of models: ", num_models, store.modelStore.num_models);
    // dimension
    const lower_x = jsondata.bbox_x_lower;
    const lower_y = jsondata.bbox_y_lower;
    const lower_z = jsondata.bbox_z_lower;
    const upper_x = jsondata.bbox_x_upper;
    const upper_y = jsondata.bbox_y_upper;
    const upper_z = jsondata.bbox_z_upper;
    store.modelStore.DataBounds(lower_x, upper_x, lower_y, upper_y, lower_z, upper_z);

    store.modelStore.StepSize = jsondata.step_size;
    store.modelStore.Interval = jsondata.interval;

    for(let i = 0; i < num_models; i++){
        const model_info = jsondata.models[i];
        const model_dir = model_info.filename;
        // start/ stop cycle
        const start_cycle = model_info.start_cycle;
        const stop_cycle = model_info.stop_cycle;
        // training data bounding box 
        const b0 = model_info.bounding_0;
        const b1 = model_info.bounding_1;
        const b2 = model_info.bounding_2;
        const b3 = model_info.bounding_3;
        const b4 = model_info.bounding_4;
        const b5 = model_info.bounding_5;
        store.modelStore.AddOneModelDir(model_dir);
        store.modelStore.AddStartStopCycles(start_cycle, stop_cycle);
        store.modelStore.TrainingBounds(b0, b1, b2, b3, b4, b5, i);
        // console.log("training boundings: ", i, b0, b1, b2, b3, b4, b5)
    }
    store.modelStore.GenFileCycles();
    // console.log(store.modelStore.model_dirs)
   
    // global view uniformed dimensions
    // const d0 = jsondata.global_uniformed_dim_x;
    // const d1 = jsondata.global_uniformed_dim_y;
    // const d2 = jsondata.global_uniformed_dim_z;
    // store.modelStore.GlobalUnifomedDims(d0, d1, d2); 
};

const ModelLoader = () => {
    const store = useContext(Store);
    const [dataset, setDataset] = useState('');

    const handleChangeDataset = (event) => {
        setDataset(event.target.value);
        store.SetDataSet = event.target.value;
    };

    useEffect(() =>{
        if (store.reset){
            console.log("reset dataset")
            setDataset(store.modelStore.dataset)
        }
    }, [store.modelStore.dataset, store.reset])

    useEffect(() => {
        const warmupModel = async (model) =>{
            // const warmupTensor = new Tensor(new Float32Array(40), "float32", [10, 4])
            const warmupTensor_1 = new Tensor("float32", new Float32Array(3000), [1000, 3]);
            const warmupTensor_2 = new Tensor("float32", new Float32Array(1000), [1000, 1]);
            const feeds = { input_1: warmupTensor_1, input_2: warmupTensor_2};
            try {
                await model.run(feeds);
            } catch (e) {
                console.error(e);
            }
        }

        const load_model = async (model_dir, index) => {
            console.log("loading onnx model " + model_dir, index);
            // ort.env.logLevel = "verbose";
            ort.env.debug = false;
            ort.env.wasm.numThreads = 20;
            ort.env.wasm.simd = true;
            const session = await InferenceSession.create(model_dir, {executionProviders: ['wasm']});
            // , intraOpNumThreads: 4, interOpNumThreads: 4, enableCpuMemArena:true
            await warmupModel(session).then(() =>{
            //     console.log("done warm up")
                store.modelStore.LoadModel(session, index);
                store.modelStore.ModelLoadDone = true;
            })
            
            
            // console.log("store.pipeline", store.pipeline_browser);
        }
       
       if(dataset !== ''){
            
            // Load data infomation
            const json_dir = "./models/" + dataset + "/" + dataset + ".json";
            fetch(json_dir).then(response => {return response.json();})
                            .then(jsondata => {
                                JsonLoader(store, jsondata);   
                                // add global domain into pipeline browser
                                // console.log(store.modelStore.global_dimensions, store.modelStore.global_domain, store.modelStore.global_center)
                                store.AddToPipeline("Global Domain", store.modelStore.global_dimensions, store.modelStore.global_center);       
            }).then(() =>{
                
                // console.log("number of models", store.modelStore.num_models);
                for(let i = 0; i < store.modelStore.num_models; i++){
                    const model_dir = "./models/" + dataset + "/models/" + store.modelStore.model_dirs[i];
                    var startTime = performance.now();
                    console.log("start time", startTime)
                    load_model(model_dir, i).then(() =>{
                        // console.log("Load done", i);
                        var endTime = performance.now() 
                        console.log("endTime", endTime)
                        console.log(`Call to Loading model took ${endTime - startTime} milliseconds`)
                        // console.timeEnd("load model")
                    });
                }
                
            });
       } 
       
        
      }, [dataset, store]);

    //   useEffect(()=>{

    //     if (store.modelStore.num_models !== 0){
    //         console.log("num of models", store.modelStore.num_models);
    //     }
    //   }, [store.modelStore.num_models])

    return (
        <FormControl variant="filled" sx={{ m: 1, fullWidth:true}}>
            <InputLabel id="demo-simple-select-label">Model</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={dataset}
                label="Model"
                onChange={handleChangeDataset}
            >
                
                <MenuItem value={"isabel"}>Hurricane</MenuItem>
                <MenuItem value={"scalarflow"}>ScalarFlow</MenuItem>
                <MenuItem value={"ABC"}>ABC</MenuItem>
            </Select>
        </FormControl>
   )
}

export default observer(ModelLoader)

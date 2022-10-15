import React, {useContext, useEffect, useState} from 'react'
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { observer } from "mobx-react";
import Store from '../../Context/RootStore'
import {InferenceSession, Tensor} from 'onnxruntime-web';


const JsonLoader = (store, jsondata) => {
    // dimension
    const lower_x = +jsondata.bbox_x_lower;
    const lower_y = +jsondata.bbox_y_lower;
    const lower_z = +jsondata.bbox_z_lower;
    const upper_x = +jsondata.bbox_x_upper;
    const upper_y = +jsondata.bbox_y_upper;
    const upper_z = +jsondata.bbox_z_upper;
    // start/ stop cycle
    const start_cycle = +jsondata.start_cycle;
    const stop_cycle = +jsondata.stop_cycle;
    // interval and step size
    const interval = +jsondata.interval;
    const step_size = +jsondata.step_size;
    // training data bounding box 
    const b0 = +jsondata.bounding_0;
    const b1 = +jsondata.bounding_1;
    const b2 = +jsondata.bounding_2;
    const b3 = +jsondata.bounding_3;
    const b4 = +jsondata.bounding_4;
    const b5 = +jsondata.bounding_5;
    // global view uniformed dimensions
    const d0 = +jsondata.global_uniformed_dim_x;
    const d1 = +jsondata.global_uniformed_dim_y;
    const d2 = +jsondata.global_uniformed_dim_z;
    
    store.modelStore.DataBounds(lower_x, upper_x, lower_y, upper_y, lower_z, upper_z);
    store.modelStore.FlowMapProps(start_cycle, stop_cycle, interval, step_size);
    store.modelStore.TrainingBounds(b0, b1, b2, b3, b4, b5);
    store.modelStore.GlobalUnifomedDims(d0, d1, d2); 
    // console.log("training boundings: ", b0, b1, b2, b3, b4, b5)
    // store.modelStore.SeedBoxDims((upper_x - lower_x) * 0.5, (upper_y - lower_y) * 0.5, (upper_z - lower_z) * 0.5);
    // store.modelStore.setSeedBoxPos((upper_x - lower_x) * 0.5, (upper_y - lower_y) * 0.5, (upper_z - lower_z) * 0.5);
    // store.modelStore.setSeedsPlaneDims(store.dataDims);
    // store.controlStore.ShowNumFM = (stop_cycle - start_cycle) / interval;
    // store.renderStore.RenderNumFM = (stop_cycle - start_cycle) / interval;
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
            const warmupTensor_1 = new Tensor("float32", new Float32Array(30), [10, 3]);
            const warmupTensor_2 = new Tensor("float32", new Float32Array(10), [10, 1]);
            const feeds = { input_1: warmupTensor_1, input_2: warmupTensor_2};
            try {
                await model.run(feeds);
            } catch (e) {
                console.error(e);
            }
        }
        const load_model = async (model_dir) => {
            console.log("loading onnx model " + model_dir);
            const session = await InferenceSession.create(model_dir, {executionProviders: ['wasm']});
            await warmupModel(session);
            store.modelStore.LoadModel = session;
            store.modelStore.ModelLoadDone = true;
            // console.log("store.pipeline", store.pipeline_browser);
        }
       
        if (dataset === "ABC"){
            const model_dir = "./models/" + dataset + "/models/" + dataset + ".onnx";
            load_model(model_dir).then(() =>{
                console.log("Load done");
            });
            // Load data infomation
            const json_dir = "./models/" + dataset + "/" + dataset + ".json";
            fetch(json_dir).then(response => {return response.json();})
                           .then(jsondata => {
                                JsonLoader(store, jsondata);   
                                // add global domain into pipeline browser
                                store.AddToPipeline("Global Domain", store.modelStore.dataDims, store.modelStore.dataCenter);       
             });
        }
      }, [dataset, store]);

    return (
        <FormControl variant="filled" sx={{ m: 1, minWidth: 150}}>
            <InputLabel id="demo-simple-select-label">Model</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={dataset}
                label="Model"
                onChange={handleChangeDataset}
            >
                <MenuItem value={"ABC"}>ABC</MenuItem>
            </Select>
        </FormControl>
   )
}

export default observer(ModelLoader)
import { makeAutoObservable } from "mobx";

export class ModelStore {
    rootStore;

    num_models;
    dataset;
    mode;
    
    model_dirs;
    models; // a list of models
    model_load;
    global_domain;
    global_center;
    global_dimensions;
    start_cycles;
    stop_cycles;
    interval;
    step_size;
    total_num_fm;

    times;

    trainingBbox;

    globalUniformedDims;


    constructor(rootstore) {
        this.rootStore = rootstore;
        this.mode = "";
        this.dataset = "";
        this.num_models = 0;
        this.model_dirs = [];
        this.models = [];
        this.model_load = false;
        this.global_domain = [0, 0, 0, 0, 0, 0];
        this.global_center = [0, 0, 0];
        this.dataglobal_dimensionsDims = [0, 0, 0];
        this.start_cycles = [];
        this.stop_cycles = [];
        this.interval = 0;
        this.step_size = 0;
        this.total_num_fm = 0;
        this.trainingBbox = [];
        this.times = null;
        this.globalUniformedDims = [0, 0, 0];
        makeAutoObservable(this);
    }

    set SetNumModels(n){
        this.num_models = n;
        for(let i = 0; i < n; i++){
            this.models.push(null);
            this.trainingBbox.push([]);
        }
    }
    set SetDataSet(dataset){
        this.dataset = dataset;
    }

    LoadModel(model, index){
        this.models[index] = model;
    }
    set ModelLoadDone(status){
        this.model_load = status;
    }
    set Mode(mode){
        this.mode = mode;
    }

    // Set Data BoundingBox
    DataBounds(lower_x, upper_x, lower_y, upper_y, lower_z, upper_z){
        this.global_domain = [lower_x, lower_y, lower_z, upper_x, upper_y, upper_z];
        this.global_center = [(upper_x - lower_x) / 2.0, (upper_y - lower_y) / 2.0, (upper_z - lower_z) / 2.0];
        this.global_dimensions = [upper_x - lower_x, upper_y - lower_y, upper_z - lower_z]
    }
    AddOneModelDir(model_dir){
        this.model_dirs.push(model_dir);
    }
    set Interval(interval){
        this.interval = interval;
    }
    set StepSize(step_size){
        this.step_size = step_size;
    }
    
    AddStartStopCycles(start, stop){
        this.start_cycles.push(start);
        this.stop_cycles.push(stop);
        this.total_num_fm = this.total_num_fm + (stop - start) / this.interval;
        this.rootStore.renderStore.render_num_fm = this.total_num_fm;
        
        
        
    }

    GenFileCycles(){
        const t_start = 1 * this.interval * this.step_size;
        const t_end = (this.total_num_fm / this.num_models) * this.step_size * this.interval;
        console.log(t_start, t_end)
        this.times = new Array(this.total_num_fm / this.num_models).fill(0).map((u, i) =>
             ((i+1) * this.interval * this.step_size - t_start) / (t_end - t_start) * (1 - (-1)) +  (-1)
            // console.log(i)
            )
        // console.log("this.time", this.times)

    }

    TrainingBounds(lower_x, upper_x, lower_y, upper_y, lower_z, upper_z, index){
        this.trainingBbox[index] = [lower_x, lower_y, lower_z, upper_x, upper_y, upper_z];
    }
    GlobalUnifomedDims(x, y, z){
        this.globalUniformedDims = [x, y, z];
    }

    Reset(){
        this.dataset = "";
        this.model = null;
        this.model_load = false;
        this.dataBounds = [0, 0, 0, 0, 0, 0];
        this.dataCenter = [0, 0, 0];
        this.dataDims = [0, 0, 0];
        this.start_cycle = 0;
        this.stop_cycle = 0;
        this.interval = 0;
        this.num_fm = 0;
        this.step_size = 0;
        this.trainingBbox = [0, 0, 0];
        this.globalUniformedDims = [0, 0, 0];
    }

}
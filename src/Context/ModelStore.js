import { makeAutoObservable } from "mobx";

export class ModelStore {
    rootStore;

    dataset;
    model;
    model_load;
    dataBounds;
    dataCenter;
    dataDims;
    start_cycle;
    stop_cycle;
    interval;
    step_size;
    num_fm;

    trainingBbox;

    globalUniformedDims;


    constructor(rootstore) {
        this.rootStore = rootstore;
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
        makeAutoObservable(this);
    }

    set SetDataSet(dataset){
        this.dataset = dataset;
    }

    set LoadModel(model){
        this.model = model;
    }
    set ModelLoadDone(status){
        this.model_load = status;
    }

    // Set Data BoundingBox
    DataBounds(lower_x, upper_x, lower_y, upper_y, lower_z, upper_z){
        this.dataBounds = [lower_x, lower_y, lower_z, upper_x, upper_y, upper_z];
        this.dataCenter = [(upper_x - lower_x) / 2.0, (upper_y - lower_y) / 2.0, (upper_z - lower_z) / 2.0];
        this.dataDims = [upper_x - lower_x, upper_y - lower_y, upper_z - lower_z]
    }
    FlowMapProps(start, stop, interval, step_size){
        this.start_cycle = start;
        this.stop_cycle = stop;
        this.interval = interval;
        this.step_size = step_size;
        this.num_fm = (stop - start) / interval;
        this.rootStore.renderStore.num_fm = this.num_fm;
    }
    TrainingBounds(lower_x, upper_x, lower_y, upper_y, lower_z, upper_z){
        this.trainingBbox = [lower_x, lower_y, lower_z, upper_x, upper_y, upper_z];
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
import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';
import {DrawerStore} from './DrawerStore'
import {ModelStore} from './ModelStore'
import { BoundingBoxStore } from './BoundingBoxStore';
import { SeedBoxStore } from './SeedBoxStore';
import { PlaceSeedsStore } from './PlaceSeedsStore';
import { RenderStore } from './RenderStore'
import { ColorOptionsStore } from './ColorOptionsStore';

export class RootStore {
    drawerStore;
    modelStore;
    bboxStore;
    seedBoxStore;
    placeSeedsStore;
    renderStore;
    colorOptionsStore;

    pipeline_browser;
    pipeline_color;
    pipeline_selected;
    pipline_box_dims;
    pipeline_box_pos;
    
    reset;
    constructor() {
        this.drawerStore = new DrawerStore(this);
        this.modelStore = new ModelStore(this);
        this.bboxStore = new BoundingBoxStore(this);
        this.seedBoxStore = new SeedBoxStore(this);
        this.placeSeedsStore = new PlaceSeedsStore(this);
        this.renderStore = new RenderStore(this);
        this.colorOptionsStore = new ColorOptionsStore(this);

        this.pipeline_browser = []; // keep all 
        this.pipeline_color = [];
        this.pipeline_box_pos = [];
        this.pipeline_box_dims = [];
        this.pipeline_selected = -1;
        this.reset = false;

        makeAutoObservable(this);
    }

    AddToPipeline(name, dim, pos){
        this.pipeline_browser.push(name);
        this.pipeline_color.push('black');
        this.pipeline_box_pos.push(pos);
        this.pipeline_box_dims.push(dim);
        this.renderStore.AddEmptyArray();
    }

    UpdatePipelineColor(id){
        this.pipeline_color = this.pipeline_color.map((color, i) =>{
            if (i === id){
                if (color === 'red'){
                    return 'black';
                }
                if (color === 'black'){
                    return 'red';
                }
            }
            return 'black';
        })
        
        if(this.pipeline_color[id] === 'red'){
            this.pipeline_selected = id;
        }else{
            this.pipeline_selected = -1;
        }

        // console.log("update_selected_id", this.pipeline_selected)
    }

    UpdatePipelineBoxPos(id, pos){
        this.pipeline_box_pos[id] = pos;
    }
    UpdatePipelineBoxDim(id, dim){
        this.pipeline_box_dims[id] = dim;
    }

    DeletePipeline(id){
        this.pipeline_browser.splice(id, 1);
        this.pipeline_color.splice(id, 1);
        // delete the seeds in this pipeline
        this.renderStore.DeleteASeedBox(id);
        
        if(this.pipeline_selected === id){
            this.pipeline_selected = -1;
        }
    }

    Reset(){
        this.pipeline_browser = []; // keep all 
        this.pipeline_color = [];
        this.pipeline_selected = -1;
        // reset all store
        this.seedBoxStore.Reset();
        this.modelStore.Reset();
        this.drawerStore.Reset();
        this.bboxStore.Reset();
        this.renderStore.Reset();
        this.reset = true;
    }

}


const Store = createContext(new RootStore());
export default Store;
import { makeAutoObservable } from "mobx";
import {evaluate_cmap} from '../js-colormaps.js'
import Store from "./RootStore.js";

function ColorToHex(color) {
    var hexadecimal = color.toString(16);
    return hexadecimal.length === 1 ? "0" + hexadecimal : hexadecimal;
}
  
function ConvertRGBtoHex(red, green, blue) {
    return "#" + ColorToHex(red) + ColorToHex(green) + ColorToHex(blue);
}

export class RenderStore {
    rootStore;

    seeds;
    render_seeds;
    trajs;
    render_trajs;
    colors;
    total_num_seeds;
    render_num_seeds;
    initial_color;
    render_num_fm;

    seeds_update;
    trajs_update;

    constructor(rootstore) {
        this.rootStore = rootstore;
        this.seeds = [];
        this.render_seeds = [];
        this.trajs = [];
        this.render_trajs = [];
        this.colors = [];
        this.total_num_seeds = 0;
        this.render_num_seeds = 0;
        this.initial_color = '#277BC0';
        this.seeds_update = false;
        this.trajs_update = false;
        this.render_num_fm = 0;
    
        makeAutoObservable(this);
    }

    AddEmptyArray(){
        this.seeds.push([]);
        this.render_seeds.push([]);
        this.colors.push([]);
        this.trajs.push([]);
        this.render_trajs.push([]);
    }

    add_seeds(pos, index){
        if (index === -1){
            index = 0;
        }
        this.seeds[index].push(pos);
        this.render_seeds[index].push(pos);
        let temp_traj = new Array(this.render_num_fm).fill(pos);
        // console.log("temp_traj", temp_traj)

        this.trajs[index].push(temp_traj);
        this.render_trajs[index].push(temp_traj);
        this.colors[index].push(this.initial_color);
        this.total_num_seeds += 1;
        this.render_num_seeds += 1;
        // console.log("render seeds:", this.render_seeds)
    }

    add_trajs(pos, seed_index, pipeline_index, fc_index){
        if (pipeline_index === -1){
            pipeline_index = 0
        }
        this.trajs[pipeline_index][seed_index][fc_index] = pos;
        this.render_trajs[pipeline_index][seed_index][fc_index] = pos;
    }

    DeleteASeedBox(id){
        const num = this.seeds[id].length;
        this.seeds.splice(id, 1);
        this.render_seeds.splice(id, 1);
        this.colors.splice(id, 1);
        this.trajs.splice(id, 1);
        this.render_trajs.splice(id, 1);
        this.render_num_seeds = this.render_num_seeds - num;
        this.total_num_seeds = this.total_num_seeds - num;
    }

    DeleteSeeds(id){
        if (id === 0 || id === -1){
            this.seeds = this.seeds.map((seeds) =>{
                return [];
            });
            this.render_seeds = this.render_seeds.map(()=>{
                return [];
            })
            this.colors = this.colors.map(()=>{
                return [];
            })
            this.render_num_seeds = 0;
            this.total_num_seeds = 0;
        }else{
            this.render_num_seeds = this.render_num_seeds - this.render_seeds[id].length;
            this.total_num_seeds = this.total_num_seeds - this.seeds[id].length;
            this.seeds[id] = [];
            this.render_seeds[id] = [];
            this.colors[id] = [];
        }
    }

    SetConstantColor(color, id){

        if (id === 0 || id === -1){
            this.colors = this.seeds.map((seeds)=>{
                return seeds.map(() =>{
                    return color;
                })
            })
        }else{
            this.colors[id] = this.seeds[id].map(() =>{
                return color;
            })
        }   
        this.seeds_update = !this.seeds_update;
    }

    SetAttributeColor(values, id){
        const data_range = this.rootStore.colorOptionsStore.data_range;
        // console.log("data range:", data_range);
        this.colors[id] = values.map((value, v) =>{
            // console.log("interpolation value", value);
            let normalized_value = (value - data_range[0]) / (data_range[1] - data_range[0]);
            // console.log("interpolation results", value, normalized_value);
            const color = evaluate_cmap(normalized_value, 'viridis', false);
            return ConvertRGBtoHex(color[0], color[1], color[2])
            // store.renderStore.addColorToArray(ConvertRGBtoHex(color[0], color[1], color[2]), id, v);
        })
        this.seeds_update = !this.seeds_update;
    }

    SetSeedsInVisible(id, clickedVisibility){
        if (id === -1){
            id = 0;
        }
        if (clickedVisibility){
            if (id === 0){
                this.seeds.forEach((seeds, s)=>{
                    this.render_seeds[s] = [...seeds];
                });
                this.render_num_seeds = this.total_num_seeds;
                this.trajs.forEach((trajs, t) =>{
                    this.render_trajs[t] = [...trajs];
                })
            }else{
                this.render_seeds[id] = this.seeds[id];
                this.render_trajs[id] = this.trajs[id];
                this.render_num_seeds = this.render_num_seeds + this.render_seeds[id].length;
            }
        }else{
            if (id === 0){
                this.render_seeds = this.render_seeds.map(()=>{
                    return [];
                })
                this.render_trajs = this.render_trajs.map(()=>{
                    return [];
                })
                this.render_num_seeds = 0;
            }else{
                this.render_seeds[id] = [];
                this.render_trajs[id] = [];
                this.render_num_seeds = this.render_num_seeds - this.seeds[id].length;
            }
        }
        // console.log("render_seeds in invisibe:", this.render_seeds);    
    }

    Update_Trajs(){
        this.trajs_update = !this.trajs_update;
    }

    Update_NumFM(new_fm){
        this.render_num_fm = new_fm;
        let id = this.rootStore.pipeline_selected;
        if (id === -1){
            id = 0;
        }
        this.render_trajs[id] = this.trajs[id].map((trajs, j) =>{
            return trajs.slice(0, new_fm);
        })
    }
    

    Reset(){
        this.seeds = [];
        this.render_seeds = [];
        this.trajs = [];
        this.render_trajs = [];
        this.colors = [];
        this.update_seeds = false;
        this.total_num_seeds = 0;
        this.render_num_seeds = 0;
    }
}
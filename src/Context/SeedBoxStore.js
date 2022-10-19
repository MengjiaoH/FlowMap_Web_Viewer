import { makeAutoObservable } from "mobx";

export class SeedBoxStore {
    rootStore;
    num_seed_boxes;
    seed_box_dims; 
    seed_box_pos;
    seed_box_color;
    seed_box_visibility;

    selected_box_index;

    constructor(rootstore) {
        this.rootStore = rootstore;
        this.num_seed_boxes = 0;
        this.seed_box_dims = [];
        this.seed_box_pos = [];
        this.seed_box_color = [];
        this.seed_box_visibility = [];

        this.selected_box_index = -1;
        makeAutoObservable(this);
    }
    AddOneSeedBox(dim_x, dim_y, dim_z, pos_x, pos_y, pos_z){
        this.seed_box_dims.push([dim_x, dim_y, dim_z]);
        // const pos_x = (x - this.rootStore.boundings[0]/2) + dim_x/2;
        // const pos_y = (y - this.rootStore.boundings[1]/2) + dim_y/2;
        // const pos_z = (z - this.rootStore.boundings[2]/2) + dim_z/2;
        this.seed_box_pos.push([pos_x, pos_y, pos_z]);
        this.seed_box_color.push('black');
        this.seed_box_visibility.push(true);
        //update num seed boxes
        this.num_seed_boxes = this.num_seed_boxes + 1;
        // console.log("seed dim", dim_x, dim_y, dim_z, this.seed_box_dims)
    }

    EditSeedBoxPos(new_pos, index){
        this.seed_box_pos[index] = new_pos;
    }
    EditSeedBoxDim(new_dim, index){
        this.seed_box_dims[index] = new_dim;
    }

    set SelectedBoxIndex(index){
        this.selected_box_index = index;
    }

    UpdateSeedBoxColor(id){
        if (id === 0){
            this.seed_box_color = this.seed_box_color.map((_, i) =>{
                return 'black';
             })
        }else{
            this.seed_box_color = this.seed_box_color.map((color, i) =>{
            if (i === id - 1){
                if (color === 'red'){
                    return 'black';
                }
                if (color === 'black'){
                    return 'red';
                }
            }
            return 'black';
        })
        }
    }

    UpdateSeedBoxVisibility(id, status){
        this.seed_box_visibility[id] = status;
    }

    DeleteSeedBox(id){
        this.seed_box_dims.splice(id, 1);
        this.seed_box_pos.splice(id, 1);
        this.seed_box_color.splice(id, 1);
        this.seed_box_visibility.splice(id, 1);
        this.num_seed_boxes = this.num_seed_boxes - 1;
    }

    Reset(){
        this.num_seed_boxes = 0;
        this.seed_box_dims = [];
        this.seed_box_pos = [];
        this.seed_box_color = [];
        this.seed_box_visibility = [];

        this.selected_box_index = -1;

    }

}
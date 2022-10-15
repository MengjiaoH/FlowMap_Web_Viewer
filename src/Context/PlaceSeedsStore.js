import { makeAutoObservable } from "mobx";

export class PlaceSeedsStore {
    rootStore;

    seeding_strategy;
    num_random_seeds;
    uniform_seeds_dims;
    num_uniform_seeds;
    manual_seed_pos;
    uploaded_seed_file;
    uploaded_seeds;

    constructor(rootstore) {
        this.rootStore = rootstore;
        this.seeding_strategy = 'random';
        this.num_random_seeds = 0;
        this.uniform_seeds_dims = [0, 0, 0];
        this.num_uniform_seeds = 0;
        this.manual_seed_pos = [0, 0, 0];
        this.uploaded_seed_file = "";
        this.uploaded_seeds = [];

        makeAutoObservable(this);
    }

    set NumRandomSeeds(num){
        this.num_random_seeds = num;
    }

    set SeedingStrategy(str){
        this.seeding_strategy = str;
    }

    SetUniformSeedsDim(dims){
        this.uniform_seeds_dims = dims;
        this.num_uniform_seeds = dims[0] * dims[1] * dims[2];
    }

    SetManualSeedPos(pos){
        this.manual_seed_pos = pos;
    }
    LoadSeedsFromFile(s){
        this.uploaded_seeds.push(s);
    }

    Reset(){
        this.seeding_strategy = 'random';
        this.num_random_seeds = 0;
        this.uniform_seeds_dims = [0, 0, 0];
        this.num_uniform_seeds = 0;
        this.manual_seed_pos = [0, 0, 0];
        this.uploaded_seed_file = "";
        this.uploaded_seeds = [];
    }
}
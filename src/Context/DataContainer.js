import {createContext} from "react";
import { makeAutoObservable } from 'mobx';
import {SeedPlacementConfigData} from "./SeedPlacementConfigData";
import {SeedboxConfigData} from "./SeedboxConfigData";

class DataContainer {
    domain
    trajectories

    seed_box_config

    seed_placement_config

    constructor() {
        this.domain = {bounds: [0, 1, 0, 1, 0, 1]}
        this.seedbox_config = new SeedboxConfigData()
        this.seed_placement_config = new SeedPlacementConfigData()

        makeAutoObservable(this)
    }
}


export const global_data = createContext(new DataContainer())
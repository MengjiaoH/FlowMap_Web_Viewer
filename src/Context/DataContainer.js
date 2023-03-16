import {createContext} from "react";
import {makeAutoObservable} from 'mobx';
import {SeedPlacementConfigData} from "./SeedPlacementConfigData";
import {SeedboxConfigData} from "./SeedboxConfigData";
import LineStyle from "./LineStyle";

class DataContainer {
    domain

    seedbox_config

    seed_placement_config

    constructor() {
        this.domain = {bounds: [0, 1, 0, 1, 0, 1]}
        this.seedbox_config = new SeedboxConfigData(this)
        this.seed_placement_config = new SeedPlacementConfigData(this)
        this.line_style_config = new LineStyle()
        this.line_style_config.makeObservable()
        makeAutoObservable(this)
    }
}


export const global_data = createContext(new DataContainer())
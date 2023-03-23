import {createContext} from "react";
import {makeAutoObservable} from 'mobx';
import SeedPlacementConfigData from "./SeedPlacementConfigData";
import SeedboxConfigData from "./SeedboxConfigData";
import LineStyle from "./LineStyle";
import ModelInfo from "./ModelInfo";
import Trajectories from "./Trajectories";
import ScalarFieldConfig from "./ScalarFieldConfig";

class DataContainer {

    constructor() {
        this.modelinfo = new ModelInfo(this)
        this.seedbox_config = new SeedboxConfigData(this)
        this.seed_placement_config = new SeedPlacementConfigData(this)
        this.line_style_config = new LineStyle(this)
        this.line_style_config.makeObservable()
        this.trajectories = new Trajectories(this)
        this.scalars_config = new ScalarFieldConfig(this)
        makeAutoObservable(this)
    }
}


export const global_data = createContext(new DataContainer())
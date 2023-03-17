import {createContext} from "react";
import {makeAutoObservable} from 'mobx';
import SeedPlacementConfigData from "./SeedPlacementConfigData";
import SeedboxConfigData from "./SeedboxConfigData";
import LineStyle from "./LineStyle";
import DomainSpec from "./DomainSpec";
import Trajectories from "./Trajectories";
import ParticleTraceConfig from "./ParticleTraceConfig";
import VolumeConfig from "./VolumeConfig";

class DataContainer {

    constructor() {
        this.domain = new DomainSpec(this)
        this.seedbox_config = new SeedboxConfigData(this)
        this.seed_placement_config = new SeedPlacementConfigData(this)
        this.line_style_config = new LineStyle(this)
        this.line_style_config.makeObservable()
        this.particle_trace_config = new ParticleTraceConfig(this)
        this.trajectories = new Trajectories(this)
        this.volume_config = new VolumeConfig(this)
        makeAutoObservable(this)
    }
}


export const global_data = createContext(new DataContainer())
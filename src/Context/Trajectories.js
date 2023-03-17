import {makeAutoObservable} from "mobx";

export default class Trajectories {

    constructor(root) {
        this.root = root
        this.seeds = []
        this.paths = []
        makeAutoObservable(this)
    }


    addSeeds(positions) {
        this.seeds = [...this.seeds, ...positions.map(pos => {
            return {
                seed: pos,
                style: this.root.line_style_config.getSeedStyle()
            }
        })]

        this.paths = [...this.paths, ...positions.map(x => {
            return {
                path: null,
                style: this.root.line_style_config.getLineStyle()
            }
        })]
    }

    traceParticles(trace_function) {
        this.paths = [...this.paths.map((path, i) => {
            return {
                path: path.path ? path.path : trace_function(this.seeds[i].seed),
                style: path.style
            }
        })]
    }

    applyStyle() {
        this.seeds = [...this.seeds.map(s => {
            return {seed: s.seed, style: this.root.line_style_config.getSeedStyle()}
        })]
        this.paths = [...this.paths.map(p => {
            return {path: p.path, style: this.root.line_style_config.getLineStyle()}
        })]
    }

    reset() {
        this.paths = []
        this.seeds = []
    }
}
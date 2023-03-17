import {makeAutoObservable} from "mobx";

export class Trajectries {

    constructor(root) {
        this.root = root
        this.seeds = []
        this.paths = []
        makeAutoObservable(this)
    }

    getSeeds() {
        return [...this.seeds]
    }

    addSeeds(positions) {
        this.seeds = [...this.seeds, ...positions.map(pos => {
            return {
                seed: pos,
                color: this.root.line_style_config.seed_color
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
                path: path.path ? path.path : trace_function(this.seeds[i]),
                style: path.style
            }
        })]
    }

    applyStyle() {
        this.seeds = [...this.seeds.map(s => {
            return {seed: s.seed, color: this.root.line_style_config.seed_color}
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
import {makeAutoObservable} from "mobx";
import {Vector3} from "three";

export default class Trajectories {

    constructor(root) {
        this.root = root
        this.seeds = []
        this.paths = []
        makeAutoObservable(this)
        this.updatePath = this.updatePath.bind(this)
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

        console.log("add seeds", this.seeds)
        console.log("add seeds", this.paths)
    }

    traceParticles(trace_function) {
        this.paths = [...this.paths.map((path, i) => {
            return {
                path: path.path ? path.path : trace_function(this.seeds[i].seed),
                style: path.style
            }
        })]
    }

    initPath(index, n) {
        this.paths[index].path = new Array(n).fill(new Vector3(0,0,0))
    }

    setPathPos(i, t, pos) {
        this.paths[i].path[t] = pos
    }

    updatePath(){
        this.paths = [...this.paths]
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
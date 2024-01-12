import {makeAutoObservable} from "mobx";
import {Vector3} from "three";

export default class Trajectories {

    constructor(root) {
        this.root = root
        this.seeds = []
        this.paths = []
        this.display_time = 0
        makeAutoObservable(this)
        this.updatePath = this.updatePath.bind(this)
        this.updateDisplayTime = this.updateDisplayTime.bind(this)
    }

    updateDisplayTime(time) {
        this.display_time = time
    }

    getMaxTime() {
        if (this.paths.length === 0 || this.paths[0].path == null) {
            return 0;
        } else {
            return this.paths[0].path.length
        }
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

    initPath(index, n) {
        this.paths[index].path = new Array(n).fill(null)
        const spos = this.seeds[index].seed
        this.paths[index].path[0] = new Vector3(spos[0], spos[1], spos[2])
    }

    setPathPos(i, t, pos) {
        this.paths[i].path[t] = pos
    }

    updatePath() {
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
        this.display_time = 0
        this.paths = []
        this.seeds = []
    }

    deleteTrace() {
        this.paths = [...this.paths.map(s => {
            return {path: null, style: s.style}
        })]
    }
}
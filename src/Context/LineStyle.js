import {makeAutoObservable} from "mobx";

export default class LineStyle {
    constructor(root) {
        this.root = root
        this.seed_color = "#000000"
        this.seed_scale = 1
        this.line_color = "#000000"
        this.line_segments = 1
        this.line_radius = 1
        this.reset()
    }

    reset() {
        this.seed_color = "#000000"
        this.seed_scale = 1
        this.line_color = "#000000"
        this.line_segments = 1
        this.line_radius = this.root.modelinfo.shortest_side / 200
    }

    makeObservable() {
        makeAutoObservable(this)
    }

    getSeedStyle() {
        return {color: this.seed_color, scale: this.seed_scale}
    }

    setSeedScale(v){
        this.seed_scale = v
    }

    getLineStyle() {
        return {color: this.line_color, segments: this.line_segments, radius: this.line_radius}
    }

    setSeedColor(v) {
        this.seed_color = v
    }

    setLineColor(v) {
        this.line_color = v
    }

    setLineSegments(v) {
        this.line_segments = v
    }

    setLineRadius(v) {
        this.line_radius = v
    }
}
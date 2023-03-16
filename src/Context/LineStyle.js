import {makeAutoObservable} from "mobx";

export default class LineStyle {
    constructor() {
        this.show_seed = true
        this.seed_color = "#000"
        this.line_color = "#000"
        this.line_segments = 1
        this.line_radius = 5
    }

    makeObservable(){
        makeAutoObservable(this)
    }

    copy() {
        const line = new LineStyle()
        line.show_seed = this.show_seed
        line.seed_color = this.seed_color
        line.line_color = this.line_color
        line.line_segments = this.line_segments
        line.line_radius = this.line_radius
        return line
    }

    setShowSeed(v) {
        this.show_seed = v
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
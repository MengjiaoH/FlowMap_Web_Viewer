import {makeAutoObservable} from "mobx";

export default class LineStyle {
    constructor() {
        this.seed_color = "#000000"
        this.line_color = "#000000"
        this.line_segments = 1
        this.line_radius = 5
    }

    makeObservable() {
        makeAutoObservable(this)
    }

    getSeedsColor() {
        return this.seed_color
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
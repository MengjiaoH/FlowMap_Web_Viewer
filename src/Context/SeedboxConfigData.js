import {makeAutoObservable} from "mobx";

export class SeedboxConfigData {
    bounds

    position

    display

    active

    constructor() {
        this.size = [0.5, 0.5, 0.5]
        this.position = [0.25, 0.25, 0.25]
        this.display = true
        this.active = true

        makeAutoObservable(this)
    }

    setDisplay(v) {
        if (v) {
            this.display = true
        } else {
            this.active = false
            this.display = false
        }
    }

    setActive(v) {
        if (v) {
            this.display = true
            this.active = true
        } else {
            this.active = false
        }
    }

    setSizeX(v) {
        this.size = [v, this.size[1], this.size[2]]
    }

    setSizeY(v) {
        this.size = [this.size[0], v, this.size[2]]
    }

    setSizeZ(v) {
        this.size = [this.size[0], this.size[1], v]
    }

    setPositionX(v) {
        this.position = [v, this.position[1], this.position[2]]
    }

    setPositionY(v) {
        this.position = [this.position[0], v, this.position[2]]
    }

    setPositionZ(v) {
        this.position = [this.position[0], this.position[1], v]
    }
}
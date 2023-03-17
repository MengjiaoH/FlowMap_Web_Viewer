import {makeAutoObservable} from "mobx";

export class SeedboxConfigData {
    constructor(root) {
        this.root = root
        this.size = [0, 0, 0]
        this.position = [0, 0, 0]
        this.display = false
        this.active = false

        this.reset()

        makeAutoObservable(this)
    }

    getBounds() {
        return [this.position[0], this.position[0] + this.size[0],
            this.position[1], this.position[1] + this.size[1],
            this.position[2], this.position[2] + this.size[2]]
    }

    reset() {
        this.display = false
        this.active = false
        const [x_min, x_max, y_min, y_max, z_min, z_max] = this.root.domain.bounds

        const [dx, dy, dz] = [x_max - x_min, y_max - y_min, z_max - z_min]
        this.position = [dx / 4 + x_min, dy / 4 + y_min, dz / 4 + z_min]
        this.size = [dx / 2, dy / 2, dz / 2]
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
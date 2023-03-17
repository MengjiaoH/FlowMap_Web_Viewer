import {makeAutoObservable} from "mobx";

export default class DomainSpec {

    bounds
    center
    diag
    shortest_side

    constructor(root) {
        this.root = root
        this.setBounds([0, 1, 0, 1, 0, 1])
        makeAutoObservable(this)
    }

    computesGeometry() {
        const [x_min, x_max, y_min, y_max, z_min, z_max] = this.bounds
        const sx = x_max + x_min
        const sy = y_max + y_min
        const sz = z_max + z_min
        const [dx, dy, dz] = [x_max - x_min, y_max - y_min, z_max - z_min]
        this.center = [sx / 2, sy / 2, sz / 2]
        this.diag = Math.sqrt((x_max - x_min) ** 2 + (y_max - y_min) ** 2 + (z_max - z_min) ** 2);
        this.shortest_side = Math.min(dx, dy, dz)
    }

    getBounds() {
        return [...this.bounds]
    }

    setBounds(array) {
        this.bounds = array
        this.computesGeometry()
        if (this.root.seedbox_config) {
            this.root.seedbox_config.reset()
        }
    }
}
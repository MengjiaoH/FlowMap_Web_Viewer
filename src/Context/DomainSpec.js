import {makeAutoObservable} from "mobx";

export default class DomainSpec {
    constructor(root) {
        this.root = root
        this.bounds = [0, 1, 0, 1, 0, 1]

        makeAutoObservable(this)
    }

    getBounds() {
        return [...this.bounds]
    }

    setBounds(array) {
        this.bounds = array

        if (this.root.seedbox_config) {
            this.root.seedbox_config.reset()
        }
    }
}
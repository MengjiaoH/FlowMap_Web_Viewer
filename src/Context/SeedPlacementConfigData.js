import {makeAutoObservable} from "mobx";

export class SeedPlacementConfigData {

    root

    use_random_strategy
    n_random_seed

    use_uniform_strategy

    uniform

    use_mannual_strategy

    manual

    constructor(root) {
        this.root = root
        this.use_random_strategy = false
        this.n_random_seed = 10
        this.use_uniform_strategy = false
        this.uniform = [10, 10, 10]
        this.use_mannual_strategy = false
        this.manual = [0, 0, 0]

        makeAutoObservable(this)
    }

    setUseManualStrategy(v) {
        this.use_mannual_strategy = v
    }

    setUseUniformStrategy(v) {
        this.use_uniform_strategy = v
    }

    setUseRandomStrategy(v) {
        this.use_random_strategy = v
    }

    setNRandomSeed(v) {
        this.n_random_seed = v
    }

    setUniformX(v) {
        this.uniform = [v, this.uniform[1], this.uniform[2]]
    }

    setUniformY(v) {
        this.uniform = [this.uniform[0], v, this.uniform[2]]
    }

    setUniformZ(v) {
        this.uniform = [this.uniform[0], this.uniform[1], v]
    }

    setManualX(v) {
        this.manual = [v, this.manual[1], this.manual[2]]
    }

    setManualY(v) {
        this.manual = [this.manual[0], v, this.manual[2]]
    }

    setManualZ(v) {
        this.manual = [this.manual[0], this.manual[1], v]
    }

}
import {ColorTransferFunction,OpacityTransferFunction} from "./TransferFunctions/TransferFunctions";

export default class VolumeConfig {
    constructor(root) {
        this.root = root

        this.status = "no volume loaded"

        this.dims = [1, 1, 1]

        this.scalars = []

        this.min_v = 0

        this.max_v = 1

        this.color_tf = null

        this.opacity_tf = null
    }
}
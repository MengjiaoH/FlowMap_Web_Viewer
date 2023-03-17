import {ColorTransferFunction, OpacityTransferFunction} from "../TransferFunctions/TransferFunctions";

export default class VolumeConfig {
    constructor(root) {
        this.root = root

        this.loaded = false

        this.dims = [1, 1, 1]

        this.scalars = []

        this.min_v = 0

        this.max_v = 1

        this.color_tf = null

        this.opacity_tf = null
    }

    setDimX(v) {
        this.dims = [v, this.dims[1], this.dims[2]]
    }

    setDimY(v) {
        this.dims = [this.dims[0], v, this.dims[2]]
    }

    setDimZ(v) {
        this.dims = [this.dims[0], this.dims[1], v]
    }
}
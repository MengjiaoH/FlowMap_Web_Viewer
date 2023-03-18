import {ColorTransferFunction, OpacityTransferFunction} from "../TransferFunctions/TransferFunctions";
import {makeAutoObservable} from "mobx";

export default class VolumeConfig {
    constructor(root) {
        this.root = root

        this.loaded = false

        this.data_name = ""

        this.dims = [1, 1, 1]

        this.scalars = []

        this.min_v = 0

        this.max_v = 1

        this.color_tf = null

        this.opacity_tf = null

        makeAutoObservable(this)

        this.updateOtf = this.updateOtf.bind(this)
    }

    updateOtf(otf) {
        this.opacity_tf = otf.copy()
    }

    updateCtf(ctf) {
        this.color_tf = ctf.copy()
    }

    setScalars(array, min_v, max_v, dataname, dims) {
        this.scalars = array
        this.loaded = true
        this.min_v = min_v
        this.max_v = max_v
        this.data_name = dataname
        this.dims = dims

        this.color_tf = new ColorTransferFunction(this.min_v, this.max_v)
        this.opacity_tf = new OpacityTransferFunction(this.min_v, this.max_v)
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
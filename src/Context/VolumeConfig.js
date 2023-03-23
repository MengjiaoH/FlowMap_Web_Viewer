import {ColorTransferFunction, OpacityTransferFunction} from "../TransferFunctions/TransferFunctions";
import {makeAutoObservable} from "mobx";
import {Vector3} from "three";
import * as THREE from "three";
import {linspace} from "../Utils/utils";

function volumeTexture(array, dim_x, dim_y, dim_z) {
    const volume_tex = new THREE.Data3DTexture(array, dim_x, dim_y, dim_z)
    volume_tex.format = THREE.RedFormat
    volume_tex.type = THREE.FloatType
    volume_tex.internalFormat = "R32F"
    volume_tex.minFilter = THREE.LinearFilter
    volume_tex.magFilter = THREE.LinearFilter
    volume_tex.wrapR = THREE.ClampToEdgeWrapping
    volume_tex.wrapT = THREE.ClampToEdgeWrapping
    volume_tex.wrapS = THREE.ClampToEdgeWrapping
    volume_tex.needsUpdate = true
    return volume_tex;
}

function tf_texture(otf, ctf) {
    const tf_res = 256
    const tf_data = new Float32Array(tf_res * 4)
    const data_range = [otf.v_min, otf.v_max]
    const scalar_values = linspace(data_range[0], data_range[1], tf_res)
    for (let i = 0; i < tf_res; ++i) {
        const c = ctf.color(scalar_values[i])
        const o = otf.opacity(scalar_values[i])
        tf_data[i * 4] = c[0]
        tf_data[i * 4 + 1] = c[1]
        tf_data[i * 4 + 2] = c[2]
        tf_data[i * 4 + 3] = o
    }
    const tf_tex = new THREE.DataTexture(tf_data, tf_res, 1)
    tf_tex.format = THREE.RGBAFormat
    tf_tex.type = THREE.FloatType
    tf_tex.internalFormat = "RGBA32F"
    tf_tex.minFilter = THREE.LinearFilter
    tf_tex.magFilter = THREE.LinearFilter
    tf_tex.wrapR = THREE.ClampToEdgeWrapping
    tf_tex.wrapT = THREE.ClampToEdgeWrapping
    tf_tex.wrapS = THREE.ClampToEdgeWrapping
    tf_tex.needsUpdate = true
    return tf_tex
}

function normalMap(array, dim_x, dim_y, dim_z) {
    const data = new Float32Array(dim_x * dim_y * dim_z * 4);
    let idx = 0;

    for (let zi = 0; zi < dim_z; ++zi) {
        for (let yi = 0; yi < dim_y; ++yi) {
            for (let xi = 0; xi < dim_x; ++xi) {
                const x_min = (xi === 0) ? 0 : xi - 1;
                const x_max = (xi === dim_x - 1) ? dim_x - 1 : xi + 1;
                const y_min = (yi === 0) ? 0 : yi - 1;
                const y_max = (yi === dim_y - 1) ? dim_y - 1 : yi + 1;
                const z_min = (zi === 0) ? 0 : zi - 1;
                const z_max = (zi === dim_z - 1) ? dim_z - 1 : zi + 1;

                data[idx++] = (array[x_max + yi * dim_x + zi * dim_x * dim_y] -
                    array[x_min + yi * dim_x + zi * dim_x * dim_y]) / (x_max - x_min)
                data[idx++] = (array[xi + y_max * dim_x + zi * dim_x * dim_y] -
                    array[xi + y_min * dim_x + zi * dim_x * dim_y]) / (y_max - y_min)
                data[idx++] = (array[xi + yi * dim_x + z_max * dim_x * dim_y] -
                    array[xi + yi * dim_x + z_min * dim_x * dim_y]) / (z_max - z_min)
                data[idx++] = 0
            }
        }
    }
    const normal_map = new THREE.Data3DTexture(data, dim_x, dim_y, dim_z)
    normal_map.format = THREE.RGBAFormat
    normal_map.type = THREE.FloatType
    normal_map.internalFormat = "RGBA32F"
    normal_map.minFilter = THREE.LinearFilter
    normal_map.magFilter = THREE.LinearFilter
    normal_map.wrapR = THREE.ClampToEdgeWrapping
    normal_map.wrapT = THREE.ClampToEdgeWrapping
    normal_map.wrapS = THREE.ClampToEdgeWrapping
    normal_map.needsUpdate = true
    return normal_map;
}
export default class VolumeConfig {
    constructor(root) {
        this.root = root

        this.loaded = false

        this.data_name = ""

        this.color_tf = null

        this.opacity_tf = null

        this.dims = [1,1,1]

        this.scalars = null

        this.volume_rendering = false

        this.uniforms = {
            camera_pos: {value: null},
            min_bb: {value: null},
            max_bb: {value: null},
            volume: {value: null},
            normal_map: {value: null},
            tf: {value: null},
            light_dir: {value: new Vector3(0,0,1)},
            step_size: {value: null},
            min_v: {value: null},
            max_v: {value: null}
        }

        makeAutoObservable(this)

        this.updateOtf = this.updateOtf.bind(this)
        this.setScalars = this.setScalars.bind(this)
    }

    setCamera(pos) {
        this.uniforms.camera_pos.value = pos
    }

    setMinBB(min_bb) {
        this.uniforms.min_bb.value = min_bb
    }

    setMaxBB(max_bb) {
        this.uniforms.max_bb.value = max_bb
    }

    setVolumeTexture(tex) {
        this.uniforms.volume.value = tex
    }

    setNormalMapTexture(tex) {
        this.uniforms.normal_map.value = tex
    }

    setTfTexure(tex) {
        this.uniforms.tf.value = tex
    }

    setLightDir(dir) {
        this.uniforms.light_dir = dir
    }

    setStepSize(ss) {
        this.uniforms.step_size.value = ss
    }

    setMinV(v) {
        this.uniforms.min_v.value = v
    }

    setMaxV(v) {
        this.uniforms.max_v.value = v
    }

    updateOtf(otf) {
        this.opacity_tf = otf.copy()
        this.setTfTexure(tf_texture(this.opacity_tf,this.color_tf))
    }

    updateCtf(ctf) {
        this.color_tf = ctf.copy()
        this.setTfTexure(tf_texture(this.opacity_tf,this.color_tf))
    }

    setScalars(array, min_v, max_v, dataname, dims) {
        this.scalars = array
        this.setLoaded(true)
        this.setMinV(min_v)
        this.setMaxV(max_v)
        this.data_name = dataname
        this.dims = dims
        this.setStepSize(this.root.modelinfo.diag / 1000)
        this.setVolumeTexture(volumeTexture(array,...dims))
        this.setNormalMapTexture(normalMap(array,...dims))
        this.color_tf = new ColorTransferFunction(this.uniforms.min_v.value, this.uniforms.max_v.value)
        this.opacity_tf = new OpacityTransferFunction(this.uniforms.min_v.value, this.uniforms.max_v.value)
        this.setTfTexure(tf_texture(this.opacity_tf,this.color_tf))
    }

    setLoaded(v) {
        if (v === true) {
            this.loaded = true
        } else {
            this.setVolumeRendering(false)
            this.loaded = false
        }
    }

    setVolumeRendering(v) {
        this.volume_rendering = v;
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
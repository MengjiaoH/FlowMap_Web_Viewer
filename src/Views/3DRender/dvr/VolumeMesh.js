import {volume_frag_shader, volume_vert_shader} from "./dvr_shaders";
import * as THREE from "three";
import {Vector3} from "three";
import {observer} from "mobx-react";
import React, {useContext, useMemo, useRef} from "react";
import {global_data} from "../../../Context/DataContainer";
import {linspace} from "../../../Utils/utils";
import {useFrame} from "@react-three/fiber";

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

function VolumeMesh(props) {
    const ref = useRef()
    const materialRef = useRef()

    const g_data = useContext(global_data)

    const [volume, normal_map] = useMemo(() => {
        const scalars = g_data.volume_config.scalars
        const dims = g_data.volume_config.dims
        return [volumeTexture(scalars, ...dims), normalMap(scalars, ...dims)]
    }, [g_data.volume_config.dims, g_data.volume_config.scalars])

    const tf = useMemo(() => {
        const otf = g_data.volume_config.opacity_tf
        const ctf = g_data.volume_config.color_tf
        const tf = tf_texture(otf, ctf)
        if (ref && ref.current) {
            ref.current.material.uniforms.tf.value = tf;
            ref.current.material.needsUpdate = true;
        }
        return tf_texture(otf, ctf)
    }, [g_data.volume_config.color_tf, g_data.volume_config.opacity_tf])

    const [min_v, max_v] = useMemo(() => {
        return [g_data.volume_config.min_v, g_data.volume_config.max_v]
    }, [g_data.volume_config.max_v, g_data.volume_config.min_v])

    const step_size = useMemo(() => {
        return g_data.volume_config.step_size
    }, [g_data.volume_config.step_size])


    const camera_pos = useMemo(() => {
        const camera_pos = props.camera_pos
        if (ref && ref.current) {
            ref.current.material.uniforms.camera_pos.value = camera_pos;
            ref.current.material.needsUpdate = true;
        }
        return camera_pos
    }, [props.camera_pos])

    const [min_bb, max_bb, ext] = useMemo(() => {
        const [min_x, max_x, min_y, max_y, min_z, max_z] = g_data.domain.bounds
        const [min_bb, max_bb] = [new Vector3(min_x, min_y, min_z), new Vector3(max_x, max_y, max_z)]

        return [min_bb, max_bb, [max_x - min_x, max_y - min_y, max_z - min_z]]
    }, [g_data.domain.bounds])

    console.log(camera_pos)

    const uniforms = useMemo(() => {
        return {
            camera_pos: {value: camera_pos},
            min_bb: {value: min_bb},
            max_bb: {value: max_bb},
            volume: {value: volume},
            normal_map: {value: normal_map},
            tf: {value: tf},
            light_dir: {value: new Vector3(0, 0, 1)},
            step_size: {value: step_size},
            min_v: {value: min_v},
            max_v: {value: max_v}
        }
    }, [])


    return <mesh ref={ref}>
        <boxGeometry args={[...ext]} position={[min_bb.x, min_bb.y, min_bb.z]}/>

        <rawShaderMaterial ref={materialRef}
                           attach="material"
                           glslVersion={THREE.GLSL3}
                           uniforms={uniforms}
                           vertexShader={volume_vert_shader}
                           fragmentShader={volume_frag_shader}
                           side={THREE.FrontSide}
                           transparent={true}
                           depthTest={true}
        />
    </mesh>
}

export default observer(VolumeMesh)
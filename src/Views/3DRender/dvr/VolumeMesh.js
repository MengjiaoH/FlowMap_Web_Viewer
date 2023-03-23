import {volume_frag_shader, volume_vert_shader} from "./dvr_shaders";
import * as THREE from "three";
import {Vector3} from "three";
import {observer} from "mobx-react";
import React, {useContext, useMemo, useRef} from "react";
import {global_data} from "../../../Context/DataContainer";


function VolumeMesh(props) {
    const ref = useRef()
    const materialRef = useRef()

    const g_data = useContext(global_data)
    const config = g_data.scalars_config
    const uniforms = config.uniforms


    const [min_bb, max_bb] = useMemo(() => {
        const [min_x, max_x, min_y, max_y, min_z, max_z] = g_data.modelinfo.bounds
        const [min_bb, max_bb] = [new Vector3(min_x, min_y, min_z), new Vector3(max_x, max_y, max_z)]

        return [min_bb, max_bb]
    }, [g_data.modelinfo.bounds])


    config.setMinBB(min_bb)
    config.setMaxBB(max_bb)
    config.setCamera(props.camera_pos)
    config.setLight(props.light_pos)

    const vertices = useMemo(() => {
        // front
        return new Float32Array([
            min_bb.x, min_bb.y, max_bb.z,
            max_bb.x, min_bb.y, max_bb.z,
            max_bb.x, max_bb.y, max_bb.z,
            min_bb.x, min_bb.y, max_bb.z,
            max_bb.x, max_bb.y, max_bb.z,
            min_bb.x, max_bb.y, max_bb.z,
            // back
            min_bb.x, max_bb.y, min_bb.z,
            max_bb.x, max_bb.y, min_bb.z,
            min_bb.x, min_bb.y, min_bb.z,
            max_bb.x, max_bb.y, min_bb.z,
            max_bb.x, min_bb.y, min_bb.z,
            min_bb.x, min_bb.y, min_bb.z,
            // top
            min_bb.x, max_bb.y, max_bb.z,
            max_bb.x, max_bb.y, max_bb.z,
            max_bb.x, max_bb.y, min_bb.z,
            min_bb.x, max_bb.y, max_bb.z,
            max_bb.x, max_bb.y, min_bb.z,
            min_bb.x, max_bb.y, min_bb.z,
            // bottom
            min_bb.x, min_bb.y, min_bb.z,
            max_bb.x, min_bb.y, min_bb.z,
            min_bb.x, min_bb.y, max_bb.z,
            max_bb.x, min_bb.y, min_bb.z,
            max_bb.x, min_bb.y, max_bb.z,
            min_bb.x, min_bb.y, max_bb.z,
            // right
            max_bb.x, min_bb.y, max_bb.z,
            max_bb.x, min_bb.y, min_bb.z,
            max_bb.x, max_bb.y, min_bb.z,
            max_bb.x, min_bb.y, max_bb.z,
            max_bb.x, max_bb.y, min_bb.z,
            max_bb.x, max_bb.y, max_bb.z,
            // left
            min_bb.x, max_bb.y, max_bb.z,
            min_bb.x, max_bb.y, min_bb.z,
            min_bb.x, min_bb.y, max_bb.z,
            min_bb.x, max_bb.y, min_bb.z,
            min_bb.x, min_bb.y, min_bb.z,
            min_bb.x, min_bb.y, max_bb.z
        ])
    },[max_bb.x, max_bb.y, max_bb.z, min_bb.x, min_bb.y, min_bb.z])

    return <mesh ref={ref}>
        <bufferGeometry>
            <bufferAttribute attach={'attributes-position'} count={vertices.length / 3} itemSize={3}
                             array={vertices}/>
        </bufferGeometry>

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
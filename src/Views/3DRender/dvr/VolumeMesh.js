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
    const config = g_data.volume_config
    const uniforms = config.uniforms


    const [min_bb, max_bb, ext] = useMemo(() => {
        const [min_x, max_x, min_y, max_y, min_z, max_z] = g_data.domain.bounds
        const [min_bb, max_bb] = [new Vector3(min_x, min_y, min_z), new Vector3(max_x, max_y, max_z)]

        return [min_bb, max_bb, [max_x - min_x, max_y - min_y, max_z - min_z]]
    }, [g_data.domain.bounds])

    config.setMinBB(min_bb)
    config.setMaxBB(max_bb)

    config.setCamera(props.camera_pos)


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
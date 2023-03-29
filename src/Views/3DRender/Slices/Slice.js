import {surface_vert_shader, surface_frag_shader} from "./surface_shader";
import * as THREE from "three";
import {Vector3} from "three";
import {observer} from "mobx-react";
import React, {useContext, useMemo, useRef} from "react";
import {global_data} from "../../../Context/DataContainer";
import {useFrame} from "@react-three/fiber";


function Slice(props) {
    const ref = useRef()
    const materialRef = useRef()

    const g_data = useContext(global_data)
    const config = g_data.scalars_config
    const uniforms = config.uniforms

    const [min_bb, max_bb] = useMemo(() => {
        return [uniforms.min_bb.value, uniforms.max_bb.value]
    }, [uniforms.max_bb.value, uniforms.min_bb.value])

    config.setCamera(props.camera_pos)

    const vertices = useMemo(() => {
        const value = props.value
        if (props.axis === 'x') {
            return new Float32Array([
                value, min_bb.y, min_bb.z,
                value, min_bb.y, max_bb.z,
                value, max_bb.y, min_bb.z,

                value, max_bb.y, min_bb.z,
                value, min_bb.y, max_bb.z,
                value, max_bb.y, max_bb.z
            ])
        } else if (props.axis === 'y') {
            return new Float32Array([
                min_bb.x, value, min_bb.z,
                min_bb.x, value, max_bb.z,
                max_bb.x, value, min_bb.z,

                max_bb.x, value, min_bb.z,
                min_bb.x, value, max_bb.z,
                max_bb.x, value, max_bb.z
            ])
        } else {
            return new Float32Array([
                min_bb.x, min_bb.y, value,
                min_bb.x, max_bb.y, value,
                max_bb.x, min_bb.y, value,

                max_bb.x, min_bb.y, value,
                min_bb.x, max_bb.y, value,
                max_bb.x, max_bb.y, value
            ])
        }
    }, [max_bb.x, max_bb.y, max_bb.z, min_bb.x, min_bb.y, min_bb.z, props.axis, props.value])

    useFrame(() => {
        if (ref.current) {
            ref.current.attributes.position.needsUpdate = true;
        }
    })

    return <mesh>
        <bufferGeometry  ref={ref}>
            <bufferAttribute attach={'attributes-position'} count={vertices.length / 3} itemSize={3}
                             array={vertices}/>
        </bufferGeometry>

        <rawShaderMaterial ref={materialRef}
                           attach="material"
                           glslVersion={THREE.GLSL3}
                           uniforms={uniforms}
                           vertexShader={surface_vert_shader}
                           fragmentShader={surface_frag_shader}
                           side={THREE.DoubleSide}
                           transparent={true}
                           depthTest={true}
        />
    </mesh>
}

export default observer(Slice)
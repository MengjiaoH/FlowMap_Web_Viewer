import * as THREE from "three";
import {Vector3} from "three";
import {observer} from "mobx-react";
import React, {useContext, useMemo} from "react";
import {global_data} from "../../../Context/DataContainer";
import {surface_frag_shader, surface_vert_shader} from "../slices/surface_shader";

function ScalarColorLine(props) {

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

    const path = props.path
    const radius = props.radius
    const segments = Math.ceil(path.length * props.segments)
    const radius_segments = 6
    const color = props.color

    const [curve,tex_coords] = useMemo(() => {
        const curve = new THREE.CatmullRomCurve3(path)
        const pos = Array((segments + 1) * radius_segments * 3)
        const coords = curve.getPoints(segments)
        for (let s = 0; s <= segments; ++s) {
            for (let r = 0; r < radius_segments; ++r) {
                const idx = r + s * radius_segments;
                pos[idx * 3] = coords[s].x
                pos[idx * 3 + 1] = coords[s].y
                pos[idx * 3 + 2] = coords[s].z
            }
        }
        return [curve,new Float32Array(pos)]
    }, [path, segments])

    return <mesh>
        <tubeGeometry args={[curve, segments, radius, radius_segments, false]}>
            <bufferAttribute attach={'attributes-tex_coords'} count={tex_coords.length / 3} itemSize={3}
                             array={tex_coords}/>
        </tubeGeometry>
        <rawShaderMaterial attach="material"
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

export default observer(ScalarColorLine)
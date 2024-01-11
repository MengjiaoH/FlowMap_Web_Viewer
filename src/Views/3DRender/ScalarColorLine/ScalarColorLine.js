import * as THREE from "three";
import {observer} from "mobx-react";
import React, {useContext, useMemo} from "react";
import {global_data} from "../../../Context/DataContainer";
import {colorline_frag_shader, colorline_vert_shader} from "./colorline_shader";

function ScalarColorLine(props) {

    const g_data = useContext(global_data)
    const config = g_data.scalars_config
    const uniforms = config.uniforms

    config.setCamera(props.camera_pos)
    config.setLight(props.light_dir)

    const path = props.path
    const radius = props.radius
    const segments = Math.ceil(path.length * props.segments)
    const radius_segments = 12

    const [curve, tex_coords] = useMemo(() => {
        const curve = new THREE.CatmullRomCurve3(path)
        const points = curve.getPoints(segments)
        const tex_arr = new Array((segments + 1) * (radius_segments+1) * 3)

        for (let s = 0; s <= segments; ++s) {
            for (let r = 0; r <= radius_segments; ++r) {
                const idx = r + s * (radius_segments+1);
                tex_arr[3 * idx + 0] = points[s].x
                tex_arr[3 * idx + 1] = points[s].y
                tex_arr[3 * idx + 2] = points[s].z
            }
        }

        const tex_coords = new Float32Array(tex_arr)
        return [curve, tex_coords]
    }, [path, segments])

    return <mesh>
        <tubeGeometry args={[curve, segments, radius, radius_segments, false]}>
            <bufferAttribute attach={'attributes-tex'} count={tex_coords.length / 3} itemSize={3}
                             array={tex_coords}/>
        </tubeGeometry>
        <rawShaderMaterial attach="material"
                           glslVersion={THREE.GLSL3}
                           uniforms={uniforms}
                           vertexShader={colorline_vert_shader}
                           fragmentShader={colorline_frag_shader}
                           side={THREE.DoubleSide}
                           transparent={true}
                           depthTest={true}
                           wireframe={false}
        />
    </mesh>
}

export default observer(ScalarColorLine)
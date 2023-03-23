import * as THREE from "three";
import {Vector3} from "three";
import {observer} from "mobx-react";
import React, {useContext, useMemo} from "react";
import {global_data} from "../../../Context/DataContainer";
import {colorline_frag_shader, colorline_vert_shader} from "./colorline_shader";

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

    const [curve] = useMemo(() => {
        const curve = new THREE.CatmullRomCurve3(path)
        return [curve]
    }, [path])

    return <mesh>
        <tubeGeometry args={[curve, segments, radius, radius_segments, false]}>
        </tubeGeometry>
        <rawShaderMaterial attach="material"
                           glslVersion={THREE.GLSL3}
                           uniforms={uniforms}
                           vertexShader={colorline_vert_shader}
                           fragmentShader={colorline_frag_shader}
                           side={THREE.DoubleSide}
                           transparent={true}
                           depthTest={true}
        />
    </mesh>
}

export default observer(ScalarColorLine)
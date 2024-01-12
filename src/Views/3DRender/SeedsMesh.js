import {Instances, Instance} from "@react-three/drei";
import {observer} from "mobx-react";
import * as THREE from "three";
import {point_frag_shader, point_vert_shader} from "./TimePoints/points_shader";
import React, {useRef} from "react";

function Seeds(props) {
    const config = props.g_data.scalars_config
    const uniforms = config.uniforms
    const materialRef = useRef()

    config.setCamera(props.camera_pos)
    config.setLight(props.light_dir)

    return <Instances limit={100000}>
        <sphereGeometry args={[props.radius, 16, 8]}/>
        <rawShaderMaterial ref={materialRef}
                           attach="material"
                           glslVersion={THREE.GLSL3}
                           uniforms={uniforms}
                           vertexShader={point_vert_shader}
                           fragmentShader={point_frag_shader}
                           side={THREE.DoubleSide}
                           transparent={false}
                           depthTest={true}
        />
        {props.seeds.map((seed, i) => {
            const color = seed.style.color_by_scalar ? props.g_data.scalars_config.getColorFromPos(seed.seed) : seed.style.color
            return <Instance position={seed.seed} color={color} scale={seed.style.scale}
                             key={'seed_instance_' + i}/>
        })}
    </Instances>
}

export default observer(Seeds)
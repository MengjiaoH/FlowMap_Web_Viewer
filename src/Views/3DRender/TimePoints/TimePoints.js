import {Instances, Instance} from "@react-three/drei";
import {observer} from "mobx-react";
import * as THREE from "three";
import React, {useRef} from "react";
import {point_frag_shader, point_vert_shader} from "./points_shader";

function TimePointsMesh(props) {
    const seeds = props.g_data.trajectories.seeds
    const paths = props.g_data.trajectories.paths
    const display_time = props.g_data.trajectories.display_time
    const config = props.g_data.scalars_config
    const uniforms = config.uniforms
    const materialRef = useRef()

    config.setCamera(props.camera_pos)
    config.setLight(props.light_dir)
    const n_tail = props.g_data.trajectories.getMaxTime();

    if (paths.length > 0 && paths[0].path !== null) {
        return <Instances limit={100000}>
            <sphereGeometry args={[props.g_data.modelinfo.shortest_side / 100, 16, 8]}/>
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
            {
                paths.map((path, i) => {
                    const point = path.path[display_time];
                    const seed = seeds[i]
                    const color = seed.style.color_by_scalar ? props.g_data.scalars_config.getColorFromPos(point) : seed.style.color
                    return <Instance position={path.path[display_time]} color={color} scale={seed.style.scale} key={'time_point_i_' + i}/>

                    // const instance = []
                    // for (let t = 0; display_time - t>=0 && t <n_tail; t+= n_tail/10){
                    //     instance.push(
                    //         <Instance position={path.path[display_time-t]} color={color} scale={seed.style.scale * (n_tail - t)/n_tail} key={'time_point_i_' + i + "_t_"+t}/>
                    //     )
                    // }
                    // return instance
                }).flat()
            }
        </Instances>
    } else {
        return null
    }
}

export default observer(TimePointsMesh)
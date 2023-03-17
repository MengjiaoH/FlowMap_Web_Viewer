import {volume_vert_shader, volume_frag_shader} from "./dvr_shaders";

function VolumeMesh(props) {
    const uniforms = {
        projection: null,
        camera_pos: null,
        min_bb: null,
        max_bb: null,
        volume: null,
        normal_map: null,
        tf: null,
        light_dir: null,
        step_size: 0.02,
        min_v: 0,
        max_v: 1
    }

    return <mesh>
        <boxGeometry/>
        <shaderMaterial
            uniforms={uniforms}
            vertexShader={volume_vert_shader}
            fragmentShader={volume_frag_shader}
        />
    </mesh>
}

export default VolumeMesh
import React, {useContext, useMemo, useRef, useState} from 'react'
import {Canvas, useFrame} from '@react-three/fiber'
import {observer} from "mobx-react";
import {PerspectiveCamera, TrackballControls,GizmoHelper, GizmoViewport, Stats} from "@react-three/drei";
import {global_data} from "../../Context/DataContainer";
import CubeOutline from "./CubeOutline";
import Seeds from "./SeedsMesh";
import PathlineMesh from "./PathlineMesh";
import VolumeMesh from "./DVR/VolumeMesh";
import {Vector3} from "three";
import Slice from "./Slices/Slice";

function PrimaryRenderer(props
) {
    const ref = useRef()
    const camera_ref = useRef()
    const control_ref = useRef()
    const light_ref = useRef()
    const g_data = useContext(global_data)

    const [center, diag, near, far] = useMemo(() => {
        const center = g_data.modelinfo.center
        const diag = g_data.modelinfo.diag
        return [center, g_data.modelinfo.diag, 1e-2, 5 * diag]
    }, [g_data.modelinfo.center, g_data.modelinfo.diag])

    const [camera_pos, setCameraPos] = useState(new Vector3(center[0] + 0.5 * diag, center[1] + 0.1 * diag, center[2] + 1 * diag))
    const [light_pos, setLightPos] = useState(new Vector3(camera_pos.x, camera_pos.y, camera_pos.z))


    const x_slice = useMemo(() => {
        if (g_data.scalars_config.show_x_slice) {
            return <Slice axis={'x'} value={g_data.scalars_config.x_value} camera_pos={camera_pos}
                          light_pos={light_pos}/>
        }
    }, [camera_pos, g_data.scalars_config.show_x_slice, g_data.scalars_config.x_value, light_pos
        , g_data.trajectories.paths, g_data.trajectories.seeds
    ])

    const y_slice = useMemo(() => {
        if (g_data.scalars_config.show_y_slice) {
            return <Slice axis={'y'} value={g_data.scalars_config.y_value} camera_pos={camera_pos}
                          light_pos={light_pos}/>
        }
    }, [camera_pos, g_data.scalars_config.show_y_slice, g_data.scalars_config.y_value, light_pos
        , g_data.trajectories.paths, g_data.trajectories.seeds])

    const z_slice = useMemo(() => {
        if (g_data.scalars_config.show_z_slice) {
            return <Slice axis={'z'} value={g_data.scalars_config.z_value} camera_pos={camera_pos}
                          light_pos={light_pos}/>
        }
    }, [camera_pos, g_data.scalars_config.show_z_slice, g_data.scalars_config.z_value, light_pos
        , g_data.trajectories.paths, g_data.trajectories.seeds])

    const volume_rendering = useMemo(() => {
        if (g_data.scalars_config.volume_rendering) {
            return <VolumeMesh camera_pos={camera_pos} light_pos={light_pos}/>
        } else {
            return null
        }
    }, [camera_pos, g_data.scalars_config.volume_rendering])

    const paths = useMemo(() => {
        return <PathlineMesh paths={g_data.trajectories.paths} radius={g_data.modelinfo.shortest_side / 200}
                             camera_pos={camera_pos} light_dir={light_pos}/>
    }, [camera_pos, g_data.modelinfo.shortest_side, g_data.trajectories.paths, light_pos])

    const seeds = useMemo(() => {
        if (g_data.trajectories.seeds.length > 0) {
            return <Seeds seeds={g_data.trajectories.seeds} radius={g_data.modelinfo.shortest_side / 100}
                          g_data={g_data}
            />
        } else {
            return null
        }
    }, [g_data.modelinfo.shortest_side, g_data.trajectories.seeds])

    const seed_box = useMemo(() => {
        if (g_data.seedbox_config.display) {
            const color = g_data.seedbox_config.active ? "rgb(255,0,0)" : "rgb(0,0,0)"
            const bds = g_data.seedbox_config.getBounds()
            return <CubeOutline bounds={bds} color={color}/>
        } else {
            return null
        }
    }, [g_data.seedbox_config.display, g_data.seedbox_config.active, g_data.seedbox_config.size, g_data.seedbox_config.position])

    const outline = useMemo(()=>{
        return <CubeOutline bounds={g_data.modelinfo.bounds} color={"rgb(200,200,200)"}/>
    },[g_data.modelinfo.bounds])


    const updateCamera = () => {
        const pos = control_ref.current.object.position
        setCameraPos(new Vector3(pos.x, pos.y, pos.z))
        const lpos = new Vector3()
        light_ref.current.getWorldPosition(lpos)
        setLightPos(new Vector3(lpos.x, lpos.y, lpos.z))
    }


    return <Canvas ref={ref} onDoubleClick={function () {
        console.log(camera_ref.current.near)
        control_ref.current.reset()
        updateCamera()
    }}>
        < color attach="background" args={['#FFFFFF']}/>
        <group>
            {seed_box}
            {outline}
            {x_slice}
            {y_slice}
            {z_slice}
            {volume_rendering}
            {seeds}
            {paths}

            <GizmoHelper alignment={'bottom-right'} margin={[80, 80]}>
                <GizmoViewport {...{
                    axisColors: ['orange', 'yellow', 'cyan'],
                    hideNegativeAxes: true,
                    labelColor: "black"
                }} />
            </GizmoHelper>
        </group>
        <PerspectiveCamera ref={camera_ref} makeDefault={true}
                           position={[center[0] , center[1] , center[2] + 1 * diag]}
                           near={near}
                           far={2*far}>
            <directionalLight ref={light_ref}
                              intensity={1}
                              position={[1, 1, 1]}

            />
        </PerspectiveCamera>
        <TrackballControls ref={control_ref} target0={center} position0={[center[0] , center[1] , center[2] + 1 * diag]}
                           target={center} maxDistance={far} minDistance={near*10}
                           staticMoving={true}
                           onChange={updateCamera}
        />
        <Stats/>
    </Canvas>
}

export default observer(PrimaryRenderer)
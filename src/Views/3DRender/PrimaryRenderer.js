import React, {useContext, useEffect, useMemo, useRef, useState} from 'react'
import {Canvas} from '@react-three/fiber'
import {observer} from "mobx-react";
import {PerspectiveCamera, TrackballControls, GizmoHelper, GizmoViewport} from "@react-three/drei";
import {global_data} from "../../Context/DataContainer";
import CubeOutline from "./CubeOutline";
import Seeds from "./SeedsMesh";
import PathlineMesh from "./PathlineMesh";
import VolumeMesh from "./dvr/VolumeMesh";
import {Vector3} from "three";

function PrimaryRenderer(props
) {
    const ref = useRef()
    const camera_ref = useRef()
    const control_ref = useRef()
    const g_data = useContext(global_data)

    const [center, diag] = useMemo(() => {
        return [g_data.domain.center, g_data.domain.diag]
    }, [g_data.domain.bounds])

    const [camera_pos, setCameraPos] = useState(new Vector3(center[0] + 0.5 * diag, center[1] + 0.1 * diag, center[2] + 1 * diag))

    useEffect(() => {

    }, [])

    const volume_rendering = useMemo(() => {
        if (g_data.volume_config.volume_rendering) {
            return <VolumeMesh camera_pos={camera_pos}/>
        } else {
            return null
        }
    }, [camera_pos, g_data.volume_config.volume_rendering])


    const seeds = useMemo(() => {
        if (g_data.trajectories.seeds.length > 0) {
            return <Seeds seeds={g_data.trajectories.seeds} radius={g_data.domain.shortest_side / 100}/>
        } else {
            return null
        }
    }, [g_data.domain.shortest_side, g_data.trajectories.seeds])

    const seed_box = useMemo(() => {
        if (g_data.seedbox_config.display) {
            const color = g_data.seedbox_config.active ? "rgb(255,0,0)" : "rgb(0,0,0)"
            const bds = g_data.seedbox_config.getBounds()
            return <CubeOutline bounds={bds} color={color}/>
        } else {
            return null
        }
    }, [g_data.seedbox_config.display, g_data.seedbox_config.active, g_data.seedbox_config.size, g_data.seedbox_config.position])

    const paths = useMemo(() => {
        return <PathlineMesh paths={g_data.trajectories.paths}/>
    }, [g_data.trajectories.paths])


    const updateCamera = () => {
        const pos = control_ref.current.object.position
        setCameraPos(new Vector3(pos.x, pos.y, pos.z))
    }

    return <Canvas ref={ref} onDoubleClick={function () {
        control_ref.current.reset()
        const pos = control_ref.current.object.position
        setCameraPos(new Vector3(pos.x, pos.y, pos.z))
    }}>
        < color attach="background" args={['#FFFFFF']}/>
        <group>
            <CubeOutline bounds={g_data.domain.bounds} color={"rgb(200,200,200)"}/>
            {volume_rendering}
            {seed_box}
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
                           up={[0, 1, 0]} position={[center[0] + 0.5 * diag, center[1] + 0.1 * diag, center[2] + 1 * diag]}>
            <directionalLight intensity={0.7}
                              position={[1, 0, 0]}
            />
        </PerspectiveCamera>
        <TrackballControls ref={control_ref} target0={center}
                           target={center} maxDistance={1000 * diag} minDistance={0.05 * diag}
                           staticMoving={true}
                           onEnd={updateCamera}
        />
    </Canvas>
}

export default observer(PrimaryRenderer)
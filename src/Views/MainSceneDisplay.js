import React, {useContext, useEffect, useMemo, useRef, useState} from 'react'
import {Canvas, useFrame} from '@react-three/fiber'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
import {DoubleSide} from "three";
import * as THREE from "three";
import {observer} from "mobx-react";
import {Instance, PerspectiveCamera, TrackballControls, GizmoHelper, GizmoViewport} from "@react-three/drei";
import {global_data} from "../Context/DataContainer";
import CubeOutline from "./CubeOutline";

function MainSceneDisplay(props
) {
    const ref = useRef()
    const camera_ref = useRef()
    const control_ref = useRef()
    const g_data = useContext(global_data)

    const [center, diag] = useMemo(() => {
        const [x_min, x_max, y_min, y_max, z_min, z_max] = g_data.domain.bounds
        const sx = x_max + x_min
        const sy = y_max + y_min
        const sz = z_max + z_min
        const center = [sx / 2, sy / 2, sz / 2]
        const scene_diag = Math.sqrt((x_max - x_min) ** 2 + (y_max - y_min) ** 2 + (z_max - z_min) ** 2);
        return [center, scene_diag]
    }, [g_data.domain.bounds])

    const seed_box = useMemo(() => {
        if (g_data.seedbox_config.display) {
            const color = g_data.seedbox_config.active ? "rgb(255,0,0)" : "rgb(0,0,0)"
            const [x_size, y_size, z_size] = g_data.seedbox_config.size
            const bds = [g_data.seedbox_config.position[0], x_size + g_data.seedbox_config.position[0],
                g_data.seedbox_config.position[1], y_size + g_data.seedbox_config.position[1],
                g_data.seedbox_config.position[2], z_size + g_data.seedbox_config.position[2]]
            return <CubeOutline bounds={bds} color={color}/>
        } else {
            return null
        }
    }, [g_data.seedbox_config.display, g_data.seedbox_config.active, g_data.seedbox_config.size, g_data.seedbox_config.position])


    return <Canvas ref={ref} onDoubleClick={function () {
        control_ref.current.reset()
    }}>
        < color attach="background" args={['#FFFFFF']}/>
        <group>
            <CubeOutline bounds={g_data.domain.bounds} color={"rgb(200,200,200)"}/>
            {seed_box}
            <GizmoHelper alignment={'bottom-right'} margin={[80, 80]}>
                <GizmoViewport {...{
                    axisColors: ['orange', 'yellow', 'cyan'],
                    hideNegativeAxes: true,
                    labelColor: "black"
                }} />
            </GizmoHelper>
        </group>
        <PerspectiveCamera ref={camera_ref} makeDefault={true}
                           up={[0, 1, 0]}
                           position={[center[0] + 0.5 * diag, center[1] + 0.1 * diag, center[2] + 1 * diag]}>
            <directionalLight intensity={0.7}
                              position={[1, 0, 0]}
            />
        </PerspectiveCamera>
        <TrackballControls ref={control_ref} camera={camera_ref.current} target0={center}
                           target={center} maxDistance={4 * diag} minDistance={0.05 * diag}/>
    </Canvas>
}

export default observer(MainSceneDisplay)
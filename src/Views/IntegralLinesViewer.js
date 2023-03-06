import React, {useMemo, useRef} from 'react'
import {Canvas, useFrame} from '@react-three/fiber'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import {DoubleSide} from "three";
import * as THREE from "three";
import {Instance, PerspectiveCamera, TrackballControls} from "@react-three/drei";

function Renderer(props) {
    const ref = useRef()
    const camera_ref = useRef()
    const control_ref = useRef()

    return <Canvas ref={ref}>
            <color attach="background" args={['#FFFFFF']}/>
            <mesh>
                <sphereGeometry args={[1, 16, 16]}/>
                <meshStandardMaterial color={"red"}
                                      flatShading={true}/>
            </mesh>
            <PerspectiveCamera ref={camera_ref} makeDefault={true} position={[1, 1, 2]}>
                <directionalLight intensity={0.7}
                                  position={[1, 0, 0]}
                                  target-position={0,0,0}
                />
            </PerspectiveCamera>
            <TrackballControls ref={control_ref} camera={camera_ref.current}/>
        </Canvas>

}

function IntegralLinesViewer(props) {
    const style = {borderStyle: "solid", borderWidth: 1, width: "100%", height: "100%"}
    return <div style={style}>
                <Renderer style={{borderStyle: "dash", borderWidth: 3}}/>
    </div>
}

export default IntegralLinesViewer
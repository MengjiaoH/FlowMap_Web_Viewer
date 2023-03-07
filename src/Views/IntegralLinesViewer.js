import React, {useEffect, useMemo, useRef, useState} from 'react'
import {Canvas, useFrame} from '@react-three/fiber'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
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


    return <Container className={"h-100"} >
        <Row style={{borderStyle: "solid", borderWidth: 1, height:"100%"}}>
            <Renderer style={{aspectRatio:1}}/>
        </Row>
    </Container>
}

export default IntegralLinesViewer
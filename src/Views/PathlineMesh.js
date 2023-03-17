import * as THREE from "three";
import {DoubleSide} from "three";

function Pathline(props) {
    const path = props.path
    const radius = props.radius
    const segments = props.segments
    const color = props.color

    const curve = new THREE.CatmullRomCurve3(path)

    return <mesh>
        <tubeGeometry args={[curve, Math.ceil(path.length * segments), radius, 6, false]}/>
        <meshLambertMaterial color={color} side={DoubleSide}/>
    </mesh>
}

function PathlineMesh(props) {

    return props.paths.map((path, i) => {
        if (path.path) {
            return <Pathline path={path.path} radius={path.style.radius} color={path.style.color}
                             segments={path.style.segments} key={'pathline_' + i}></Pathline>
        } else {
            return null
        }
    })
}

export default PathlineMesh
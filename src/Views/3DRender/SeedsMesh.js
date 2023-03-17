import {Instances, Instance} from "@react-three/drei";


function Seeds(props) {
    return <Instances limit={100000}>
        <sphereGeometry args={[props.radius, 16, 8]}/>
        <meshLambertMaterial/>
        {props.seeds.map((seed, i) => <Instance position={seed.seed} color={seed.style.color} scale={seed.style.scale} key={'seed_instance_' + i}/>)}
    </Instances>
}

export default Seeds
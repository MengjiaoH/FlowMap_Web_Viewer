import {Instances, Instance} from "@react-three/drei";


function Seeds(props) {

    console.log("meow",props.seeds,props.seeds.length)

    return <Instances >
        <sphereGeometry args={[0.01, 16, 8]}/>
        <meshLambertMaterial />
        {props.seeds.map((seed,i) => <Instance position={seed.seed} color={seed.color} key={'seed_instance_'+i}/>)}
    </Instances>
}

export default Seeds
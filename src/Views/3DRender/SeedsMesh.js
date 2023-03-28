import {Instances, Instance} from "@react-three/drei";
import {observer} from "mobx-react";

function Seeds(props) {

    return <Instances limit={100000}>
        <sphereGeometry args={[props.radius, 16, 8]}/>
        <meshLambertMaterial
            transparent={true}
        />
        {props.seeds.map((seed, i) => {
            const color = seed.style.color_by_scalar ? props.g_data.scalars_config.getColorFromPos(seed.seed) : seed.style.color
            return <Instance position={seed.seed} color={color} scale={seed.style.scale}
                             key={'seed_instance_' + i}/>
        })}
    </Instances>
}

export default observer(Seeds)
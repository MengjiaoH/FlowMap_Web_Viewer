import {Instances, Instance} from "@react-three/drei";
import {observer} from "mobx-react";

function TimePointsMesh(props) {
    const seeds = props.g_data.trajectories.seeds
    const paths = props.g_data.trajectories.paths
    const display_time = props.g_data.trajectories.display_time

    if (paths.length > 0 && paths[0].path !== null) {
        return <Instances limit={100000}>
            <sphereGeometry args={[props.g_data.modelinfo.shortest_side / 100, 16, 8]}/>
            <meshBasicMaterial/>
            {
                paths.map((path, i) => {
                    const point = path.path[display_time];
                    const seed = seeds[i]
                    const color = seed.style.color_by_scalar ? props.g_data.scalars_config.getColorFromPos(point) : seed.style.color
                    return <Instance position={point} color={color} scale={path.style.scale} key={'time_point_i_' + i}/>
                })
            }
        </Instances>
    } else {
        return null
    }
}

export default observer(TimePointsMesh)
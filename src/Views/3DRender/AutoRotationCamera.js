import {useFrame} from "@react-three/fiber";
import {Vector3} from "three";

function AutoRotationCamera(props){
    const camera_ref = props.camera_ref
    const rotate = props.rotate

    const move_dir = new Vector3(1,0,0)
    useFrame(({clock})=>{
        if (camera_ref.current){
            const camera = camera_ref.current
        }
    })
    return null
}

export default AutoRotationCamera
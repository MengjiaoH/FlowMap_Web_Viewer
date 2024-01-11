import {useFrame} from "@react-three/fiber";
import {Quaternion, Vector3} from "three";
import {global_data} from "../../Context/DataContainer";
import {useContext} from "react";

let time_accum = 0;

function updateRotation(control_ref, rotate, move_dir,delta, rotation_properties){
    const _eye = rotation_properties.eye
    const quaternion = rotation_properties.quaternion
    const eyeDirection = rotation_properties.eyeDirection
    const objectUpDirection = rotation_properties.objectUpDirection
    const objectSidewaysDirection = rotation_properties.objectSidewaysDirection
    const axis = rotation_properties.axis

    if (control_ref.current && rotate) {
        const scope = control_ref.current
        let angle = move_dir.length()
        _eye.copy(scope.object.position).sub(scope.target)
        eyeDirection.copy(_eye).normalize()
        objectUpDirection.copy(scope.object.up).normalize()
        objectSidewaysDirection.crossVectors(objectUpDirection, eyeDirection).normalize()
        objectUpDirection.setLength(move_dir.y)
        objectSidewaysDirection.setLength(move_dir.x)
        move_dir.copy(objectUpDirection.add(objectSidewaysDirection))
        axis.crossVectors(move_dir, _eye).normalize()
        angle *= scope.rotateSpeed * delta * 1
        quaternion.setFromAxisAngle(axis, angle)
        _eye.applyQuaternion(quaternion)
        scope.object.up.applyQuaternion(quaternion)
        scope.object.position.addVectors(scope.target, _eye)
        scope.object.lookAt(scope.target)
        scope.dispatchEvent({type: 'change'})
    }
}
function AutoRotationCamera(props) {
    const g_data = useContext(global_data)
    const trajectories = g_data.trajectories
    const control_ref = props.control_ref
    const rotate = props.rotate
    const move_dir = new Vector3(1, 0, 0)
    const rotation_properties = {
        axis : new Vector3(),
        quaternion : new Quaternion(),
        eyeDirection : new Vector3(),
        objectUpDirection : new Vector3(),
        objectSidewaysDirection : new Vector3(),
        eye : new Vector3()
    }



    useFrame(({clock}) => {
        const elapsedTime = clock.getElapsedTime()
        time_accum += elapsedTime
        if (time_accum > 1) {
            clock.stop()
            time_accum = 0
            // update animation
            const display_time = trajectories.display_time
            const time_max = trajectories.getMaxTime()
            if (display_time < time_max-1){
                trajectories.updateDisplayTime(display_time +1)
            }else{
                trajectories.updateDisplayTime(0)
            }

        }

        updateRotation(control_ref, rotate, move_dir, elapsedTime/500, rotation_properties)

    })
    return null
}

export default AutoRotationCamera
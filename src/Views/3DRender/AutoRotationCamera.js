import {useFrame} from "@react-three/fiber";
import {Quaternion, Vector3} from "three";

function AutoRotationCamera(props) {
    const control_ref = props.control_ref
    const rotate = props.rotate
    const move_dir = new Vector3(1,0,0)
    const axis = new Vector3(),
        quaternion = new Quaternion(),
        eyeDirection = new Vector3(),
        objectUpDirection = new Vector3(),
        objectSidewaysDirection = new Vector3(),
        _eye = new Vector3()


    useFrame(({clock}) => {
        if (control_ref.current && rotate) {
            const scope = control_ref.current
            let angle = move_dir.length()
            _eye.copy(scope.object.position).sub(scope.target)
            eyeDirection.copy(_eye).normalize()
            objectUpDirection.copy(scope.object.up).normalize()
            objectSidewaysDirection.crossVectors(objectUpDirection, eyeDirection).normalize()
            objectUpDirection.setLength(move_dir.y)
            objectSidewaysDirection.setLength(move_dir.x)
            move_dir.copy(objectUpDirection.add( objectSidewaysDirection ))
            axis.crossVectors(move_dir,_eye).normalize()
            angle *= scope.rotateSpeed*clock.getDelta() * 1
            quaternion.setFromAxisAngle(axis,angle)
            _eye.applyQuaternion(quaternion)
            scope.object.up.applyQuaternion(quaternion)
            scope.object.position.addVectors(scope.target, _eye)
            scope.object.lookAt(scope.target)
            scope.dispatchEvent({ type: 'change' })
        }
    })
    return null
}

export default AutoRotationCamera
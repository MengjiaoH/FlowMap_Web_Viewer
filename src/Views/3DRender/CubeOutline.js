import React, {useMemo, useRef} from "react";
import {useFrame} from "@react-three/fiber";

/* render this

          6---7
         /|  /|
        2---3 |
        | | | |
        | 4-|-5
        |/  |/
        0---1

 */
function CubeOutline(props) {

    const geom_ref = useRef()
    const vertices = useMemo(() => {
        const [x_min, x_max, y_min, y_max, z_min, z_max] = props.bounds


        return new Float32Array([
                x_min, y_min, z_min, // 0
                x_max, y_min, z_min, // 1
                x_min, y_max, z_min, // 2
                x_max, y_max, z_min, // 3
                x_min, y_min, z_max, // 4
                x_max, y_min, z_max, // 5
                x_min, y_max, z_max, // 6
                x_max, y_max, z_max  // 7
            ]
        )
    }, [props.bounds])

    const indices = useMemo(() => {
        return new Uint32Array([
            0, 1,
            0, 2,
            0, 4,
            1, 3,
            1, 5,
            2, 3,
            2, 6,
            4, 5,
            4, 6,
            3, 7,
            5, 7,
            6, 7
        ])
    }, [])

    const linewidth = useMemo(() => {
        return props.linewidth ? props.linewidth : 3
    }, [props.linewidth])

    useFrame(() => {
        if (geom_ref.current) {
            geom_ref.current.attributes.position.needsUpdate = true;
            geom_ref.current.computeBoundingBox()
        }
    })

    return <mesh >
        <lineSegments frustumCulled={false}>
            <bufferGeometry ref={geom_ref}>
                <bufferAttribute attach={'attributes-position'} count={vertices.length / 3} itemSize={3}
                                 array={vertices}/>
                <bufferAttribute attach={'index'} count={indices.length} itemSize={1} array={indices}/>
            </bufferGeometry>
            <lineBasicMaterial
                linewidth={linewidth}
                color={props.color}
                transparent={false}
            />
        </lineSegments>
    </mesh>
}

export default CubeOutline;
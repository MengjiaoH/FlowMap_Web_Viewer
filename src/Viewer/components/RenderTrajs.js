import React, {useEffect, useMemo, useState, useContext, useRef } from 'react' //useLayoutEffect
import * as THREE from 'three'
import {extend, useFrame} from "@react-three/fiber"
import Store from '../../Context/RootStore'
import { observer } from "mobx-react";
// import { LineMaterial } from "three/examples/jsm/lines/LineMaterial"
// import { LineGeometry } from "three/examples/jsm/lines/LineGeometry"
// import { Line2 } from "three/examples/jsm/lines/Line2"
// extend({ LineMaterial, LineGeometry, Line2 })
import {Line} from '@react-three/drei'

const SingleLine = (props) =>{
    const store = useContext(Store);
    const line_ref = useRef();
    // const update_temp = true;

    // console.time("construct data")
    const [points, colors] = useMemo(() =>{
        // console.log("update position color")

        const color = new THREE.Color(props.color);
        // console.log("data in props", props.data)
        // console.log("data color", props.color)
        
        const particles = new Array(props.data.length).fill().map((_, i) => {
                return [props.data[i][0] - store.modelStore.global_domain[0], props.data[i][1] - store.modelStore.global_domain[1], props.data[i][2] - store.modelStore.global_domain[2]];
        });
        const color_array = new Array(props.data.length).fill().map((_, i) =>{
            return [color.r, color.g, color.b];
        });
        // console.log("particles", particles.slice(0, 30))
        // console.log("color array", color_array.slice(0,30))
        return [particles, color_array];

    }, [props.data, props.color, store.renderStore.trajs_update])
    // console.timeEnd("construct data");
    // useFrame(()=>{
    //     if (line_ref.current){
    //         // console.log(line_ref.current)
    //         line_ref.current.geometry.attributes.instanceStart.needsUpdate = true;
    //         line_ref.current.geometry.attributes.instanceEnd.needsUpdate = true;
    //         // point_ref.current.attributes.color.needsUpdate = true;
    //         // point_ref.current.attributes.size.needsUpdate = true;
    //         // point_ref.current.computeBoundingBox();
    //         // point_ref.current.computeBoundingSphere();
    //     }

    // })

    return(
            <Line   ref={line_ref}
                    points={points}
                    color='white'
                    vertexColors={colors}
                    lineWidth={2}

            />
    )
}

function SetLines(trajs, color){
    if (trajs.length > 0){
        const lines = trajs.map((traj, j) =>
        <SingleLine key ={j} id ={j} data={traj} total={trajs.length} color={color[j]}/>
        )
        return lines;
    }
    
}

function RenderLines(){
    const store = useContext(Store);
    const [data, setData] = useState([]);
    const [color_data, setColorData] = useState([]);
    

    useEffect(() => {
        // console.log("data changed!!!")
        setData(store.renderStore.render_trajs);
        setColorData(store.renderStore.colors);
      
    }, [store.renderStore.render_trajs, store.renderStore.colors, store.renderStore.trajs_update])
    
    console.time("renderlines")
    const lines = data.map((trajs, i) => 
        // console.log("trajs in render lines", trajs, color_data[i])
        {
            console.log("lenght", i, trajs.length)
            return SetLines(trajs, color_data[i])
        }
        
    )
    console.timeEnd("renderlines")
    return lines;
}

export default observer(RenderLines)
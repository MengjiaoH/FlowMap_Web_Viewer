import React, {useState, useEffect, useContext} from 'react'
import { Canvas} from '@react-three/fiber'
import { OrbitControls, Box, PerspectiveCamera, GizmoHelper, GizmoViewport } from '@react-three/drei'
import { observer } from "mobx-react";

import Store from '../Context/RootStore'
import RenderSeedBox from './components/RenderSeedBox'
import RenderSeeds from './components/RenderSeeds'
import RenderTrajs from './components/RenderTrajs';

const Render = ({dims, pos, bbox_color, bbox_visibiliity}) =>{
  // const store = useContext(Store);
  

  return (
    <div style={{ width:'100%', height:1100}}> 
        <Canvas shadows >
        <PerspectiveCamera makeDefault position={[10, 10, 20]} />
        <group position={[0, 0, 0]}>
          {bbox_visibiliity && (<Box args={dims} position={pos} >
            <meshPhongMaterial color= {bbox_color} wireframe />
          </Box>)}
          <RenderSeedBox/>
          
          <GizmoHelper alignment={'bottom-right'} margin={[80, 80]}>
            <GizmoViewport {...{ axisColors: ['red', 'green', 'blue'], hideNegativeAxes: true, labelColor:"black" }} />
          </GizmoHelper>
        </group>
        <RenderSeeds/>
        <RenderTrajs/>
        
          <color attach="background" args={['#f0f0f0']} />
            <>
              <ambientLight intensity={0.8} />
              <pointLight intensity={1} position={[0, 6, 0]} />
            </>
          <OrbitControls makeDefault />
        </Canvas>
    </div>
  )
}

const Default = () => {
  return (
    <div style={{ width:'100%', height:1100}}> 
        <Canvas shadows >
        <PerspectiveCamera makeDefault position={[5, 5, 30]} />
          <color attach="background" args={['#f0f0f0']} />
            <>
              <ambientLight intensity={0.8} />
              <pointLight intensity={1} position={[0, 6, 0]} />
            </>
          <OrbitControls makeDefault />
        </Canvas>
    </div>
  )
}

const Viewer = () => {
  const store = useContext(Store);
  const [start_viewer, setViewerStart] = useState(false);
  const [pos, setPos] = useState([0, 0, 0]);
  const [dims, setDims] = useState([0, 0, 0]);
  const [bbox_color, setBboxColor] = useState('black');
  const [bbox_visibiliity, setBboxVisibility] = useState(true);

  useEffect(() =>{
    setBboxColor(store.bboxStore.color);
  }, [store.bboxStore.color])

  useEffect(() =>{
    if (store.modelStore.model_load){
      setViewerStart(true);
    }
  }, [store.modelStore.model_load])

  useEffect(() => {
    
    setPos(store.modelStore.global_center);
    setDims(store.modelStore.global_dimensions);
  }, [store.modelStore.global_dimensions, store.modelStore.global_center])

  useEffect(() => {
    setBboxVisibility(store.bboxStore.is_visible);
  }, [store.bboxStore.is_visible])

  return (
    <div>
      {start_viewer ? <Render dims={dims} pos={pos} bbox_color={bbox_color} bbox_visibiliity={bbox_visibiliity}/> : <Default/>}
    </div>
    
  )
}

export default observer(Viewer)
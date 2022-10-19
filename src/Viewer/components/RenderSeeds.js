import * as THREE from 'three'
import React, { useRef, useMemo, useContext, useLayoutEffect, useEffect, useState} from 'react' //useEffect, useState, 
import { useFrame, extend } from '@react-three/fiber'
import Store from '../../Context/RootStore'
import { observer } from "mobx-react";
import { BufferAttribute } from "three";
// import niceColors from 'nice-color-palettes'
// import {Select} from '@react-three/drei'

const MAX_POINTS = 100000;

const particles = Array.from({ length: MAX_POINTS * 3 }, () => (1))

const color_array = Array.from({ length: MAX_POINTS * 3 }, () => (1))

const size_array = Array.from({ length: MAX_POINTS}, () => (20))

class DotMaterial extends THREE.ShaderMaterial {
    constructor() {
      super({
        transparent: true,
        uniforms: {
            pointTexture: { value: new THREE.TextureLoader().load( './textures/disc.png' ) },
            scale: { value: 1 } 
        },
        vertexShader: `
            attribute float size;
            varying vec3 vColor;
            void main() {

            vColor = color;

            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

            gl_PointSize = size;

            gl_Position = projectionMatrix * mvPosition;

        }
        `,
        fragmentShader: `
            uniform sampler2D pointTexture;

			varying vec3 vColor;

			void main() {

				gl_FragColor = vec4( vColor, 1.0 );

				gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );

			}
            `,
      })
    }
}
extend({DotMaterial})


function RenderSeeds() {
    const store = useContext(Store);
    const point_ref = useRef();
    // const [color, setColor] = useState(new THREE.Color("rgb(39, 123, 192)"))
    // const [selected, setSelected] = useState([])


    const setSelected = (event) =>{
    //   store.renderStore.AddSelectedSeeds(event.intersections[0].index);
    }
    
    const drawCountTemp = useMemo(() =>{
          return store.renderStore.render_num_seeds;
    }, [store.renderStore.render_num_seeds]) //, store.controlStore.render_internal_seeds
    
    useLayoutEffect(() =>{
        console.log("draw count", drawCountTemp)
      point_ref.current.setDrawRange(0, drawCountTemp);
    }, [point_ref, drawCountTemp])

    const [points, colors, sizes] = useMemo(() => {
        let num_seeds = store.renderStore.render_num_seeds;
        if (num_seeds > 0){
            let current = 0;
            // console.log("colorchanged")
            store.renderStore.render_seeds.forEach((seeds, j) =>{
                // console.log("debug seeds", seeds)
                const color_array_temp = store.renderStore.colors[j];
                // console.log("color array in render seeds", color_array_temp)
                seeds.forEach((seed, i) =>{
                    const color = new THREE.Color(color_array_temp[i]);
                    console.log("color array in render seeds", color_array_temp[i])
                    // console.log(color.r, color.g, color.b)
                    particles[(i + current) * 3] = seed[0];
                    particles[(i + current) * 3 + 1] = seed[1];
                    particles[(i + current) * 3 + 2] = seed[2];
                    color_array[(i + current) * 3] = color.r;
                    color_array[(i + current) * 3 + 1] = color.g;
                    color_array[(i + current) * 3 + 2] = color.b;
                })
                current = current + seeds.length;
            })
        }
        // console.log("particles", particles.slice(0, 15))

      return [new BufferAttribute(new Float32Array(particles), 3), new BufferAttribute(new Float32Array(color_array), 3), new BufferAttribute(new Float32Array(size_array), 1)];
      }, [store.renderStore.render_seeds, store.renderStore.render_num_seeds, store.renderStore.colors, store.renderStore.seeds_update]); //, store.controlStore.render_start_seeds, store.controlStore.render_internal_seeds

    useFrame(()=>{
        if (point_ref.current){
            point_ref.current.attributes.position.needsUpdate = true;
            point_ref.current.attributes.color.needsUpdate = true;
            point_ref.current.attributes.size.needsUpdate = true;
            point_ref.current.computeBoundingBox();
            point_ref.current.computeBoundingSphere();
        }

    })

      return ( 
          <points onClick={setSelected}>
            <bufferGeometry ref={point_ref}>
              <bufferAttribute attach={"attributes-position"} {...points} />
              <bufferAttribute attach={"attributes-color"} {...colors} />
              <bufferAttribute attach={"attributes-size"} {...sizes} />
            </bufferGeometry>
            <dotMaterial
                vertexColors
                depthWrite={false}
                sizeAttenuation={true}
            />
          </points>
      );
}

export default observer(RenderSeeds)
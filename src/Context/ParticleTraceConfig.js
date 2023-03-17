import {makeAutoObservable} from "mobx";
import {Vector3} from "three";

export default class ParticleTraceConfig {
    constructor(root) {
        this.root = root
        this.n_flow_map = 100
        makeAutoObservable(this)
        this.fakeTrace = this.fakeTrace.bind(this)
    }

    setNFlowMap(v) {
        this.n_flow_map = v
    }

    fakeTrace(seedpos) {
        const center = [0.5,0.5,0.5]
        const n_steps = this.n_flow_map

        const step = Math.PI * 2 / 36

        const dx = seedpos[0] - center[0]
        const dy = seedpos[1] - center[1]
        const radius = Math.sqrt(dx * dx + dy * dy)

        const path = []
        let starting_theta
        if (radius !== 0){
            starting_theta = Math.asin(dy / radius)
            const x0 = radius * Math.cos(starting_theta ) + center[0]
            if (Math.abs(x0 - seedpos[0])>1e-4){
                starting_theta = Math.PI - starting_theta
            }

        }


        const z_factor = (Math.random() * 1000 -500)

        for (let i = 0; i < n_steps; ++i) {
            let x, y, z
            if (radius !== 0) {
                x = radius * Math.cos(starting_theta + step * i) + center[0]
                y = radius * Math.sin(starting_theta + step * i) + center[1]
            } else {
                x = seedpos[0]
                y = seedpos[1]
            }
            z = i / z_factor + seedpos[2]
            path.push(new Vector3(x, y, z))
        }

        return path
    }
}
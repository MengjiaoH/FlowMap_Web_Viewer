import {Tensor} from 'onnxruntime-web';
import {rescale} from "../Utils/utils";
import {Vector3} from "three";

async function Trace(model, cur_fm, times, num_seeds) {
    const data_1 = Float32Array.from(cur_fm);
    const input_1 = new Tensor("float32", data_1, [parseInt(num_seeds), 3]);
    const data_2 = Float32Array.from(times)
    const input_2 = new Tensor("float32", data_2, [parseInt(num_seeds), 1]);
    // // console.log(input_1)
    const feeds = {input_1: input_1, input_2: input_2};
    const outputMap = await model.run(feeds);

    const predictions = outputMap.output1.data
    // console.log("prediction", index, predictions.length);

    const positions = new Array(num_seeds)

    for (let f = 0; f < predictions.length / 3; f++) { // go over each seed
        positions[f] = [predictions[3 * f + 0], predictions[3 * f + 1], predictions[3 * f + 2]]
    }

    return positions
}

async function TraceModel(g_data) {
    const min_val = -1
    const max_val = 1

    const [x_min, x_max, y_min, y_max, z_min, z_max] = g_data.modelinfo.bounds


    const indices = []
    const seeds = []

    for (let i = 0; i < g_data.trajectories.seeds.length; ++i) {
        if (g_data.trajectories.paths[i].path === null) {
            const s = g_data.trajectories.seeds[i]
            seeds.push(rescale(s.seed[0], min_val, max_val, x_min, x_max),
                rescale(s.seed[1], min_val, max_val, y_min, y_max),
                rescale(s.seed[2], min_val, max_val, z_min, z_max))
            indices.push(i)
            g_data.trajectories.initPath(i, g_data.modelinfo.times.length)
        }
    }

    const n_seeds = indices.length
    const model = g_data.modelinfo.model

    for (let t = 0; t < g_data.modelinfo.times.length; ++t) {
        const times = new Array(n_seeds).fill(g_data.modelinfo.times[t])
        const positions = await Trace(model, seeds, times, n_seeds)

        for (let i = 0; i < n_seeds; ++i) {
            const [x, y, z] = positions[i]
            g_data.trajectories.setPathPos(indices[i], t,
                new Vector3(rescale(x, x_min, x_max, min_val, max_val),
                    rescale(y, y_min, y_max, min_val, max_val),
                    rescale(z, z_min, z_max, min_val, max_val)))
        }
    }

    g_data.trajectories.updatePath()
}

export default TraceModel
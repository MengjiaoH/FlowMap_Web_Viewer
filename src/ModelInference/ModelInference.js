import {Tensor} from 'onnxruntime-web';
import {rescale} from "../Utils/utils";
import {Vector3} from "three";

async function Trace(model, cur_fm, times, num_seeds) {
    const data_1 = Float32Array.from(cur_fm);
    const input_1 = new Tensor("float32", data_1, [parseInt(num_seeds), 3]);
    const data_2 = Float32Array.from(times)
    const input_2 = new Tensor("float32", data_2, [parseInt(num_seeds), 1]);
    const feeds = {input_1: input_1, input_2: input_2};
    const outputMap = await model.run(feeds);
    const predictions = outputMap.output1.data
    const positions = new Array(num_seeds)
    for (let f = 0; f < predictions.length / 3; f++) { // go over each seed
        positions[f] = [predictions[3 * f + 0], predictions[3 * f + 1], predictions[3 * f + 2]]
    }
    return positions
}

async function TraceModel(g_data) {
    const t_processing_start = performance.now()
    const min_val = -1
    const max_val = 1
    const modelinfo = g_data.modelinfo;
    const trajectories = g_data.trajectories;

    const indices = []
    const seeds = []

    const t_length = modelinfo.models.reduce((acc, cur) => {
        return acc + cur.times.length
    }, 0)
    console.log('time length',t_length)

    for (let i = 0; i < trajectories.seeds.length; ++i) {
        if (trajectories.paths[i].path === null) {
            const s = trajectories.seeds[i]
            seeds.push(s.seed[0], s.seed[1], s.seed[2])
            indices.push(i)
            trajectories.initPath(i, t_length + 1)
        }
    }

    let count = 1;
    for (let mdx = 0; mdx < modelinfo.num_models; ++mdx) {
        const [x_min, x_max, y_min, y_max, z_min, z_max] = modelinfo.models[mdx].model_bbox
        const rescaled_seeds = new Array(seeds.length)
        for (let i = 0; i < seeds.length; i += 3) {
            rescaled_seeds[i] = rescale(seeds[i], min_val, max_val, x_min, x_max)
            rescaled_seeds[i + 1] = rescale(seeds[i + 1], min_val, max_val, y_min, y_max)
            rescaled_seeds[i + 2] = rescale(seeds[i + 2], min_val, max_val, z_min, z_max)
        }

        const n_seeds = indices.length
        const model = modelinfo.models[mdx].model
        const model_times = modelinfo.models[mdx].times

        for (let t = 0; t < model_times.length; ++t) {
            const times = new Array(n_seeds).fill(model_times[t])
            const positions = await Trace(model, rescaled_seeds, times, n_seeds)

            for (let i = 0; i < n_seeds; ++i) {
                const [x, y, z] = positions[i]
                trajectories.setPathPos(indices[i], count,
                    new Vector3(rescale(x, x_min, x_max, min_val, max_val),
                        rescale(y, y_min, y_max, min_val, max_val),
                        rescale(z, z_min, z_max, min_val, max_val)))
            }
            count += 1
        }
    }

    trajectories.updatePath()

    const t_processing_end = performance.now()
    console.log("processing time: ", t_processing_end - t_processing_start)
}

export default TraceModel
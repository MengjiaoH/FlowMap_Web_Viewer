import {Tensor} from 'onnxruntime-web';


async function Trace(cur_fm, times, num_seeds, minval, maxval, lower, upper, store){
    const data_1 = Float32Array.from(cur_fm);
    const input_1 = new Tensor( "float32", data_1, [parseInt(num_seeds), 3]);
    const data_2 = Float32Array.from(times)
    const input_2 = new Tensor( "float32", data_2, [parseInt(num_seeds), 1]);
    // console.log(input_1)
    const feeds = { input_1: input_1, input_2: input_2};
    const outputMap = await store.modelStore.model.run(feeds);
    
    const predictions = outputMap.output1.data
    // console.log("prediction", predictions);
    
    for(let f = 0; f < predictions.length / 3; f++){ // go over each seed
        // const pos = [predictions[3 * f + 0], predictions[3 * f + 1], predictions[3 * f + 2]];
        const x = (predictions[3 * f + 0] - minval) / (maxval - minval) * (upper[0] -lower[0]) + lower[0]
        const y = (predictions[3 * f + 1] - minval) / (maxval - minval) * (upper[1] -lower[1]) + lower[1]
        const z = (predictions[3 * f + 2] - minval) / (maxval - minval) * (upper[2] -lower[2]) + lower[2]
        // store.renderStore.add_trajs([x, y, z], f + f_start);
        store.renderStore.add_trajs([x, y, z], f, store.pipeline_selected);
    }
}

async function InferFromModel(store){

    const minval = -1
    const maxval = 1
    const t_start = 0
    const t_end = (store.modelStore.stop_cycle - store.modelStore.start_cycle) * store.modelStore.step_size
    // console.log("trace", store._num_fm);
    // calculate trajectories
    var startTime = performance.now()

    // let num_seeds = store.renderStore.seeds.length;
    // let f_start = 0;
    // if (store.renderStore.trajs.length !== 0){
    //     f_start = store.renderStore.trajs.length;
    // }
    // console.log("trace # seeds:", num_seeds)
    const upper = [store.modelStore.trainingBbox[3], store.modelStore.trainingBbox[4], store.modelStore.trainingBbox[5]]
    const lower = [store.modelStore.trainingBbox[0], store.modelStore.trainingBbox[1], store.modelStore.trainingBbox[2]]
    // console.log("upper", upper)
    // console.log("lower", lower)


    // let seeds = [];
    // store.renderStore.seeds.slice(f_start, num_seeds);
    // console.log("new seeds", seeds, num_seeds)

    if(store.pipeline_selected === -1 || store.pipeline_selected === 0){
        // predict trajs for all seeds 
        for(let i = 1; i < store.modelStore.num_fm+1; ++i){
            let time = ((i-1) * store.modelStore.interval * store.modelStore.step_size - t_start) / (t_end - t_start) * (maxval - minval) +  minval
            let cur_fm = []
            let times = []
            store.renderStore.render_seeds[0].forEach((seed, i) =>{
                    const x = (seed[0] - lower[0]) / (upper[0] - lower[0]) * (maxval - minval) + minval
                    const y = (seed[1] - lower[1]) / (upper[1] - lower[1]) * (maxval - minval) + minval
                    const z = (seed[2] - lower[2]) / (upper[2] - lower[2]) * (maxval - minval) + minval
                    cur_fm.push(x, y, z);
                    times.push(time);
            })  
            Trace(cur_fm, times, store.renderStore.render_seeds[0].length, minval, maxval, lower, upper, store);
 
        }
    }else{
        // only predict trajs for seeds in a seed box 
        for(let i = 1; i < store.modelStore.num_fm+1; ++i){
            let time = ((i-1) * store.modelStore.interval * store.modelStore.step_size - t_start) / (t_end - t_start) * (maxval - minval) +  minval
            let cur_fm = []
            let times = []
            store.renderStore.render_seeds[store.pipeline_selected].forEach((seed, j) =>{
                const x = (seed[0] - lower[0]) / (upper[0] - lower[0]) * (maxval - minval) + minval
                const y = (seed[1] - lower[1]) / (upper[1] - lower[1]) * (maxval - minval) + minval
                const z = (seed[2] - lower[2]) / (upper[2] - lower[2]) * (maxval - minval) + minval
                cur_fm.push(x, y, z);
                times.push(time);
            })  
            Trace(cur_fm, times, store.renderStore.render_seeds[store.pipeline_selected].length, minval, maxval, lower, upper, store);
 
        }
    }

    // store.renderStore.set_cur_index();
    console.log("trajs: ", store.renderStore.trajs)
    // console.log("traj leghth:", store.renderStore.trajs.length)
    var endTime = performance.now() 
    console.log(`Call to inference took ${endTime - startTime} milliseconds`)
    // store.renderStore.CopyToRenderTrajs();
}

export default InferFromModel
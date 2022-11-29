import {Tensor} from 'onnxruntime-web';


async function Trace(cur_fm, times, num_seeds, num_fm, minval, maxval, lower, upper, store, model){
    const data_1 = Float32Array.from(cur_fm);
    const input_1 = new Tensor( "float32", data_1, [parseInt(num_seeds * num_fm), 3]);
    const data_2 = Float32Array.from(times)
    const input_2 = new Tensor( "float32", data_2, [parseInt(num_seeds * num_fm), 1]);
    // console.log(input_1)
    const feeds = { input_1: input_1, input_2: input_2};
    const outputMap = await model.run(feeds);
    
    const predictions = outputMap.output1.data
    // console.log("prediction", predictions.length);
    
    for(let f = 0; f < predictions.length / 3; f++){ // go over each seed
        // const pos = [predictions[3 * f + 0], predictions[3 * f + 1], predictions[3 * f + 2]];
        const x = (predictions[3 * f + 0] - minval) / (maxval - minval) * (upper[0] -lower[0]) + lower[0]
        const y = (predictions[3 * f + 1] - minval) / (maxval - minval) * (upper[1] -lower[1]) + lower[1]
        const z = (predictions[3 * f + 2] - minval) / (maxval - minval) * (upper[2] -lower[2]) + lower[2]
        // store.renderStore.add_trajs([x, y, z], f + f_start);
        store.renderStore.add_trajs([x, y, z], f / num_fm, store.pipeline_selected);
    }
}

async function InferFromModel(store){

    const minval = -1
    const maxval = 1
    // console.log("trace", store._num_fm);
    // calculate trajectories
    // console.log("start tracing")
    // var startTime = performance.now()

    // let num_seeds = store.renderStore.seeds.length;
    // let f_start = 0;
    // if (store.renderStore.trajs.length !== 0){
    //     f_start = store.renderStore.trajs.length;
    // }
    // console.log("trace # seeds:", num_seeds)



    // let seeds = [];
    // store.renderStore.seeds.slice(f_start, num_seeds);
    // console.log("new seeds", seeds, num_seeds)

    
    // predict trajs for all seeds 
    
    if (store.modelStore.mode === "long"){
        console.log("Long")
        if(store.pipeline_selected === -1 || store.pipeline_selected === 0){
            console.time("predict")
            for(let m = 0; m < store.modelStore.num_models; m++){
                const upper = [store.modelStore.trainingBbox[m][3], store.modelStore.trainingBbox[m][4], store.modelStore.trainingBbox[m][5]]
                const lower = [store.modelStore.trainingBbox[m][0], store.modelStore.trainingBbox[m][1], store.modelStore.trainingBbox[m][2]]
                // console.log("upper", upper)
                // console.log("lower", lower)
                const start_fm = store.modelStore.start_cycles[m];
                const stop_fm = store.modelStore.stop_cycles[m];
                const num_fm = stop_fm - start_fm;
                console.log("here", num_fm)
                const t_start = 1 * store.modelStore.interval * store.modelStore.step_size;
                const t_end = num_fm * store.modelStore.step_size * store.modelStore.interval;
                let cur_fm = []
                let times = []
                store.renderStore.render_seeds[0].forEach((seed) =>{
                    const x = (seed[0] - lower[0]) / (upper[0] - lower[0]) * (maxval - minval) + minval
                    const y = (seed[1] - lower[1]) / (upper[1] - lower[1]) * (maxval - minval) + minval
                    const z = (seed[2] - lower[2]) / (upper[2] - lower[2]) * (maxval - minval) + minval
                        for(let i = 1; i < num_fm+1; ++i){
                            let time = (i * store.modelStore.interval * store.modelStore.step_size - t_start) / (t_end - t_start) * (maxval - minval) +  minval
                    
                                cur_fm.push(x, y, z);
                                times.push(time);
                        } 
                }) 
                Trace(cur_fm, times, store.renderStore.render_seeds[0].length,num_fm, minval, maxval, lower, upper, store, store.modelStore.models[m]);
            }
            console.timeEnd("predict")
            
        }else{
            // only predict trajs for seeds in a seed box 
            for(let m = 0; m < store.modelStore.num_models; m++){
                const upper = [store.modelStore.trainingBbox[m][3], store.modelStore.trainingBbox[m][4], store.modelStore.trainingBbox[m][5]]
                const lower = [store.modelStore.trainingBbox[m][0], store.modelStore.trainingBbox[m][1], store.modelStore.trainingBbox[m][2]]
                // console.log("upper", upper)
                // console.log("lower", lower)
                const start_fm = store.modelStore.start_cycles[m];
                const stop_fm = store.modelStore.stop_cycles[m];
                const num_fm = stop_fm - start_fm;
                // console.log("here", num_fm)
                const t_start = 1 * store.modelStore.interval * store.modelStore.step_size;
                const t_end = num_fm * store.modelStore.step_size * store.modelStore.interval;
                for(let i = 1; i < num_fm+1; ++i){
                    let time = (i * store.modelStore.interval * store.modelStore.step_size - t_start) / (t_end - t_start) * (maxval - minval) +  minval
                    let cur_fm = []
                    let times = []
                    store.renderStore.render_seeds[store.pipeline_selected].forEach((seed, i) =>{
                        // console.log(seed)
                            const x = (seed[0] - lower[0]) / (upper[0] - lower[0]) * (maxval - minval) + minval
                            const y = (seed[1] - lower[1]) / (upper[1] - lower[1]) * (maxval - minval) + minval
                            const z = (seed[2] - lower[2]) / (upper[2] - lower[2]) * (maxval - minval) + minval
                            cur_fm.push(x, y, z);
                            times.push(time);
                    })  
                    // console.log("debug", store.modelStore.models[m])
                    Trace(cur_fm, times, store.renderStore.render_seeds[store.pipeline_selected].length, minval, maxval, lower, upper, store, store.modelStore.models[m]);
                } 
            }
        }
    }// end of mode long

    if (store.modelStore.mode === "short"){
        console.log("short")
        if(store.pipeline_selected === -1 || store.pipeline_selected === 0){
            for(let m = 0; m < store.modelStore.num_models; m++){
                const upper = [store.modelStore.trainingBbox[m][3], store.modelStore.trainingBbox[m][4], store.modelStore.trainingBbox[m][5]]
                const lower = [store.modelStore.trainingBbox[m][0], store.modelStore.trainingBbox[m][1], store.modelStore.trainingBbox[m][2]]
                // console.log("upper", upper)
                // console.log("lower", lower)
                const start_fm = store.modelStore.start_cycles[m];
                const stop_fm = store.modelStore.stop_cycles[m];
                const num_fm = stop_fm - start_fm;
                // console.log("here", num_fm)
                const t_start = 1 * store.modelStore.interval * store.modelStore.step_size;
                const t_end = num_fm * store.modelStore.step_size * store.modelStore.interval;

                if( m === 0){
                    let cur_fm = []
                    let times = []
                    store.renderStore.render_seeds[0].forEach((seed, i) =>{
                        const x = (seed[0] - lower[0]) / (upper[0] - lower[0]) * (maxval - minval) + minval
                        const y = (seed[1] - lower[1]) / (upper[1] - lower[1]) * (maxval - minval) + minval
                        const z = (seed[2] - lower[2]) / (upper[2] - lower[2]) * (maxval - minval) + minval
                        for(let i = 1; i < num_fm+1; ++i){
                            let time = (i * store.modelStore.interval * store.modelStore.step_size - t_start) / (t_end - t_start) * (maxval - minval) +  minval          
                            cur_fm.push(x, y, z);
                            times.push(time);
                        }
                    }) 
                    await Trace(cur_fm, times, store.renderStore.render_seeds[0].length, num_fm,minval, maxval, lower, upper, store, store.modelStore.models[m]);
                    
                }else{
                    const cur_trajs = store.renderStore.trajs[0];
                    let cur_pos = cur_trajs.map(traj =>{
                        // console.log("cur traj", traj.length)
                        return traj[traj.length - 1];
                    })
                    let cur_fm = []
                    let times = []

                    cur_pos.forEach((pos, ) =>{

                        const x = (pos[0] - lower[0]) / (upper[0] - lower[0]) * (maxval - minval) + minval
                        const y = (pos[1] - lower[1]) / (upper[1] - lower[1]) * (maxval - minval) + minval
                        const z = (pos[2] - lower[2]) / (upper[2] - lower[2]) * (maxval - minval) + minval
                        for(let i = 1; i < num_fm+1; ++i){
                            let time = (i * store.modelStore.interval * store.modelStore.step_size - t_start) / (t_end - t_start) * (maxval - minval) +  minval
                            cur_fm.push(x, y, z);
                            times.push(time);
                        }
                    })  
                    await Trace(cur_fm, times, store.renderStore.render_seeds[0].length, num_fm, minval, maxval, lower, upper, store, store.modelStore.models[m]);
                    
                }
            } // end of for models   
        }else{
        
            for(let m = 0; m < store.modelStore.num_models; m++){
                const upper = [store.modelStore.trainingBbox[m][3], store.modelStore.trainingBbox[m][4], store.modelStore.trainingBbox[m][5]]
                const lower = [store.modelStore.trainingBbox[m][0], store.modelStore.trainingBbox[m][1], store.modelStore.trainingBbox[m][2]]
                // console.log("upper", upper)
                // console.log("lower", lower)
                const start_fm = store.modelStore.start_cycles[m];
                const stop_fm = store.modelStore.stop_cycles[m];
                const num_fm = stop_fm - start_fm;
                // console.log("here", num_fm)
                const t_start = 1 * store.modelStore.interval * store.modelStore.step_size;
                const t_end = num_fm * store.modelStore.step_size * store.modelStore.interval;

                if( m === 0){
                    for(let i = 1; i < num_fm+1; ++i){
                        let time = (i * store.modelStore.interval * store.modelStore.step_size - t_start) / (t_end - t_start) * (maxval - minval) +  minval
                        let cur_fm = []
                        let times = []
                        store.renderStore.render_seeds[store.pipeline_selected].forEach((seed, i) =>{
                            // console.log(seed)
                            const x = (seed[0] - lower[0]) / (upper[0] - lower[0]) * (maxval - minval) + minval
                            const y = (seed[1] - lower[1]) / (upper[1] - lower[1]) * (maxval - minval) + minval
                            const z = (seed[2] - lower[2]) / (upper[2] - lower[2]) * (maxval - minval) + minval
                            cur_fm.push(x, y, z);
                            times.push(time);
                        })      
                        await Trace(cur_fm, times, store.renderStore.render_seeds[store.pipeline_selected].length, minval, maxval, lower, upper, store, store.modelStore.models[m]);
                    }
                    
                }else{
                    const cur_trajs = store.renderStore.trajs[store.pipeline_selected];
                    let cur_pos = cur_trajs.map(traj =>{
                        // console.log("cur traj", traj.length)
                        return traj[traj.length - 1];
                    })
                    console.log(m, cur_trajs.length)
                    for(let i = 1; i < num_fm+1; ++i){
                        let time = (i * store.modelStore.interval * store.modelStore.step_size - t_start) / (t_end - t_start) * (maxval - minval) +  minval
                        let cur_fm = []
                        let times = []
                        cur_pos.forEach((pos, i) =>{
                            // console.log(seed)
                            const x = (pos[0] - lower[0]) / (upper[0] - lower[0]) * (maxval - minval) + minval
                            const y = (pos[1] - lower[1]) / (upper[1] - lower[1]) * (maxval - minval) + minval
                            const z = (pos[2] - lower[2]) / (upper[2] - lower[2]) * (maxval - minval) + minval
                            cur_fm.push(x, y, z);
                            times.push(time);
                                
                        })  
                        await Trace(cur_fm, times, store.renderStore.render_seeds[store.pipeline_selected].length, minval, maxval, lower, upper, store, store.modelStore.models[m]);
                    }
                    
                }
            }// end of for models   
        }
    }
        
   

    // store.renderStore.set_cur_index();
    // console.log("trajs: ", store.renderStore.trajs)
    // const traj = store.renderStore.trajs[0][0];
    // console.log("traj", traj)
    // traj.forEach(pos =>{
    //     console.log(pos)
    // })
    // console.log("traj leghth:", store.renderStore.trajs.length, store.renderStore.trajs[0][0].length)
    // var endTime = performance.now() 
    // console.log(`Call to inference took ${endTime - startTime} milliseconds`)
    // store.renderStore.CopyToRenderTrajs();
}

export default InferFromModel


// for(let i = 1; i < store.modelStore.num_fm+1; ++i){
        //     let time = (i * store.modelStore.interval * store.modelStore.step_size - t_start) / (t_end - t_start) * (maxval - minval) +  minval
        //     let cur_fm = []
        //     let times = []
        //     store.renderStore.render_seeds[store.pipeline_selected].forEach((seed, j) =>{
        //         const x = (seed[0] - lower[0]) / (upper[0] - lower[0]) * (maxval - minval) + minval
        //         const y = (seed[1] - lower[1]) / (upper[1] - lower[1]) * (maxval - minval) + minval
        //         const z = (seed[2] - lower[2]) / (upper[2] - lower[2]) * (maxval - minval) + minval
        //         cur_fm.push(x, y, z);
        //         times.push(time);
        //     })  
        //     Trace(cur_fm, times, store.renderStore.render_seeds[store.pipeline_selected].length, minval, maxval, lower, upper, store);
    
        // }
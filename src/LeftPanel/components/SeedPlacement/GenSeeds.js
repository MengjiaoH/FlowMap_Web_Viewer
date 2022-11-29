function GenSeeds(store)
{
    // store.renderStore.reset_trajs();
    let upper = [];
    let lower = [];
    let start = store.renderStore.seeds.length;
    let add_new_seeds = 0;
    let offset = 0;

    if(store.pipeline_selected === -1 || store.pipeline_selected === 0){
        // there is not a selected pipeline or select the global domain === place seeds in the global domain 
        const boundings = store.modelStore.global_domain;
        upper = [boundings[3] - offset, boundings[4] - offset, boundings[5] - offset];
        lower = [boundings[0] + offset, boundings[1] + offset, boundings[2] + offset];
    }else{
        // there is a selected box or plane 
        // console.log("name", store.pipeline_browser)
        const pipeline_name = store.pipeline_browser[store.pipeline_selected];
        // console.log("name", pipeline_name)
        if(pipeline_name === "Seed Box " + (store.pipeline_selected).toString()){
            const pos = store.pipeline_box_pos[store.pipeline_selected];
            const dims = store.pipeline_box_dims[store.pipeline_selected];
            upper = [+pos[0] + +dims[0] / 2, +pos[1] + +dims[1] / 2, +pos[2] + +dims[2] / 2 ];
            lower = [+pos[0] - +dims[0] / 2, +pos[1] - +dims[1] / 2, +pos[2] - +dims[2] / 2 ];
            console.log("upper lower", upper, lower)
        }
        //TODO: If pipeline is plane 
    }

    if (store.placeSeedsStore.seeding_strategy === 'random'){
        const num_seeds = store.placeSeedsStore.num_random_seeds;
        add_new_seeds = num_seeds;
        // console.log("seeding area", upper, lower)
        console.log("num_seeds", num_seeds)
        for(let s = 0; s < num_seeds; ++s){
            const x = Math.random() * (upper[0] - lower[0]) +  lower[0];
            const y = Math.random() * (upper[1] - lower[1]) +  lower[1];
            const z = Math.random() * (upper[2] - lower[2]) +  lower[2];
            // add seeds to the corresponding seed box 
            store.renderStore.add_seeds([x, y, z], store.pipeline_selected);
        }
    }
    if(store.placeSeedsStore.seeding_strategy === 'uniform'){
        const seed_dims = store.placeSeedsStore.uniform_seeds_dims;
        add_new_seeds = store.placeSeedsStore.num_uniform_seeds;
        const x_interval = (upper[0] - lower[0]) / (seed_dims[0] - 1);
        const y_interval = (upper[1] - lower[1]) / (seed_dims[1] - 1);
        const z_interval = (upper[2] - lower[2]) / (seed_dims[1] - 1);
        for (let k = 0; k < seed_dims[2]; k++){
            for(let j = 0; j < seed_dims[1]; j++)
            {
                for(let i = 0; i < seed_dims[0]; i++)
                {
                    // const index = seed_dims[0] * seed_dims[1] * k + seed_dims[0] * j + i;
                    const x = i * x_interval + lower[0];
                    const y = j * y_interval + lower[1];
                    const z = k * z_interval + lower[2];
                    store.renderStore.add_seeds([x, y, z], store.pipeline_selected);
                }
            }
        }
    }
    if(store.placeSeedsStore.seeding_strategy === 'manually'){
        // console.log("insert manually")
        add_new_seeds = 1;
        const pos = store.placeSeedsStore.manual_seed_pos;
        store.renderStore.add_seeds(pos, store.pipeline_selected);
    }
    if (store.placeSeedsStore.seeding_strategy ==='upload'){
        // console.log("uploading seed file")
        add_new_seeds = store.placeSeedsStore.uploaded_seeds.length / 3;
        for(let i = 0; i < add_new_seeds; i++){
            const x = store.placeSeedsStore.uploaded_seeds[3 * i];
            const y = store.placeSeedsStore.uploaded_seeds[3 * i + 1];
            const z = store.placeSeedsStore.uploaded_seeds[3 * i + 2];
            // console.log(x, y, z)
            store.renderStore.add_seeds([x, y, z], store.pipeline_selected);
        }
    }
    console.log("seeds", store.renderStore.seeds)
    console.log("colors", store.renderStore.colors);
    // Calculate the colors 
    // if(store.controlStore.color_by_constant || (store.controlStore.color_by_attribute && store.attribute_data === null) ){
    //     for(let i = 0; i < add_new_seeds; i++){
    //         store.renderStore.addColorToArray(store.renderStore.color);
    //     }
    // }
    // // console.log("color", store.renderStore.color_array)
    // if(store.controlStore.color_by_attribute && store.attribute_data !== null){
    //     
    // }
}
export default GenSeeds





// if(store.controlStore.select_plane === true){
//     // check  which axis is on 
//     if (store.controlStore.plane_checked_x){
//         const pos = store.renderStore.seeds_plane_pos_x;
//         const dims = store.renderStore.seeds_plane_dims_x;
//         // console.log("pos", pos)
//         // console.log("dims", dims)
//         upper = [pos[0], pos[1] + dims[0] /2 - offset, pos[2] + dims[1] / 2 - offset];
//         lower = [pos[0], pos[1] - dims[0] /2 + offset, pos[2] - dims[1] / 2 + offset];
//     }
//     if (store.controlStore.plane_checked_y){
//         const pos = store.renderStore.seeds_plane_pos_y;
//         const dims = store.renderStore.seeds_plane_dims_y;
//         upper = [pos[0] + dims[0] /2 - offset, pos[1], pos[2] + dims[1]/2 - offset];
//         lower = [pos[0] - dims[0] /2 + offset, pos[1], pos[2] - dims[1]/2 + offset];
//     }
//     if (store.controlStore.plane_checked_z){
//         const pos = store.renderStore.seeds_plane_pos_z;
//         const dims = store.renderStore.seeds_plane_dims_z;
//         upper = [pos[0] + dims[0] /2 - offset, pos[1] + dims[1]/2 - offset, pos[2]];
//         lower = [pos[0] - dims[0] /2 + offset, pos[1] - dims[1]/2 + offset, pos[2]];
//     }
// }
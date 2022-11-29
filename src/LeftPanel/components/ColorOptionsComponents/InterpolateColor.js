

function find_cell_id(seed, lower, intervals, dims){
    let x_index = Math.floor((seed[0] - lower[0]) / intervals[0]);
    let y_index = Math.floor((seed[1] - lower[1]) / intervals[1]);
    let z_index = Math.floor((seed[2] - lower[2]) / intervals[2]);
    // console.log("debug x index", x_index, dims[0])
    if (x_index === dims[0] - 1){
        // console.log("x_index 0", x_index)
        x_index = x_index - 1;
        // console.log("x_index 1", x_index)
    }
    if (y_index === dims[1] - 1){
        y_index = y_index - 1;
    }
    if (z_index === dims[2] - 1){
        z_index = z_index - 1;
    }
    const index = [x_index, y_index, z_index];
    console.log("debug", seed, [x_index, y_index, z_index]);
    return index;
}

function trilinear_interpolation(seed, c000, c001, c010, c011, c100, c101, c110, c111, lower, upper){
    const xd = (seed[0] - lower[0]) / (upper[0] - lower[0]);
    const yd = (seed[1] - lower[1]) / (upper[1] - lower[1]);
    const zd = (seed[2] - lower[2]) / (upper[2] - lower[2]);
    // console.log(upper[0] - lower[0], upper[1] - lower[1], upper[2] - lower[2]);
    // console.log(index_min, index_max);
    // console.log(xd, yd, zd);
    const c00 = c000 * (1 - xd) + c100 * xd;
    const c01 = c001 * (1 - xd) + c101 * xd;
    const c10 = c010 * (1 - xd) + c110 * xd;
    const c11 = c011 * (1 - xd) + c111 * xd;
    const c0 = c00 * (1 - yd) + c10 * yd;
    const c1 = c01 * (1 - yd) + c11 * yd;
    const c = c0 * (1 - zd) + c1 * zd;
    return c;
}




function interpolate_color(store)
{
    let id = store.pipeline_selected;
    if (id === -1){
        id = 0;
    }
    const boundings = store.modelStore.global_domain;
    const dims = store.colorOptionsStore.attribute_dims;
    const lower = [boundings[0], boundings[1], boundings[2]];
    const x_interval = (boundings[3] - boundings[0]) / (dims[0] - 1)
    const y_interval = (boundings[4] - boundings[1]) / (dims[1] - 1)
    const z_interval = (boundings[5] - boundings[2]) / (dims[2] - 1)
    const intervals = [x_interval, y_interval, z_interval];
    // color by attribute value
    const seeds = store.renderStore.seeds[id];
    Promise.all(Array.from(seeds.map(async (seed, i) =>{
        // console.log("start_seeds", start, i)
        // console.log(store.colorOptionsStore.attribute_data)
        const index = find_cell_id(seed, lower, intervals, dims);
        const index_0 = [index[0], index[1], index[2]]
        const index_1 = [index[0] + 1, index[1], index[2]]
        const index_2 = [index[0] + 1, index[1] + 1, index[2]]
        const index_3 = [index[0], index[1] + 1, index[2]]
        const index_4 = [index[0], index[1], index[2]+1]
        const index_5 = [index[0] + 1, index[1], index[2] + 1]
        const index_6 = [index[0] + 1, index[1] + 1, index[2] + 1]
        const index_7 = [index[0], index[1] + 1, index[2] + 1]
        console.log("index", index_0, index_1, index_2, index_3, index_4, index_5, index_6, index_7)
        const i_0 = dims[0] * dims[1] * index_0[2] + dims[0] * index_0[1] + index_0[0]
        const i_1 = dims[0] * dims[1] * index_1[2] + dims[0] * index_1[1] + index_1[0]
        const i_2 = dims[0] * dims[1] * index_2[2] + dims[0] * index_2[1] + index_2[0]
        const i_3 = dims[0] * dims[1] * index_3[2] + dims[0] * index_3[1] + index_3[0]
        const i_4 = dims[0] * dims[1] * index_4[2] + dims[0] * index_4[1] + index_4[0]
        const i_5 = dims[0] * dims[1] * index_5[2] + dims[0] * index_5[1] + index_5[0]
        const i_6 = dims[0] * dims[1] * index_6[2] + dims[0] * index_6[1] + index_6[0] 
        const i_7 = dims[0] * dims[1] * index_7[2] + dims[0] * index_7[1] + index_7[0]
        console.log("i", i_0, i_1, i_2, i_3, i_4, i_5, i_6, i_7)
        const c000 = store.colorOptionsStore.attribute_data.getValue(i_0)
        const c001 = store.colorOptionsStore.attribute_data.getValue(i_3)
        const c010 = store.colorOptionsStore.attribute_data.getValue(i_4)
        const c011 = store.colorOptionsStore.attribute_data.getValue(i_7)
        const c100 = store.colorOptionsStore.attribute_data.getValue(i_1)
        const c101 = store.colorOptionsStore.attribute_data.getValue(i_2)
        const c110 = store.colorOptionsStore.attribute_data.getValue(i_5)
        const c111 = store.colorOptionsStore.attribute_data.getValue(i_6)
        console.log("value", c000, c001, c010, c011)
        const grid_lower = [intervals[0] * index_0[0], intervals[1] * index_0[1], intervals[2] * index_0[2]]
        const grid_upper = [intervals[0] * index_6[0], intervals[1] * index_6[1], intervals[2] * index_6[2]]
        return trilinear_interpolation(seed, c000, c001, c010, c011, c100, c101, c110, c111, grid_lower, grid_upper);
        
            
    }))).then(values =>{
        store.renderStore.SetAttributeColor(values, id);
    });

}

export default interpolate_color
function interpolate(x, x0, x1, v0, v1) {
    if (x0 === x1) {
        return v0;
    }
    const r = (x - x0) / (x1 - x0)
    return (1 - r) * v0 + r * v1;
}

function interpolate3(x, x0, x1, v0, v1) {
    if (x0 === x1) {
        return v0;
    }
    const r = (x - x0) / (x1 - x0)

    return [(1 - r) * v0[0] + r * v1[0],
        (1 - r) * v0[1] + r * v1[1],
        (1 - r) * v0[2] + r * v1[2]];
}

function bilinear_interpolate(x, x0, x1, y, y0, y1, v00, v01, v11, v10) {
    const v0 = interpolate(x, x0, x1, v00, v10)
    const v1 = interpolate(x, x0, x1, v01, v11)
    return interpolate(y, y0, y1, v0, v1)
}


function find_min(arr) {
    let min_value = Number.POSITIVE_INFINITY
    let idx = -1;
    for (let i = 0; i < arr.length; ++i) {
        if (arr[i] < min_value) {
            min_value = arr[i];
            idx = i;
        }
    }
    return [min_value, idx];
}

export {interpolate, interpolate3, bilinear_interpolate, find_min}
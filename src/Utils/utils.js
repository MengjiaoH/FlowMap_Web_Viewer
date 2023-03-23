function linspace(min, max, n) {
    if (n === 0) {
        return []
    } else if (n === 1) {
        return [(max + min) / 2]
    } else {
        const l = []
        const step = (max - min) / (n - 1)
        for (let i = 0; i < n; ++i) {
            l.push(min + i * step)
        }
        return l
    }
}

function rescale(v, target_min, target_max, input_min = 0, input_max = 1) {
    return (v - input_min) / (input_max - input_min) * (target_max - target_min) + target_min
}

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

function bilinear_interpolate3(x, x0, x1, y, y0, y1, v00, v01, v11, v10) {
    const v0 = interpolate3(x, x0, x1, v00, v10)
    const v1 = interpolate3(x, x0, x1, v01, v11)
    return interpolate3(y, y0, y1, v0, v1)
}

function trilinear_interpolate(x, x0, x1, y, y0, y1, z, z0, z1, v000, v001, v010, v011, v100, v101, v110, v111) {
    const v0 = bilinear_interpolate(x, x0, x1, y, y0, y1, v000, v100, v010, v110)
    const v1 = bilinear_interpolate(x, x0, x1, y, y0, y1, v001, v101, v011, v111)
    return interpolate(z, z0, z1, v0, v1)
}

function trilinear_interpolate3(x, x0, x1, y, y0, y1, z, z0, z1, v000, v001, v010, v011, v100, v101, v110, v111) {
    const v0 = bilinear_interpolate3(x, x0, x1, y, y0, y1, v000, v100, v010, v110)
    const v1 = bilinear_interpolate3(x, x0, x1, y, y0, y1, v001, v101, v011, v111)
    return interpolate3(z, z0, z1, v0, v1)
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

export {linspace, rescale, interpolate, interpolate3, bilinear_interpolate,bilinear_interpolate3,trilinear_interpolate,trilinear_interpolate3, find_min}
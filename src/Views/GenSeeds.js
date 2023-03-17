function rescale(v, min, max) {
    return v * (max - min) + min;
}


function random_gen(bounds, n_seeds) {
    const [x_min, x_max, y_min, y_max, z_min, z_max] = bounds

    const seeds = []
    for (let i = 0; i < n_seeds; ++i) {
        seeds.push([rescale(Math.random(), x_min, x_max),
            rescale(Math.random(), y_min, y_max),
            rescale(Math.random(), z_min, z_max)])
    }
    return seeds
}


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

function uniform_gen(bounds, x, y, z) {
    const [x_min, x_max, y_min, y_max, z_min, z_max] = bounds

    const x_range = linspace(x_min, x_max, x)
    const y_range = linspace(y_min, y_max, y)
    const z_range = linspace(z_min, z_max, z)

    const seeds = []

    z_range.forEach(zi => {
        y_range.forEach(yi => {
            x_range.forEach(xi => {
                seeds.push([xi, yi, zi])
            })
        })
    })

    return seeds
}

function manual_gen(bounds, x, y, z) {
    const [x_min, x_max, y_min, y_max, z_min, z_max] = bounds
    let [xv, yv, zv] = [x, y, z]

    if (xv < x_min) {
        xv = x_min
    }
    if (xv > x_max) {
        xv = x_max
    }
    if (yv < y_min) {
        yv = y_min
    }
    if (yv > y_max) {
        yv = y_max
    }
    if (zv < z_min) {
        zv = z_min
    }
    if (zv > z_max) {
        zv = z_max
    }
    return [[xv, yv, zv]]
}

export {random_gen, uniform_gen, manual_gen, linspace}
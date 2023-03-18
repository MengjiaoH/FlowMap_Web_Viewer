import {presets, presetnames} from "./presets"
import {interpolate, interpolate3} from "../Utils/utils";


class BaseTransferFunction {
    constructor(v_min, v_max) {
        this.v_min = v_min;
        this.v_max = v_max;
        if (v_max === v_min) {
            this.v_max = v_min + 1;
        }
        this.control_points = [this.v_min, this.v_max]
    }

    find_smaller(t) {
        if (t < this.v_min) return 0;
        if (t > this.v_max) return this.control_points.length - 1;
        return this.control_points.findLastIndex((v) => v <= t);
    }

    find_nearest(v) {
        let sdx = this.find_smaller(v);
        let ldx = sdx + 1;
        if (ldx === this.control_points.length) {
            return sdx;
        }

        if (v - this.control_points[sdx] <= this.control_points[ldx] - v) {
            return sdx;
        } else {
            return ldx;
        }
    }

    check_domain(x) {
        if (x < this.v_min) {
            x = this.v_min
        }
        if (x > this.v_max) {
            x = this.v_max
        }
        return x;
    }

    update_min(new_min) {
        this.control_points[0] = new_min;
        this.v_min = new_min;
        for (let i = 1; i < this.control_points.length; ++i) {
            if (this.control_points[i] < new_min) {
                this.control_points[i] = new_min;
            }
        }
    }

    update_max(new_max) {
        this.control_points[this.control_points.length - 1] = new_max;
        this.v_max = new_max;
        for (let i = 1; i < this.control_points.length - 1; ++i) {
            if (this.control_points[i] > new_max) {
                this.control_points[i] = new_max;
            }
        }
    }
}

class ColorTransferFunction extends BaseTransferFunction {
    constructor(v_min, v_max, colormap = presetnames[0]) {
        super(v_min, v_max);
        this.loadPreset(colormap);
    }

    color(v) {
        if (v < this.v_min) {
            return this.color_points[0];
        }
        let sdx = this.find_smaller(v);
        if (sdx >= this.control_points.length - 1) {
            return this.color_points[sdx];
        } else {
            const ldx = sdx + 1
            return interpolate3(v, this.control_points[sdx], this.control_points[ldx], this.color_points[sdx], this.color_points[ldx]);
        }
    }

    colors(array) {
        const color_array = new Array(array.length)
        for (let i = 0; i < color_array.length; ++i) {
            color_array[i] = this.color(array[i])
        }
        return color_array.flat();
    }

    loadPreset(colormap) {
        this.control_points = presets[colormap].control_points.map(x =>
            interpolate(x, 0, 1, this.v_min, this.v_max)
        );
        this.color_points = Object.assign([], presets[colormap].color_points);
    }

    inRange(x, idx) {
        const nx = this.control_points[idx];
        const v_range = this.v_max - this.v_min;

        return ((x - nx) / v_range) ** 2 < (0.03 ** 2);
    }

    movePoint(idx, x) {
        if (idx === 0 || idx === this.control_points.length - 1) {
        } else {
            const ldx = idx - 1;
            const hdx = idx + 1;
            if (x < this.control_points[ldx]) {
                x = this.control_points[ldx]
            }
            if (x > this.control_points[hdx]) {
                x = this.control_points[hdx]
            }
            this.control_points[idx] = x;
        }
    }

    removePoint(idx) {
        if (idx === 0 || idx === this.control_points.length - 1) {

        } else {
            this.control_points.splice(idx, 1);
            this.color_points.splice(idx, 1);
        }
    }

    addPoint(x, y) {
        x = this.check_domain(x)
        let idx = this.find_smaller(x) + 1;
        if (idx === this.control_points.length) {
            idx = this.control_points.length - 1;
        }
        this.control_points.splice(idx, 0, x);
        this.color_points.splice(idx, 0, y);
        return idx;
    }

    invert() {
        this.color_points.reverse()
    }

    copy() {
        const ctf = new ColorTransferFunction(this.v_min, this.v_max)
        ctf.color_points = [...this.color_points]
        ctf.control_points = [...this.control_points]
        return ctf;
    }
}

class OpacityTransferFunction extends BaseTransferFunction {
    constructor(v_min, v_max) {
        super(v_min, v_max)
        this.opacity_points = [0, 1];
    }

    reset() {
        this.control_points = [this.v_min, this.v_max]
        this.opacity_points = [0, 1]
    }

    addPoint(x, y) {
        if (y < 0) {
            y = 0;
        }
        if (y > 1) {
            y = 1;
        }
        x = this.check_domain(x)
        let idx = this.find_smaller(x) + 1;
        if (idx === this.control_points.length) {
            idx = this.control_points.length - 1;
        }
        this.control_points.splice(idx, 0, x);
        this.opacity_points.splice(idx, 0, y);
    }

    removePoint(idx) {
        if (idx === 0 || idx === this.control_points.length - 1) {

        } else {
            this.control_points.splice(idx, 1);
            this.opacity_points.splice(idx, 1);
        }
    }

    changePoint(idx, x, y) {
        if (y < 0) {
            y = 0
        }
        if (y > 1) {
            y = 1
        }
        if (idx === 0 || idx === this.control_points.length - 1) {
            this.opacity_points[idx] = y;
        } else {
            const ldx = idx - 1;
            const hdx = idx + 1;
            if (x < this.control_points[ldx]) {
                x = this.control_points[ldx]
            }
            if (x > this.control_points[hdx]) {
                x = this.control_points[hdx]
            }
            this.control_points[idx] = x;
            this.opacity_points[idx] = y;
        }
    }

    opacity(v) {
        if (v < this.v_min) {
            return this.opacity_points[0];
        }
        let sdx = this.find_smaller(v)
        if (sdx >= this.control_points.length - 1) {
            return this.opacity_points[sdx];
        } else {
            const ldx = sdx + 1;
            return interpolate(v, this.control_points[sdx], this.control_points[ldx], this.opacity_points[sdx], this.opacity_points[ldx])
        }
    }

    inRange(x, y, idx) {
        const nx = this.control_points[idx];
        const v_range = this.v_max - this.v_min;
        const ny = this.opacity_points[idx];

        return ((x - nx) / v_range) ** 2 + ((y - ny) ** 2) < 0.1 ** 2;
    }

    opacities(array) {
        return array.map(x => this.opacity(x))
    }

    copy() {
        const otf = new OpacityTransferFunction(this.v_min, this.v_max)
        otf.opacity_points = [...this.opacity_points]
        otf.control_points = [...this.control_points]
        return otf;
    }
}

export {ColorTransferFunction, OpacityTransferFunction}
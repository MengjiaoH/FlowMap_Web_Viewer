import {makeAutoObservable} from "mobx";

export default class ModelInfo {

    constructor(root) {
        this.root = root
        this.setBounds([-1, 1, -1, 1, -1, 1])
        makeAutoObservable(this)

        this.loadModelFromJson = this.loadModelFromJson.bind(this)
        this.setNFlowMaps = this.setNFlowMaps.bind(this)
    }

    computesGeometry() {
        const [x_min, x_max, y_min, y_max, z_min, z_max] = this.bounds
        const sx = x_max + x_min
        const sy = y_max + y_min
        const sz = z_max + z_min
        const [dx, dy, dz] = [x_max - x_min, y_max - y_min, z_max - z_min]
        this.center = [sx / 2, sy / 2, sz / 2]
        this.diag = Math.sqrt((x_max - x_min) ** 2 + (y_max - y_min) ** 2 + (z_max - z_min) ** 2);
        this.shortest_side = Math.min(dx, dy, dz)
    }

    getBounds() {
        return [...this.bounds]
    }

    setBounds(array) {
        this.bounds = array
        this.computesGeometry()
        if (this.root.seedbox_config) {
            this.root.seedbox_config.reset()
        }
    }

    setNFlowMaps(n) {
        this.n_flow_maps = n
        const t_start = this.interval * this.step_size;
        const t_end = (this.n_flow_maps / this.num_models) * this.step_size * this.interval;
        console.log(t_start, t_end)
        this.times = new Array(this.n_flow_maps / this.num_models).fill(0).map((u, i) =>
            ((i + 1) * this.interval * this.step_size - t_start) / (t_end - t_start) * (1 - (-1)) + (-1)
        )
    }

    loadModelFromJson(json_content) {
        const j = json_content
        this.mode = j['mode']
        this.num_models = j['num_models']
        this.setBounds([Number(j['bbox_x_lower']), Number(j['bbox_x_upper']),
            Number(j['bbox_y_lower']), Number(j['bbox_y_upper']),
            Number(j['bbox_z_lower']), Number(j['bbox_z_upper'])])
        this.interval = Number(j['interval'])
        this.step_size = Number(j['step_size'])
        this.model_file_name = j['models'][0]['filename']
        this.start_cycle = j['models'][0]['start_cycle']
        this.stop_cycle = j['models'][0]['stop_cycle']
        this.model_bbox = [Number(j['models'][0]['bounding_0']),
            Number(j['models'][0]['bounding_1']),
            Number(j['models'][0]['bounding_2']),
            Number(j['models'][0]['bounding_3']),
            Number(j['models'][0]['bounding_4']),
            Number(j['models'][0]['bounding_5'])]

        this.setNFlowMaps(100)
    }
}
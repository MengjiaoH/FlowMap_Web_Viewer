import {makeAutoObservable} from "mobx";
import {InferenceSession, Tensor} from 'onnxruntime-web';

const ort = require('onnxruntime-web');

const init_json = {
    "mode": "long",
    "num_models": 1,
    "bbox_x_upper": 6.28,
    "bbox_x_lower": 0,
    "bbox_y_upper": 6.28,
    "bbox_y_lower": 0,
    "bbox_z_upper": 6.28,
    "bbox_z_lower": 0,
    "interval": 5,
    "step_size": 0.01,
    "models": [
        {
            "filename": "ABC.onnx",
            "start_cycle": 0,
            "stop_cycle": 500,
            "bounding_0": 0,
            "bounding_1": 6.28,
            "bounding_2": 0,
            "bounding_3": 6.28,
            "bounding_4": 0,
            "bounding_5": 6.28
        }
    ],
    "global_uniformed_dim_x": "2",
    "global_uniformed_dim_y": "2",
    "global_uniformed_dim_z": "2"

}
export default class ModelInfo {

    constructor(root) {
        this.root = root
        this.dataset = "ABC"
        this.loadModelFromJson(init_json)
        this.model_available = false
        makeAutoObservable(this)
        this.loadDataset = this.loadDataset.bind(this)
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
        this.times = new Array(this.n_flow_maps / this.num_models).fill(0).map((u, i) =>
            ((i + 1) * this.interval * this.step_size - t_start) / (t_end - t_start) * (1 - (-1)) + (-1)
        )
    }

    async warmupModel(model) {
        const warmupTensor_1 = new Tensor("float32", new Float32Array(3000), [1000, 3]);
        const warmupTensor_2 = new Tensor("float32", new Float32Array(1000), [1000, 1]);
        const feeds = {input_1: warmupTensor_1, input_2: warmupTensor_2};
        try {
            await model.run(feeds);
        } catch (e) {
            console.error(e);
        }
    }

    async loadModel(model_dir) {
        ort.env.debug = false
        ort.env.wasm.numThreads = 20
        ort.env.wasm.simd = true

        const session = await InferenceSession.create(model_dir, {executionProviders: ['wasm']})
        await this.warmupModel(session).then(() => {
           return null
        })
        return session
    }

    loadModelFromJson(json_content) {
        this.model_available = false
        const j = json_content
        this.mode = j['mode']
        this.num_models = j['num_models']
        this.setBounds([Number(j['bbox_x_lower']), Number(j['bbox_x_upper']),
            Number(j['bbox_y_lower']), Number(j['bbox_y_upper']),
            Number(j['bbox_z_lower']), Number(j['bbox_z_upper'])])
        this.interval = Number(j['interval'])
        this.step_size = Number(j['step_size'])
        this.model_file_name = "./models/" + this.dataset + "/models/" + j['models'][0]['filename']
        this.start_cycle = j['models'][0]['start_cycle']
        this.stop_cycle = j['models'][0]['stop_cycle']
        this.model_bbox = [Number(j['models'][0]['bounding_0']),
            Number(j['models'][0]['bounding_1']),
            Number(j['models'][0]['bounding_2']),
            Number(j['models'][0]['bounding_3']),
            Number(j['models'][0]['bounding_4']),
            Number(j['models'][0]['bounding_5'])]
        this.setNFlowMaps(100)

        this.loadModel(this.model_file_name).then(r=>{
            this.model = r
            this.model_available = true
        })
    }

    loadDataset(dataset) {
        this.dataset = dataset
        const json_dir = './models/' + dataset + '/' + dataset + '.json'
        fetch(json_dir).then(response => response.json()).then(json_data => {
            this.loadModelFromJson(json_data)
        })
    }
}
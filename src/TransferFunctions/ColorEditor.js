import {useEffect, useMemo, useRef, useState} from "react";
import {Bar} from "react-chartjs-2";
import * as helpers from "chart.js/helpers"
import 'chart.js/auto';
import {ChromePicker} from 'react-color';

function ColorSelector(props) {

    const [c, setColor] = useState("#000")

    const style = useMemo(() => {
        return {
            position: 'absolute',
            zIndex: 2,
            left: props.pos[0],
            top: props.pos[1],
        }
    }, [props.pos])

    useEffect(() => {
        setColor(props.color)
    }, [props.color])

    const onColorChange = (color) => {
        setColor(color.hex)
    }

    const updateColor = (color) => {
        props.changeColor(color, props.index)
    }

    const render = () => {
        return <ChromePicker color={c} onChange={onColorChange} onChangeComplete={updateColor}/>
    }

    return <div style={style}>{props.display ? render() :  null }</div>
}

function ColorEditor(props) {
    const ref = useRef()
    const ctf = useMemo(() => props.ctf, [props.ctf])
    const [v_min, v_max] = useMemo(() => [ctf.v_min, ctf.v_max], [ctf.v_max, ctf.v_min])
    const resolution = 256

    const [h_data, h_color] = useMemo(() => {
        const v_min = ctf.v_min
        const v_max = ctf.v_max
        const step_size = (v_max - v_min) / (resolution - 1)
        const h_data = new Array(resolution)
        const colors = new Array(resolution)
        for (let i = 0; i < resolution + 1; ++i) {
            const x = v_min + i * step_size
            const c = ctf.color(x).map(v => Math.round(v * 255));
            h_data[i] = {x: x, y: 1}
            colors[i] = "rgba(" + c[0] + "," + c[1] + "," + c[2] + ",1)"
        }
        return [h_data, colors];
    }, [ctf])

    const [b_data, b_color] = useMemo(() => {
        const control_points = ctf.control_points;
        const colors = control_points.map(p => ctf.color(p).map(x => Math.round(x * 255))).map(c => "rgba(" + c[0] + "," + c[1] + "," + c[2] + ",1)")
        const data = control_points.map(v => {
            return {x: v, y: 0.5}
        })

        return [data, colors];
    }, [ctf])

    const data = useMemo(() => {
        return {
            datasets: [
                {
                    label: "controlpoints",
                    type: 'bubble',
                    data: b_data,
                    backgroundColor: b_color,
                    borderWidth: 0.5,
                    borderColor: "rgba(0,0,0,1)",
                    radius: 5,
                },
                {
                    label: "colormap",
                    type: 'bar',
                    data: h_data,
                    backgroundColor: h_color,
                    barPercentage: 1,
                    categoryPercentage: 1,
                },
            ]
        }
    }, [b_color, b_data, h_color, h_data])
    useEffect(() => {
        ref.current.canvas.oncontextmenu = (e) => {
            e.preventDefault()
        }
    }, [])

    const options = useMemo(() => {
        return {
            layout: {
                padding: {bottom: 10}
            },
            maintainAspectRatio: false,
            scales: {
                y: {
                    display: false,
                    type: "linear",
                    min: 0,
                    max: 1
                },
                x: {
                    type: "linear",
                    min: v_min,
                    max: v_max,
                },
            },
            events: [],
            plugins: {
                tooltip: {events: []},
                legend: {display: false}
            },
            animation: false,
        }

    }, [v_max, v_min])


    const [displayColorSelector, setDisplayColorSelector] = useState(false)
    const [colorIndex, setColorIndex] = useState(0)
    const [csColor, setCSColor] = useState("rgb(0,0,0)")
    const [prevPos, setPrevPos] = useState([0, 0])
    const [csPos,setCSPose] = useState([0,0])

    function getDataPosition(e) {
        const chart = ref.current;
        const pos = helpers.getRelativePosition(e, chart);
        const x = chart.scales.x.getValueForPixel(pos.x);
        const y = chart.scales.y.getValueForPixel(pos.y);
        return [x, y]
    }

    const onContextMenu = (e) => {
        const [x] = getDataPosition(e);
        const idx = ctf.find_nearest(x);
        setColorIndex(idx);
        setCSColor(getColorString(idx))
        setCSPose([e.nativeEvent.offsetX, e.nativeEvent.offsetY])
        console.log(e)

        if (ctf.inRange(x, idx)) {
            setDisplayColorSelector(true)
        } else {
            setDisplayColorSelector(false)
        }

    }

    const closeCS = () => {
        setDisplayColorSelector(false)
    }


    const changeColor = (color, idx) => {
        ctf.color_points[idx] = [color.rgb.r, color.rgb.g, color.rgb.b].map(x => x / 255)
        props.updateCtf()
    }

    const getColorString = (idx) => {
        const color = ctf.color_points[idx].map((x) => Math.round(x * 255))
        return "rgb(" + color.join(',') + ")"
    }

    function onMouseDown(e) {
        const [x, y] = getDataPosition(e);
        setPrevPos([x, y]);
    }

    function onMouseUp(e) {
        const [px] = prevPos;
        const [x] = getDataPosition(e);

        if (x !== px) {
            const idx = ctf.find_nearest(px);
            if (ctf.inRange(px, idx)) {
                ctf.movePoint(idx, x);
                props.updateCtf();
            }
        }
        setDisplayColorSelector(false)
    }

    function onDoubleClick(e) {
        const [x] = getDataPosition(e);
        const idx = ctf.find_nearest(x)

        if (ctf.inRange(x, idx)) {
            ctf.removePoint(idx)
            props.updateCtf()
        } else {
            const nidx = ctf.addPoint(x, [0, 0, 0])
            setColorIndex(nidx);
            setCSColor(getColorString(nidx))
            setCSPose([e.nativeEvent.offsetX, e.nativeEvent.offsetY])

            props.updateCtf()
            setDisplayColorSelector(true)
        }
    }


    return <><Bar ref={ref}
                  data={data}
                  options={options}
                  onContextMenu={onContextMenu}
                  onMouseDown={onMouseDown}
                  onMouseUp={onMouseUp}
                  onDoubleClick={onDoubleClick}
    />
        <ColorSelector
            color={csColor}
            index={colorIndex}
            display={displayColorSelector}
            changeColor={changeColor}
            close={closeCS}
            pos={csPos}
        /></>
}

export default ColorEditor
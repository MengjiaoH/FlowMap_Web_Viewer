import {useEffect, useMemo, useRef, useState} from "react";
import {Line} from "react-chartjs-2";
import * as helpers from "chart.js/helpers"
import 'chart.js/auto'

function OpacityEditor(props) {
    const scalars = props.data
    const otf = props.otf
    const otf_update = props.updateOtf
    const ref = useRef()

    const otf_line_data = useMemo(() => {
        const c_points = otf.control_points
        const datapoints = new Array(c_points.length)
        for (let i = 0; i < c_points.length; ++i) {
            datapoints[i] = {x: c_points[i], y: otf.opacity_points[i]}
        }
        return datapoints
    }, [otf.control_points, otf.opacity_points])

    const [otf_histogram_data, h_max] = useMemo(() => {

        const bins = 256;
        const counts = new Array(bins).fill(1);
        const bin_width = (otf.v_max - otf.v_min) / (bins - 1)

        let max_count = 0;
        scalars.forEach(function (x) {
            let idx = Math.floor((x - otf.v_min) / bin_width);
            if (idx >= bins) {
                idx = bins - 1
            } else if (idx < 0) {
                idx = 0
            }
            counts[idx] += 1;
            if (counts[idx] > max_count) {
                max_count = counts[idx];
            }
        })

        const log_max = Math.log10(max_count)

        const h_data = counts.map((c, i) => {
            const x = i * bin_width + otf.v_min
            const y = Math.log10(c) / log_max
            return {x: x, value: y}
        })

        return [h_data, log_max];
    }, [otf.v_max, otf.v_min, scalars])


    const data = useMemo(() => {
        return {
            datasets: [
                {
                    type: 'line',
                    data: otf_line_data,
                    label: 'opacity',
                    yAxisId: 'y',
                    'pointRadius':5,
                    'borderColor':"rgba(128,128,128,1)"
                },
                {
                    type: "bar",
                    label: "data_histogram",
                    yAxisId: 'ybar',
                    parsing: {
                        yAxisKey: 'value',
                    },
                    data: otf_histogram_data,
                    backgroundColor: 'rgba(170,170,170,0.5)',
                    barPercentage: 1,
                    categoryPercentage: 1,
                    borderWidth: 0,
                },
            ]
        }
    }, [otf_histogram_data, otf_line_data])

    const options = useMemo(() => {
        return {
            layout: {
                padding: {top:0,bottom: 10}
            },
            maintainAspectRatio: false,
            scales: {
                x: {
                    display: true,
                    type: 'linear',
                    position: 'bottom',
                    min: otf.v_min,
                    max: otf.v_max,
                    grid: {
                        drawOnChartArea: false,
                    },
                    ticks: {display: false}
                },
                y: {
                    display: true,
                    min: 0,
                    max: 1.05,
                    ticks: {
                        display:false,
                        autoSkip: false,
                        stepSize: 0.2,
                    },
                    grid: {
                        drawOnChartArea: false,
                    }
                },
                ybar: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    min: 0,
                    max: h_max,
                    ticks: {
                        display:false,
                        autoSkip: false,
                        stepSize: h_max / 5,
                    },
                    grid: {
                        drawOnChartArea: false,
                    }
                }
            },
            events: [],
            plugins: {
                tooltip: {events: []},
                legend: {display: false}
            },
            animations: false
        }
    }, [h_max, otf.v_max, otf.v_min])

    useEffect(() => {
        ref.current.canvas.oncontextmenu = (e) => {
            e.preventDefault()
        }
    }, [])

    // interactions
    // double click: insert new control point or delete control point
    // drag: change (x,y) of the selected point
    const [prevPos, setPrevPos] = useState([0, 0])

    function getDataPosition(e) {
        const chart = ref.current;
        const pos = helpers.getRelativePosition(e, chart);
        const x = chart.scales.x.getValueForPixel(pos.x);
        const y = chart.scales.y.getValueForPixel(pos.y);
        return [x, y]
    }

    function onMouseDown(e) {
        const [x, y] = getDataPosition(e);
        setPrevPos([x, y]);
    }

    function onContextMenu(e) {
        const [x, y] = getDataPosition(e);
        const idx = otf.find_nearest(x)

        if (otf.inRange(x, y, idx)) {
            otf.removePoint(idx)
            otf_update()
        } else {
            otf.addPoint(x, y)
            otf_update()
        }
    }

    function onMouseUp(e) {
        const [px, py] = prevPos;
        const [x, y] = getDataPosition(e);
        if (x !== px || y !== py) {
            const idx = otf.find_nearest(px);
            if (otf.inRange(px, py, idx)) {
                otf.changePoint(idx, x, y)
                otf_update()
            }
        }
    }

    function onDoubleClick(e) {
        otf.reset()
        otf_update()
    }

    return <Line ref={ref}
                 data={data}
                 options={options}
                 onMouseDown={onMouseDown}
                 onDoubleClick={onDoubleClick}
                 onMouseUp={onMouseUp}
                 onContextMenu={onContextMenu}
    />
}

export default OpacityEditor
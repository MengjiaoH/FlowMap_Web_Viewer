import React, {useEffect, useState} from "react";
import RGL, {WidthProvider} from "react-grid-layout";
import IntegralLinesViewer from "./IntegralLinesViewer";

const ReactGridLayout = WidthProvider(RGL);

function MainViewLayout(props) {
    const [views, setViews] = useState([{x:0,y:0,w:4,h:3,id:'line_view'}])
    const [layout, setLayout] = useState([])
    const [cols, setCols] = useState(12)
    const [rowHeight, setRowHeight] = useState(30)
    const [onLayoutChange, setOnLayoutChange] = useState(function () {
    })

    useEffect(()=>{
        setLayout(generateLayout())
    },[])

    const generateDom = function () {
        return views.map((view,i)=>{
            return <div key={view.id}>{view.id}</div>
        })
    }

    const generateLayout = function () {
        return views.map(view=>{
            return {x:view.x,y:view.y,w:view.w,h:view.h, i:view.id}
        })
    }

    return <ReactGridLayout
        layout={layout}
        onLayoutChange={onLayoutChange}
    >
        {generateDom()}
    </ReactGridLayout>
}

export default MainViewLayout
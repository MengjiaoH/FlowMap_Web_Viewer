import React, {useEffect, useMemo, useState} from "react";
import RGL, {WidthProvider} from "react-grid-layout";
import IntegralLinesViewer from "./IntegralLinesViewer";
import Navbar from "react-bootstrap/Navbar";
import Container from 'react-bootstrap/Container';


function MainViewLayout(props) {
    const ReactGridLayout = useMemo(() => WidthProvider(RGL), []);
    const views = useMemo(() => {
        return [
            <div key={'line_view'} data-grid={{x: 0, y: 0, w: 4, h: 4, isDraggable: false}}>
                <IntegralLinesViewer/>
            </div>,
            <div key={'seed_config'} data-grid={{x: 4, y: 0, w: 1, h: 1}}>
                <div style={{borderStyle: "solid", borderWidth: 1, width: "100%", height: "100%"}}>seed config</div>
            </div>,
            <div key={'line_style_config'} data-grid={{x: 4, y: 1, w: 1, h: 1}}>
                <div style={{borderStyle: "solid", borderWidth: 1, width: "100%", height: "100%"}}>line style sconfig
                </div>
            </div>
        ]
    }, [])

    useEffect(() => {
    }, [])

    return <>
        <Navbar variant="dark" bg="secondary" expand="lg">
            <Container fluid>
                <Navbar.Brand>{"Pathline Viewer"}</Navbar.Brand>
            </Container>
        </Navbar>
        <ReactGridLayout cols={12} margin={[0,0]}>
            {views}
        </ReactGridLayout>
    </>
}

export default MainViewLayout
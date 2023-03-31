import React, {useMemo} from "react";
import {Responsive, WidthProvider} from "react-grid-layout";
import MainSceneDisplay from "./3DRender/PrimaryRenderer";
import Navbar from "react-bootstrap/Navbar";
import Paper from '@mui/material/Paper';
import SeedPanel from "./SeedPanel/SeedPanel";
import LineStylePanel from "./LineStylePanel/LineStylePanel";
import ModelPanel from "./ModelInfoPanel/ModelPanel";
import ScalarFieldPanel from "./ScalarFieldPanel/ScalarFieldPanel";

function MainViewLayout(props) {
    const ReactGridLayout = useMemo(() => WidthProvider(Responsive), []);

    const views = useMemo(() => {
        return [
            <div key={'line_view'} data-grid={{x: 0, y: 0, w: 16, h: 22, isDraggable: false}}>
                <Paper elevation={5} style={{width: "100%", height: "100%"}}>
                    <MainSceneDisplay/>
                </Paper>
            </div>,
            <div key={'model_panel'} data-grid={{x: 16, y: 0, w: 4, h: 11}}>
                <Paper elevation={5} style={{width: "100%", height: "100%"}}>
                    <ModelPanel/>
                </Paper>
            </div>,
            <div key={'seed_config'} data-grid={{x: 20, y: 0, w: 4, h: 11}}>
                <Paper elevation={5} style={{width: "100%", height: "100%"}}>
                    <SeedPanel/>
                </Paper>
            </div>,
            <div key={'line_style_config'} data-grid={{x: 20, y: 11, w: 4, h: 11}}>
                <Paper elevation={5} style={{width: "100%", height: "100%"}}>
                    <LineStylePanel/>
                </Paper>
            </div>,
            <div key={'volume_panel'} data-grid={{x: 16, y: 11, w: 4, h: 11}}>
                <Paper elevation={5} style={{width: "100%", height: "100%"}}>
                    <ScalarFieldPanel/>
                </Paper>
            </div>,
        ]
    }, [])

    return <>
        <Navbar variant="dark" bg="secondary" expand="lg">
            <Navbar.Brand className={"navbar-brand mx-auto"}><h2><b>{"Lagrangian-Based Flow Field Explorer"}</b></h2>
            </Navbar.Brand>
        </Navbar>
        <ReactGridLayout margin={[5, 5]} breakpoints={{lg: 2880, md: 1440, sm: 768, xs: 480, xxs: 0}}
                         cols={{lg: 24, md: 24, sm: 8, xs: 4, xxs: 1}}
                         rowHeight={50}
                         draggableHandle={".drag-handle"}>
            {views}
        </ReactGridLayout>
    </>
}

export default MainViewLayout
import React, {useMemo} from "react";
import {Responsive, WidthProvider} from "react-grid-layout";
import MainSceneDisplay from "./3DRender/PrimaryRenderer";
import Navbar from "react-bootstrap/Navbar";
import Container from 'react-bootstrap/Container';
import Paper from '@mui/material/Paper';
import SeedPanel from "./SeedPanel/SeedPanel";
import LineStylePanel from "./LineStylePanel/LineStylePanel";
import ModelPanel from "./ModelInfoPanel/ModelPanel";
import ScalarFieldPanel from "./ScalarFieldPanel/ScalarFieldPanel";

function MainViewLayout(props) {
    const ReactGridLayout = useMemo(() => WidthProvider(Responsive), []);

    const views = useMemo(() => {
        return [
            <div key={'line_view'} data-grid={{x: 0, y: 0, w: 12, h: 8, isDraggable: false}}>
                <Paper elevation={5} style={{width: "100%", height: "100%"}}>
                    <MainSceneDisplay/>
                </Paper>
            </div>,
            <div key={'model_panel'} data-grid={{x: 12, y: 0, w: 6, h: 4}}>
                <Paper elevation={5} style={{width: "100%", height: "100%"}}>
                    <ModelPanel />
                </Paper>
            </div>,
            <div key={'volume_panel'} data-grid={{x:12,y:4,w:6,h:4}}>
                <Paper elevation={5} style={{width:"100%", height: "100%"}}>
                    <ScalarFieldPanel />
                </Paper>
            </div>,
            <div key={'seed_config'} data-grid={{x: 18, y: 0, w: 6, h: 4}} >
                <Paper elevation={5} style={{width: "100%", height: "100%"}}>
                    <SeedPanel/>
                </Paper>
            </div>,
            <div key={'line_style_config'} data-grid={{x: 18, y: 4, w: 6, h: 4}}>
                <Paper elevation={5} style={{width: "100%", height: "100%"}}>
                    <LineStylePanel />
                </Paper>
            </div>
        ]
    }, [])

    return <>
        <Navbar variant="dark" bg="secondary" expand="lg">
            <Container fluid>
                <Navbar.Brand>{"Neural Flow Map Web Viewer"}</Navbar.Brand>
            </Container>
        </Navbar>
        <ReactGridLayout margin={[5, 5]} breakpoints={{lg: 1440, md: 1200, sm: 768, xs: 480, xxs: 0}}
                         cols={{lg: 24, md: 12, sm: 8, xs: 4, xxs: 1}}
                         draggableHandle={".drag-handle"}>
            {views}
        </ReactGridLayout>
    </>
}

export default MainViewLayout
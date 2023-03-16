import React, {useEffect, useMemo, useState} from "react";
import {Responsive, WidthProvider} from "react-grid-layout";
import MainSceneDisplay from "./MainSceneDisplay";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from 'react-bootstrap/Container';
import SeedConfig from "./SeedConfig";

function MainViewLayout(props) {
    const ReactGridLayout = useMemo(() => WidthProvider(Responsive), []);
    const [layout, setLaytout] = useState([])

    const views = useMemo(() => {
        return [
            <div key={'line_view'} data-grid={{
                x: 0, y: 0, w: 16, h: 8,
                isDraggable: false
            }}
                 className={"bordered"}>
                <MainSceneDisplay/>
            </div>,
            <div key={'info_panel'} data-grid={{x: 16, y: 0, w: 4, h: 8}} className={"bordered"}>
                <div>info_panel</div>
            </div>,
            <div key={'seed_config'} data-grid={{x: 20, y: 0, w: 4, h: 4}} className={"bordered"}>
                <SeedConfig/>
            </div>,
            <div key={'line_style_config'} data-grid={{x: 20, y: 4, w: 4, h: 4}} className={"bordered"}>
                <div>line style sconfig</div>
            </div>
        ]
    }, [])

    return <>
        <Navbar variant="dark" bg="secondary" expand="lg">
            <Container fluid>
                <Navbar.Brand>{"Neural Flow Map Web Viewer"}</Navbar.Brand>
                <Navbar.Collapse id="dataset_dropdown">
                    <Nav>
                        <NavDropdown
                            id="data_file_title"
                            title="select model"
                            menuVariant="light"
                        >
                            <NavDropdown.Item>place holder model 1</NavDropdown.Item>
                            <NavDropdown.Item>place holder model 2</NavDropdown.Item>
                            <NavDropdown.Item>place holder model 3</NavDropdown.Item>
                            <NavDropdown.Item>place holder model 4</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <ReactGridLayout margin={[0, 0]} breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                         cols={{lg: 24, md: 12, sm: 8, xs: 4, xxs: 1}}
                         draggableHandle={".drag-handle"}>
            {views}
        </ReactGridLayout>
    </>
}

export default MainViewLayout
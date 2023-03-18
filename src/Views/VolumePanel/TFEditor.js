import {observer} from "mobx-react";
import React, {useContext, useMemo} from "react";
import {global_data} from "../../Context/DataContainer";
import OpacityEditor from "../../TransferFunctions/OpacityEditor";
import ColorEditor from "../../TransferFunctions/ColorEditor";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {Button, Dropdown} from "react-bootstrap";
import {presetnames} from "../../TransferFunctions/presets";


function TFEditor(props) {
    const g_data = useContext(global_data)

    const otf = useMemo(() => {
        return g_data.volume_config.opacity_tf
    }, [g_data.volume_config.opacity_tf])
    const ctf = useMemo(() => {
        return g_data.volume_config.color_tf
    }, [g_data.volume_config.color_tf])
    const scalars = useMemo(() => {
        return g_data.volume_config.scalars
    }, [g_data.volume_config.scalars])

    const dropdown_items = presetnames.map((x, i) => {
        return <Dropdown.Item className={'smallfont'} key={"presets_" + x} onClick={function (event) {
            ctf.loadPreset(x)
            g_data.volume_config.updateCtf(ctf);
        }}>{x}</Dropdown.Item>
    })

    return <div>
        <Row style={{height: "200px"}}>
            <OpacityEditor data={scalars} otf={otf} updateOtf={function () {
                g_data.volume_config.updateOtf(otf)
            }}/>
        </Row>
        <Row style={{height: "100px"}}>
            <ColorEditor ctf={ctf} updateCtf={() => {
                g_data.volume_config.updateCtf(ctf)
            }}/>
        </Row>
        <Row>
            <Col>
                <Button onClick={function(event){
                    ctf.invert()
                    g_data.volume_config.updateCtf(ctf);
                }}>Invert Colormap</Button>
            </Col>
            <Col>
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                        Apply Color Preset
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {dropdown_items}
                    </Dropdown.Menu>
                </Dropdown>
            </Col>

        </Row>
    </div>
}

export default observer(TFEditor)
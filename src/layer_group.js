import { ResolumeContext } from './resolume_provider'
import React, { useContext } from 'react'
import Layer from './layer.js'
import ParameterMonitor from './parameter_monitor.js'
import './layer_group.css';

/**
  * Render a layer group
  */
function LayerGroup(props) {
    const context = useContext(ResolumeContext);

    const layers = props.layers.map((layer, index) =>
        <Layer
            id={layer.id}
            key={layer.id}
            index={index}
            name={layer.name}
            bypassed={layer.bypassed}
            solo={layer.solo}
            crossfadergroup={layer.crossfadergroup}
            master={layer.master}
            maskmode={layer.maskmode}
            faderstart={layer.faderstart}
            ignorecolumntrigger={layer.ignorecolumntrigger}
            dashboard={layer.dashboard}
            autopilot={layer.autopilot}
            transition={layer.transition}
            audio={layer.audio}
            video={layer.video}
            selected={layer.selected}
        />
    ).reverse();

    const set_bypass    = bypassed  => context.parameters.update_parameter(props.bypassed.id, bypassed);
    const set_solo      = solo      => context.parameters.update_parameter(props.solo.id, solo);

    /* Replace # with ((index+1) of Layer) */
    const name      = props.name.value.replace(/#/g, props.index+1);
    const select    = () => context.action('trigger', `/composition/layergroups/by-id/${props.id}/select`);
    const clear     = () => context.action('trigger', `/composition/layergroups/by-id/${props.id}/clear`);

    return (
        <ParameterMonitor.Single parameter={props.selected} render={selected => (
            <div className={`layer_group ${selected.value ? 'highlighted' : ''}`}>
                <div className="cbs">
                    <div className={`handle ${selected.value ? 'selected' : ''}`} onMouseDown={select}>
                        {name}
                    </div>
                    <div className={`button off`} onMouseDown={clear}>X</div>
                    <ParameterMonitor.Single parameter={props.bypassed} render={bypassed => (
                        <div className={`button ${bypassed.value ? 'on' : 'off'}`} onMouseDown={() => set_bypass(!bypassed.value)}>B</div>
                    )} />
                    <ParameterMonitor.Single parameter={props.solo} render={solo => (
                        <div className={`button ${solo.value ? 'on' : 'off'}`} onMouseDown={() => set_solo(!solo.value)}>S</div>
                    )} />
                </div>
                {layers}
            </div>
        )} />
    );
}

export default LayerGroup;
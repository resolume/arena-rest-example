import { ResolumeContext } from './resolume_provider'
import React, { useContext } from 'react'
import Layer from './layer.js'
import ParameterMonitor from './parameter_monitor.js'
import ContextMenu from './context_menu.js';
import './layer_group.css';

/**
  * Render a layer group
  */
function LayerGroup(props) {
    const context = useContext(ResolumeContext);

    const menu_options = {
        'New':                      { action: () => context.post('/composition/layergroups/add')                            },
        'Duplicate':                { action: () => context.post(`/composition/layergroups/by-id/${props.id}/duplicate`)    },
        'Remove':                   { action: () => context.remove(`/composition/layergroups/by-id/${props.id}`)            },
        'Add Layer':                { action: () => context.post(`/composition/layergroups/by-id/${props.id}/add-layer`)    },
        'Ignore Column Trigger':    { param: props.ignorecolumntrigger                                      },
    };

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
            <div>
                <div className={`layer_group ${selected.value ? 'highlighted' : ''}`}>
                    <div className="cbs">
                        <ContextMenu
                            name={name}
                            options={menu_options}
                        >
                            <div className={`handle ${selected.value ? 'selected' : ''}`} onMouseDown={select}>
                                {name}
                            </div>
                        </ContextMenu>
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
            </div>
        )} />
    );
}

export default LayerGroup;

import { ResolumeContext } from './resolume_provider.js'
import React, { useContext } from 'react'
import ParameterMonitor from './parameter_monitor.js'
import Properties from './properties.js';
import PropTypes from 'prop-types';
import Parameter from './parameter';

// we need to draw outside of our container, but instead
// draw elsewhere in the html hierarchy
const layer_root = document.getElementById('layer_properties');

/**
  * Render a layer
  */
function Layer(props) {
    const context = useContext(ResolumeContext);

    const set_bypass                = bypassed  => context.parameters.update_parameter(props.bypassed.id, bypassed);
    const set_solo                  = solo      => context.parameters.update_parameter(props.solo.id, solo);
    const toggle_crossfadergroup    = value     => context.parameters.update_parameter(props.crossfadergroup.id, value);

    /* Replace # with ((index+1) of Layer) */
    const name      = props.name.value.replace(/#/g, props.index+1);

    const select    = () => context.action('trigger', `/composition/layers/by-id/${props.id}/select`);
    const clear     = () => context.action('trigger', `/composition/layers/by-id/${props.id}/clear`);

//onDoubleClick={() => handle_reset(props.autopilot.target.id)}

    return (
        <div className="layer">       
            <div className="controls">
                <div className="buttons">
                    <div className="cbs">
                        <div className={`button off`} onClick={clear}>Clear</div>

                        <ParameterMonitor.Single parameter={props.bypassed} render={bypassed => (
                            <div className={`button ${bypassed.value ? 'on' : 'off'}`} onClick={() => set_bypass(!bypassed.value)}>B</div>
                        )} />

                        <ParameterMonitor.Single parameter={props.solo} render={solo => (
                            <div className={`button ${solo.value ? 'on' : 'off'}`} onClick={() => set_solo(!solo.value)}>S</div>
                        )} />
                    </div>

                    <ParameterMonitor.Single parameter={props.crossfadergroup} render={crossfadergroup => (
                        <div className="crossfadergroup">
                            <div className={`button ${crossfadergroup.index === 1 ? 'on' : 'off'}`} onClick={() => toggle_crossfadergroup(1)}>A</div>
                            <div className={`button ${crossfadergroup.index === 2 ? 'on' : 'off'}`} onClick={() => toggle_crossfadergroup(2)}>B</div>
                        </div>
                    )} />
                    <div className={`handle ${props.selected.value ? 'selected' : ''}`} onMouseDown={select}>
                        {name}
                    </div>
                </div>
                <div className="master">
                    <Parameter
                        name="Master"
                        parameter={props.master}
                        hidelabel="yes"
                        key={props.master.id}
                        id={props.master.id}
                    />
                </div>
            </div>
            {props.selected.value &&
                <Properties
                    name={name}    
                    dashboard={props.dashboard}
                    autopilot={props.autopilot}
                    transition={props.transition}
                    audio={props.audio}
                    video={props.video}
                    title="Layer"
                    root={layer_root}
                />
            }
        </div>
    );
}

//Layer.contextType = ResolumeContext;

/**
  * Property declaration for Layer component
  */
Layer.propTypes = {
    id: PropTypes.number.isRequired,
    selected: PropTypes.object.isRequired,
    dashboard: PropTypes.object.isRequired
}

export default Layer;

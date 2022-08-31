import { ResolumeContext } from './resolume_provider.js'
import React, { useContext } from 'react'
import ParameterMonitor from './parameter_monitor.js'
import Properties from './properties.js';
import PropTypes from 'prop-types';
import ContextMenu from './context_menu.js';
import Parameter from './parameter';
import './layer.css';

// we need to draw outside of our container, but instead
// draw elsewhere in the html hierarchy
const layer_root = document.getElementById('layer_properties');

/**
  * Render a layer
  */
function Layer(props) {
    const context = useContext(ResolumeContext);

    const menu_options = {
        'Mask Mode':                props.maskmode,    
        'Fader Start':              props.faderstart,
        'Ignore Column Trigger':    props.ignorecolumntrigger
    };

    const set_bypass                = bypassed  => context.parameters.update_parameter(props.bypassed.id, bypassed);
    const set_solo                  = solo      => context.parameters.update_parameter(props.solo.id, solo);
    const toggle_crossfadergroup    = value     => context.parameters.update_parameter(props.crossfadergroup.id, value);

    /* Replace # with ((index+1) of Layer) */
    const name      = props.name.value.replace(/#/g, props.index+1);
    const select    = () => context.action('trigger', `/composition/layers/by-id/${props.id}/select`);
    const clear     = () => context.action('trigger', `/composition/layers/by-id/${props.id}/clear`);

    return (
        <div>
            <div>
                <ContextMenu
                    name={props.name.value}
                    options={menu_options}
                >        
                <div className="layer">       
                    <div className="controls">
                        <div className="buttons">
                            <div className="cbs">
                                <div className={`button off`} onMouseDown={clear}>Clear</div>
                                <ParameterMonitor.Single parameter={props.bypassed} render={bypassed => (
                                    <div className={`button ${bypassed.value ? 'on' : 'off'}`} onMouseDown={() => set_bypass(!bypassed.value)}>B</div>
                                )} />
                                <ParameterMonitor.Single parameter={props.solo} render={solo => (
                                    <div className={`button ${solo.value ? 'on' : 'off'}`} onMouseDown={() => set_solo(!solo.value)}>S</div>
                                )} />
                            </div>
                            <ParameterMonitor.Single parameter={props.crossfadergroup} render={crossfadergroup => (
                                <div className="crossfadergroup">
                                    <div className={`button ${crossfadergroup.index === 1 ? 'on' : 'off'}`} onMouseDown={() => toggle_crossfadergroup(1)}>A</div>
                                    <div className={`button ${crossfadergroup.index === 2 ? 'on' : 'off'}`} onMouseDown={() => toggle_crossfadergroup(2)}>B</div>
                                </div>
                            )} />
                            <ParameterMonitor.Single parameter={props.selected} render={selected => (
                                <div className={`handle ${selected.value ? 'selected' : ''}`} onMouseDown={select}>
                                    {name}
                                </div>
                            )} />
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
                </div>
                </ContextMenu>
            </div>
            <ParameterMonitor.Single parameter={props.selected} render={selected => (
                <React.Fragment>
                    {selected.value &&
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
                </React.Fragment>
            )} />
        </div>
    );
}

/**
  * Property declaration for Layer component
  */
Layer.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.object.isRequired,
    selected: PropTypes.object.isRequired,
    faderstart: PropTypes.object.isRequired,
    ignorecolumntrigger: PropTypes.object.isRequired,
    dashboard: PropTypes.object.isRequired,
    audio: PropTypes.object,
    video: PropTypes.object
}

export default Layer;

import React, { useContext, useEffect, useState } from 'react'
import { ResolumeContext } from './resolume_provider'
import ReactDOM from 'react-dom'
import Effect from './effect.js'
import PropTypes from 'prop-types';
import Parameter from './parameter.js'
import Parameters from './parameters.js'

function Properties(props) {
    const context       = useContext(ResolumeContext);
    const [ element ]   = useState(() => document.createElement('div'));

    useEffect(() => {
        props.root.appendChild(element);
        return () => props.root.removeChild(element);
    });

    const handle_reset = (id) => { context.parameters.reset_parameter(id); }

    let dashboard = null;
    if (props.dashboard) {
        dashboard = (
            <div className="dashboard">
                <Parameters
                    key={`dashboard_${props.name}`}
                    name={props.name}
                    params={props.dashboard}
                    labelLast={true}
                />
            </div>                
        );
    }

    let autopilot = null;
    if (props.autopilot) {
        autopilot = (
            <div>
                <span className="label" onDoubleClick={() => handle_reset(props.autopilot.target.id)}>Behaviour</span>
                <Parameter
                    name="Target"
                    key={props.autopilot.target.id}
                    id={props.autopilot.target.id}
                    parameter={props.autopilot.target}
                />
            </div>
        );
    }

    let transition = null;
    if (props.transition) {
        transition = (
            <div>
                <div>
                    <span className="label" onDoubleClick={() => handle_reset(props.transition.duration.id)}>Duration</span>
                    <Parameter
                        name="Duration"
                        key={props.transition.duration.id}
                        id={props.transition.duration.id}
                        parameter={props.transition.duration}
                    />
                </div>
                <div>
                    <span className="label" onDoubleClick={() => handle_reset(props.transition.blend_mode.id)}>Blend Mode</span>
                    <Parameter
                        name="Blend Mode"
                        key={props.transition.blend_mode.id}
                        id={props.transition.blend_mode.id}
                        parameter={props.transition.blend_mode}
                    />
                </div>
            </div>
        );
    }        

    let audio_section = null;
    if (props.audio) {
        const effects = props.audio.effects.map((value) => {
            return (
                <Effect
                    id={value.id}
                    key={`effect_${value.name}`}
                    name={value.name}
                    bypassed={value.bypassed}
                    mixer={value.mixer}                    
                    params={value.params}
                />
            );
        });

        audio_section = (
            <div>
                <div>
                    <div>
                        <span className="label" onDoubleClick={() => handle_reset(props.audio.volume.id)}>Volume</span>
                        <Parameter
                            name="Volume"
                            key={props.audio.volume.id}
                            id={props.audio.volume.id}
                            parameter={props.audio.volume}
                        />
                    </div>
                    <div>
                        <span className="label" onDoubleClick={() => handle_reset(props.audio.pan.id)}>Pan</span>
                        <Parameter
                            name="Audio Pan"
                            key={props.audio.pan.id}
                            id={props.audio.pan.id}
                            parameter={props.audio.pan}
                        />
                    </div>                         
                </div>
                <div className="effects">
                    {effects}
                </div>
            </div>
        );
    }

    let video_section = null;
    if (props.video) {
        const effects = props.video.effects.map((value) => {
            return (
                <Effect
                    id={value.id}
                    key={`effect_${value.name}`}
                    bypassed={value.bypassed}
                    name={value.name}
                    display_name={value.display_name}
                    mixer={value.mixer}
                    params={value.params}
                />
            );
        });

        video_section = (
            <div>
                {props.video.sourceparams &&
                    /* Only available for Clip Video Tracks */
                    <div>
                        <div className="title">{props.name}</div>
                        <div className="content">
                            <Parameters
                                key={`source_${props.name}`}
                                name="Source"
                                params={props.video.sourceparams}
                            />
                        </div>
                    </div>
                }
                <div className="title">Video</div>
                    <div className="content">
                        <div>
                            <span className="label" onDoubleClick={() => handle_reset(props.video.opacity.id)}>Opacity</span>
                            <Parameter
                                name="Opacity"
                                key={props.video.opacity.id}
                                id={props.video.opacity.id}
                                parameter={props.video.opacity}
                            /> 
                        </div>
                        {props.video.mixer &&
                            <Parameters
                                key={`mixer_${props.name}`}
                                name="Mixer"
                                params={props.video.mixer}
                            />    
                        }
                        {props.video.autosize &&
                            /* Only available for Layer Video Tracks */
                            <div>
                                <span className="label" onDoubleClick={() => handle_reset(props.video.autosize.id)}>Auto Size</span>
                                <Parameter
                                    name="Auto Size"
                                    key={props.video.autosize.id}
                                    id={props.video.autosize.id}
                                    parameter={props.video.autosize}
                                />
                            </div>
                        }                      
                        <div className="effects">
                            {effects}
                        </div>
                    </div>
            </div>
        );
    }


    const title = props.title + " (" + props.name + ")";
    const properties = (
        <div className="properties">
            <div className="title">{title}</div>
            <div className="content">
                {dashboard}
            </div>
            {autopilot &&
                <div>
                    <div className="title">Autopilot</div>
                    <div className="content">
                        {autopilot}
                    </div>
                </div>
            }
            {transition &&
                <div>
                    <div className="title">Transition</div>
                    <div className="content">
                        {transition}
                    </div>
                </div>
            }                
            {audio_section &&
                <div>
                    <div className="title">Audio</div>
                    <div className="content">
                        {audio_section}
                    </div>
                </div>
            }
            <div>
                {video_section}
            </div>
        </div>            
    );

    return ReactDOM.createPortal(
        properties,
        element
    );
}

/**
  * Property declaration for Properties component
  */
 Properties.propTypes = {
    dashboard: PropTypes.object.isRequired,
}

export default Properties

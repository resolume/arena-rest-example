import React, { useContext, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { ResolumeContext } from './resolume_provider.js'
import Parameter from './parameter.js'
import PropTypes from 'prop-types';

/**
  * Render a single effect in the
  * effect chain
  */
function Timeline(props) {
    const context = useContext(ResolumeContext);
    const [ expanded, setExpanded ] = useState(true);
    const [ element ] = useState(() => document.createElement('div'));

    const handle_reset  = id => context.action('reset', `/parameter/by-id/${id}`);

    useEffect(() => {
        props.root.appendChild(element);
        return () => props.root.removeChild(element);
    });

    const params = props.transport.controls;

    let controls = (
    
        <div className="timeline con">
            <div className="title" onClick={() => setExpanded(!expanded)}>
                <span className={`arrow ${expanded ? 'down' : 'right'}`}></span>
                Transport
            </div>
            <div className="content">
                <div>
                    <span className="label" onDoubleClick={() => handle_reset(props.transport.position.id)}>Position</span>
                    <Parameter
                        name="Position"
                        parameter={props.transport.position}
                        key={props.transport.position.id}
                        id={props.transport.position.id}
                    />
                </div>
                <div>
                    <span className="label" onDoubleClick={() => handle_reset(params.playdirection.id)}>Direction</span>
                    <Parameter
                        name="Direction"
                        parameter={params.playdirection}
                        key={params.playdirection.id}
                        id={params.playdirection.id}
                    />
                </div>
                <div>
                    <span className="label" onDoubleClick={() => handle_reset(params.playmode.id)}>Play Mode</span>
                    <Parameter
                        name="Play Mode"
                        parameter={params.playmode}
                        key={params.playmode.id}
                        id={params.playmode.id}
                    />
                </div>
                <div>
                    <span className="label" onDoubleClick={() => handle_reset(params.duration.id)}>Duration</span>
                    <Parameter
                        name="Duration"
                        parameter={params.duration}
                        key={params.duration.id}
                        id={params.duration.id}
                    />
                </div>            
                <div>
                    <span className="label" onDoubleClick={() => handle_reset(params.speed.id)}>Speed</span>
                    <Parameter
                        name="Speed"
                        parameter={params.speed}
                        key={params.speed.id}
                        id={params.speed.id}
                    />
                </div>             
                {params.beatloop &&
                <div>
                    <span className="label" onDoubleClick={() => handle_reset(params.beatloop.id)}>Beatloop</span>
                    <Parameter
                        name="Beatloop"
                        parameter={params.beatloop}
                        key={params.beatloop.id}
                        id={params.beatloop.id}
                    />
                </div>            
                }
            </div>
        </div>
    );

    return ReactDOM.createPortal(
        controls,
        element
    );    

}

/**
  * Property declaration for Effect component
  */
Timeline.propTypes = {
    transport: PropTypes.object
}

export default Timeline


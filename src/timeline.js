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

    let behaviour = props.transport.behaviour;

    let controls = (
    
        <div className="timeline">
            <div className="title" onClick={() => setExpanded(!expanded)}>
                <span className={`arrow ${expanded ? 'down' : 'right'}`}></span>
                Transport
            </div>
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
                <span className="label" onDoubleClick={() => handle_reset(behaviour.playdirection.id)}>Direction</span>
                <Parameter
                    name="Direction"
                    parameter={behaviour.playdirection}
                    key={behaviour.playdirection.id}
                    id={behaviour.playdirection.id}
                />
            </div>
            <div>
                <span className="label" onDoubleClick={() => handle_reset(behaviour.playmode.id)}>Play Mode</span>
                <Parameter
                    name="Play Mode"
                    parameter={behaviour.playmode}
                    key={behaviour.playmode.id}
                    id={behaviour.playmode.id}
                />
            </div>            
            <div>
                <span className="label" onDoubleClick={() => handle_reset(behaviour.playmode.id)}>Beatloop</span>
                <Parameter
                    name="Beatloop"
                    parameter={behaviour.beatloop}
                    key={behaviour.beatloop.id}
                    id={behaviour.beatloop.id}
                />
            </div>
            <div>
                <span className="label" onDoubleClick={() => handle_reset(behaviour.speed.id)}>Speed</span>
                <Parameter
                    name="Speed"
                    parameter={behaviour.speed}
                    key={behaviour.speed.id}
                    id={behaviour.speed.id}
                />
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


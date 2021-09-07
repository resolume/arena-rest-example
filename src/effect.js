import { ResolumeContext } from './resolume_provider.js'
import React, { useContext, useState } from 'react'
import ParameterMonitor from './parameter_monitor.js'
import Parameters from './parameters.js'
import PropTypes from 'prop-types';

/**
  * Render a single effect in the
  * effect chain
  */
function Effect(props) {
    const context = useContext(ResolumeContext);
    const [ expanded, setExpanded ] = useState(true);
    const set_bypass                = bypassed  => context.parameters.update_parameter(props.bypassed.id, bypassed);

    return (
        <div className="effect">
            <div className="title" onClick={() => setExpanded(!expanded)}>
                <span className={`arrow ${expanded ? 'down' : 'right'}`}></span>
                {props.name}
            </div>
            {props.bypassed &&
                <ParameterMonitor.Single parameter={props.bypassed} render={bypassed => (
                    <div className={`button ${bypassed.value ? 'on' : 'off'}`} onMouseDown={() => set_bypass(!bypassed.value)}>B</div>
                )} />
            }
            {expanded && props.mixer &&
                /* An Effect does not always have a mixer, Mask and Transform do not for instance */
                <Parameters
                    key={`mixer_${props.name}`}
                    name={props.name}
                    params={props.mixer}
                />
            }
            {expanded &&
                <Parameters
                    key={`params_${props.name}`}
                    name={props.name}
                    params={props.params}
                />
            }
        </div>
    )
}

/**
  * Property declaration for Effect component
  */
Effect.propTypes = {
    mixer: PropTypes.object
}

export default Effect

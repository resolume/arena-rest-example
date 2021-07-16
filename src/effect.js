import React, { useState } from 'react'
import Parameters from './parameters.js'
import PropTypes from 'prop-types';

/**
  * Render a single effect in the
  * effect chain
  */
function Effect(props) {
    const [ expanded, setExpanded ] = useState(true);

    return (
        <div className="effect">
            <div className="title" onClick={() => setExpanded(!expanded)}>
                <span className={`arrow ${expanded ? 'down' : 'right'}`}></span>
                {props.name}
            </div>
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

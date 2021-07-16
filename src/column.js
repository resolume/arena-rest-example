import { ResolumeContext } from './resolume_provider.js'
import React, { useContext } from 'react'
import PropTypes from 'prop-types'

/**
  * Component rendering a column within the composition
  */
function Column(props) {
    const context = useContext(ResolumeContext);

    const connect = down => { context.action('trigger', `/composition/columns/by-id/${props.id}/connect`, down); }

    /* Replace # with ((index+1) of Colunn) */
    const name = props.name.value.replace(/#/g, props.index+1);
    const connected = props.connected.value;

    return (
        <div
            className={`column ${connected ? 'connected' : ''}`}
            onMouseDown={() => connect(true)}
            onMouseUp={() => connect(false)}
        >
            {name}
        </div>
    );
}

/**
  * Property declaration for Column component
  */
Column.propTypes = {
    name: PropTypes.object.isRequired,
    connected: PropTypes.object.isRequired,
}

export default Column;

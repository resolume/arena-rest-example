import React from 'react'
import PropTypes from 'prop-types'

/**
  * Component rendering a column within the composition
  */
function Column(props) {

    /* Replace # with ((index+1) of Layer) */
    const name = props.name.value.replace(/#/g, props.index+1);
    return (
        <div
            className={`column ${props.connected ? 'connected' : ''}`}
            onClick={props.connect}
        >
        {name}
        </div>
    );
}

/**
  * Property declaration for Column component
  */
Column.propTypes = {
    connected: PropTypes.bool.isRequired,
    connect: PropTypes.func.isRequired
}

export default Column;

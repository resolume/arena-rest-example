import React from 'react'
import PropTypes from 'prop-types'

/**
  * Component rendering a deck within the composition
  */
function Deck(props) {
    return (
        <div
            className={`deck ${props.selected ? 'selected' : ''}`}
            onClick={props.select}
        >
        {props.name.value}
        </div>
    );
}

/**
  * Property declaration for Deck component
  */
Deck.propTypes = {
    selected: PropTypes.bool.isRequired,
    select: PropTypes.func.isRequired
}

export default Deck;

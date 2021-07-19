import React, { useContext } from 'react'
import { ResolumeContext } from './resolume_provider.js'
import PropTypes from 'prop-types'

/**
  * Component rendering a deck within the composition
  */
function Deck({ id, name, selected }) {
    const context   = useContext(ResolumeContext);
    const select    = () => context.action('trigger', `/composition/decks/by-id/${id}/select`);

    return (
        <div
            className={`deck ${selected ? 'selected' : ''}`}
            onClick={select}
        >
        {name.value}
        </div>
    );
}

/**
  * Property declaration for Deck component
  */
Deck.propTypes = {
    selected: PropTypes.bool.isRequired,
    name: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired
}

export default Deck;

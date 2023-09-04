import React, { useContext } from 'react'
import { ResolumeContext } from './resolume_provider'
import ParameterMonitor from './parameter_monitor.js'
import ContextMenu from './context_menu.js';
import PropTypes from 'prop-types'

/**
  * Component rendering a deck within the composition
  */
function Deck({ id, name, selected }) {
    const context   = useContext(ResolumeContext);
    const select    = () => context.action('trigger', `/composition/decks/by-id/${id}/select`);

    const menu_options = {
        'New':                      { action: () => context.post('/composition/decks/add')                                      },
        'Insert Before':            { action: () => context.post('/composition/decks/add', `/composition/decks/by-id/${id}`)    },
        'Duplicate':                { action: () => context.post(`/composition/decks/by-id/${id}/duplicate`)                    },
        'Remove':                   { action: () => context.remove(`/composition/decks/by-id/${id}`)                            },
    };

    return (
        <div
            className={`deck ${selected ? 'selected' : ''}`}
            onClick={select}
        >
            <ParameterMonitor.Single parameter={name} render={name => (
                <ContextMenu
                    name={name.value}
                    options={menu_options}
                >
                    <span>{name.value}</span>
                </ContextMenu>
            )} />
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

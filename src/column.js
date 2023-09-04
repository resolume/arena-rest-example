import { ResolumeContext } from './resolume_provider'
import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import ParameterMonitor from './parameter_monitor.js'
import ContextMenu from './context_menu.js';

/**
  * Component rendering a column within the composition
  */
function Column({ id, index, name, connected }) {
    const context = useContext(ResolumeContext);
    const connect = down => context.action('trigger', `/composition/columns/by-id/${id}/connect`, down);

    const menu_options = {
        'Add':                      { action: () => context.post('/composition/columns/add')            },
        'Remove':                   { action: () => context.remove(`/composition/columns/by-id/${id}`)  },
    };

    return (
        <ParameterMonitor.Single parameter={connected} render={connected => (
            <ParameterMonitor.Single parameter={name} render={name => (
                <ContextMenu
                    name={name.value.replace(/#/g, index+1)}
                    options={menu_options}
                >
                    <div
                        className={`column ${connected.value ? 'connected' : ''}`}
                        onMouseDown={() => connect(true)}
                        onMouseUp={() => connect(false)}
                    >
                        {name.value.replace(/#/g, index+1)}
                    </div>
                </ContextMenu>
            )} />
        )} />
    );
}

/**
  * Property declaration for Column component
  */
Column.propTypes = {
    id: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    name: PropTypes.object.isRequired,
    connected: PropTypes.object.isRequired,
}

export default Column;

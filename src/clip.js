import { ResolumeContext } from './resolume_provider.js'
import React, { useContext } from 'react'
import Properties from './properties.js'
import PropTypes from 'prop-types';
import ContextMenu from './context_menu.js';
import Timeline from './timeline.js';

// we need to draw outside of our container, but instead
// draw elsewhere in the html hierarchy
const clip_transport = document.getElementById('clip_transport');
const clip_root = document.getElementById('clip_properties');

/**
  * Component for rendering a clip, responds to clicks
  * to activate the clip. Renders the clip name below.
  */
function Clip(props) {
    const context = useContext(ResolumeContext);

    const menu_options = {
        'Beat Snap':                props.beatsnap,
        'Target':                   props.target,
        'Trigger Style':            props.triggerstyle,
        'Fader Start':              props.faderstart,
        'Ignore Column Trigger':    props.ignorecolumntrigger,
    };

    /**
      * Connected has 5 possible states 
      * "Empty", "Disconnected", "Previewing", "Connected", "Connected & previewing"
      */
    const connected = props.connected.index >= 3;
    const name = props.name.value.length > 12 ? props.name.value.substring(0,11) + "..." : props.name.value;

    const connect   = down  => context.action('trigger', `/composition/clips/by-id/${props.id}/connect`, down);
    const select    = ()    => context.action('trigger', `/composition/clips/by-id/${props.id}/select`);

    return (
        <div>
            <div>
                <ContextMenu
                    name={props.name.value}
                    options={menu_options}
                >
                <div className="clip">
                    <div className={`${connected ? 'connected' : 'none'}`}>
                        <img className="thumbnail"
                            src={context.clip_url(props.id, props.thumbnail.last_update)}
                            onMouseDown={() => connect(true)}
                            onMouseUp={() => connect(false)}
                            alt={props.name.value}
                        />
                    </div>
                    <div className={`clip handle ${props.selected.value ? 'selected' : ''}`} onMouseDown={select}>
                        {name}
                    </div>
                </div>
                </ContextMenu>
            </div>
            {props.selected.value &&
                <React.Fragment>
                    <Timeline
                        transport={props.transport}
                        root={clip_transport}
                    />
                    <Properties
                        name={props.name.value}
                        dashboard={props.dashboard}    
                        audio={props.audio}
                        video={props.video}
                        title="Clip"
                        root={clip_root}
                    />
                </React.Fragment>
        }
        </div>
    )
}

/**
  * Property declaration for Clip component
  */
Clip.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.object.isRequired,
    connected: PropTypes.object.isRequired,
    selected: PropTypes.object.isRequired,
    thumbnail: PropTypes.object.isRequired,
    beatsnap: PropTypes.object.isRequired,
    target: PropTypes.object.isRequired,
    triggerstyle: PropTypes.object.isRequired,
    faderstart: PropTypes.object.isRequired,
    ignorecolumntrigger: PropTypes.object.isRequired,
    dashboard: PropTypes.object.isRequired,
    audio: PropTypes.object,
    video: PropTypes.object,
}

export default Clip;

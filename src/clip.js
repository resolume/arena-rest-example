import { ResolumeContext } from './resolume_provider'
import React, { useContext, useState } from 'react'
import Properties from './properties.js'
import PropTypes from 'prop-types';
import ContextMenu from './context_menu.js';
import Timeline from './timeline.js';
import ParameterMonitor from './parameter_monitor.js';

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

    let menu_options = {
        'Beat Snap':                { param: props.beatsnap             },
        'Transport':                { param: props.transporttype        },
        'Target':                   { param: props.target               },
        'Trigger Style':            { param: props.triggerstyle         },
        'Fader Start':              { param: props.faderstart           },
        'Ignore Column Trigger':    { param: props.ignorecolumntrigger  },
    };    
    /* Add 'Resize' option to menu if clip has video track */
    if (props.video)
        menu_options['Resize'] = { param: props.video.resize };

    /**
     *  We need to track whether the clip is being pressed upon by the mouse
     *  because if we hold the mouse button down and then wiggle the mouse a
     *  bit, the mouseup event does not trigger when the mouse pointer leaves
     *  the image area. For that case we use a mouse leave event, but it should
     *  only be triggered when the mouse was previously holding the button
     */
    const [ mouseDown, setMouseDown ] = useState(false);

    const name = props.name.value.length > 12 ? props.name.value.substring(0,11) + "..." : props.name.value;

    const select = () => context.action('trigger', `/composition/clips/by-id/${props.id}/select`);

    const drop = (event) => {
        event.preventDefault();
        context.post(`/composition/clips/by-id/${props.id}/${event.dataTransfer.getData('path')}`, event.dataTransfer.getData('object'));
    };

    const connect = down => {
        // don't send the release event twice
        // in a row without a connect in between
        if (!mouseDown && !down) {
            return;
        }

        context.action('trigger', `/composition/clips/by-id/${props.id}/connect`, down)
        setMouseDown(down);
    };

    return (
        <div>
            <div>
                <ContextMenu
                    name={props.name.value}
                    options={menu_options}
                >
                <ParameterMonitor.Single parameter={props.connected} render={connected => (
                    <div className="clip" onDragOver={(event) => event.preventDefault()} onDrop={drop}>
                        {/* Connected has 5 possible states: "Empty", "Disconnected", "Previewing", "Connected", "Connected & previewing"*/}
                        <div className={`${connected.index >= 3 ? 'connected' : 'none'}`}>
                            <img className="thumbnail"
                                src={context.clip_url(props.id, props.thumbnail.last_update)}
                                onMouseDown={() => connect(true)}
                                onMouseUp={() => connect(false)}
                                onMouseLeave={() => connect(false)}
                                onDragStart={(event) => event.preventDefault()}
                                alt={props.name.value}
                            />
                        </div>
                        <ParameterMonitor.Single parameter={props.selected} render={selected => (
                            <div className={`clip handle ${selected.value ? 'selected' : ''}`} onMouseDown={select}>
                                {name}
                            </div>
                        )} />
                    </div>
                )} />
                </ContextMenu>
            </div>
            {props.selected.value &&
                <React.Fragment>
                    {props.transport &&
                        <Timeline
                            transport={props.transport}
                            root={clip_transport}
                        />
                    }
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

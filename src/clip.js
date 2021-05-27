import Parameter from './parameter.js'
import Properties from './properties.js'
import React from 'react'
import PropTypes from 'prop-types';
import ContextMenu from './context_menu.js';

// we need to draw outside of our container, but instead
// draw elsewhere in the html hierarchy
const clip_root = document.getElementById('clip_properties');

/**
  * Component for rendering a clip, responds to clicks
  * to activate the clip. Renders the clip name below.
  */
class Clip extends React.Component {

    render() {
        const menu_options = {
            'Beat Snap':                this.props.beatsnap,
            'Target':                   this.props.target,
            'Trigger Style':            this.props.triggerstyle,
            'Fader Start':              this.props.faderstart,
            'Ignore Column Trigger':    this.props.ignorecolumntrigger,
        };

        /**
          * Connected has 5 possible states 
          * "Empty", "Disconnected", "Previewing", "Connected", "Connected & previewing"
          */
        let connected = this.props.connected.index >= 3;
        
        return (
            <div className={`clip ${this.props.selected.value ? 'selected' : ''}`}>
                <img
                    src={this.props.src}
                    onMouseDown={this.props.connect_down}
                    onMouseUp={this.props.connect_up}
                    alt={this.props.name.value}
                />
                <ContextMenu
                    name={this.props.name.value}
                    options={menu_options}
                    parameters={this.props.parameters}
                >
                    <div onClick={this.props.select}>
                        {this.props.name.value}
                    </div>
                </ContextMenu>
                {this.props.selected.value &&
                    <Properties
                        name={this.props.name.value}    
                        audio={this.props.audio}
                        video={this.props.video}
                        parameters={this.props.parameters}
                        title="Clip"
                        root={clip_root}
                    />
                }
            </div>
        )
    }
}

/**
  * Property declaration for Clip component
  */
Clip.propTypes = {
    src: PropTypes.string.isRequired,
    select: PropTypes.func.isRequired,
    name: PropTypes.object.isRequired,
    parameters: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired
}

export default Clip;

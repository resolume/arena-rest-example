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

        return (
            <div className="clip">
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
                        <Parameter
                            parameters={this.props.parameters}
                            readonly={true}
                            initial={this.props.name}
                            key={this.props.name.id}
                            id={this.props.name.id}
                        />
                    </div>
                </ContextMenu>
                {this.props.selected.value &&
                    <Properties
                        name={this.props.name.value}    
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

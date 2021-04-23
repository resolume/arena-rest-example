import Clip from './clip.js'
import React from 'react'
import Parameter from './parameter.js'
import Properties from './properties.js';
import PropTypes from 'prop-types';

// we need to draw outside of our container, but instead
// draw elsewhere in the html hierarchy
const layer_root = document.getElementById('layer_properties');

/**
  * Render a layer, including all its associated clips
  */
class Layer extends React.Component {

    constructor(props) {
        super(props);
        this.state = { selected: props.selected.value };

        // the handler function for updates to the
        // selected property - e.g. when a clip
        // gets triggered by the user or autopilot
        this.on_update = (parameter) => {
            // extract selection value
            const selected = parameter.value;
            // update state
            this.setState({ selected });
        };
    }

    /**
      * Handle the component being mounted into
      * the browsers DOM
      */
    componentDidMount() {
        this.props.parameters.register_monitor(this.props.selected.id, this.on_update, this.props.selected);
    }

    /**
      * Handle the component being unmounted from
      * the browsers DOM
      */
    componentWillUnmount() {
        this.props.parameters.unregister_monitor(this.props.selected.id, this.on_update);
    }

    render() {

        const clips =  this.props.clips.map((clip) => 
            <Clip
                id={clip.id}
                key={clip.id}
                src={this.props.clip_url(clip.id, clip.thumbnail.last_update)}
                name={clip.name}
                video={clip.video}
                connect_down={() => this.props.connect_clip(clip.id, true)}
                connect_up={() =>  this.props.connect_clip(clip.id, false)}
                select={() =>  this.props.select_clip(clip.id)}
                selected={clip.selected}
                parameters={this.props.parameters}
                beatsnap={clip.beatsnap}
                target={clip.target}
                triggerstyle={clip.triggerstyle}
                faderstart={clip.faderstart}
                ignorecolumntrigger={clip.ignorecolumntrigger}
            />
        );

        return (
            <div className={`layer ${this.state.selected ? 'selected' : ''}`}>            
                <div><input type="button" value="Clear" onClick={this.props.clear}/></div>
                <div className="control" onClick={this.props.select}>
                    <Parameter
                        parameters={this.props.parameters}
                        initial={this.props.name}
                        key={this.props.name.id}
                        id={this.props.name.id}
                    />
                </div>                 
                {clips}                
                {this.state.selected &&
                    <Properties
                        video={this.props.video}
                        parameters={this.props.parameters}
                        name="Layer"
                        root={layer_root}
                    />
                }                
            </div>
        );
    }
}

/**
  * Property declaration for Layer component
  */
Layer.propTypes = {
    clips: PropTypes.array.isRequired,
    selected: PropTypes.object.isRequired,
    select: PropTypes.func.isRequired,
    clear: PropTypes.func.isRequired,
    parameters: PropTypes.object.isRequired
}

export default Layer;

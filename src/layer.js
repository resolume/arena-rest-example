import Clip from './clip.js'
import React from 'react'
import Parameter from './parameter.js';
import Properties from './properties.js';
import PropTypes from 'prop-types';

// we need to draw outside of our container, but instead
// draw elsewhere in the html hierarchy
const layer_root = document.getElementById('layer_properties');

/**
  * Render a layer, including all its associated clips
  */
class Layer extends React.Component {

    render() {

        const clips =  this.props.clips.map((clip) => 
            <Clip
                id={clip.id}
                key={clip.id}
                src={this.props.clip_url(clip.id, clip.thumbnail.last_update)}
                name={clip.name}
                connected={clip.connected}
                audio={clip.audio}
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

        /* Replace # with ((index+1) of Layer) */
        const name = this.props.name.value.replace(/#/g, this.props.index+1);

        return (
            <div className={`layer ${this.props.selected.value ? 'selected' : ''}`}>            
                <div onClick={this.props.clear}>Clear
                    <div>Bypassed
                        <Parameter
                            parameters={this.props.parameters}
                            key={this.props.bypassed.id}
                            id={this.props.bypassed.id}
                            initial={this.props.bypassed}
                        />
                    </div>
                </div>                                                 
                <div className="control" onClick={this.props.select}>
                    <div>{name}</div>
                </div>                 
                {this.props.selected.value &&
                    <Properties
                        name={name}    
                        video={this.props.video}                        
                        parameters={this.props.parameters}
                        title="Layer"
                        root={layer_root}
                    />
                }                
                {clips}                
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

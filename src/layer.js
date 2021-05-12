import React from 'react'
import Parameter from './parameter.js';
import Properties from './properties.js';
import PropTypes from 'prop-types';

// we need to draw outside of our container, but instead
// draw elsewhere in the html hierarchy
const layer_root = document.getElementById('layer_properties');

/**
  * Render a layer
  */
class Layer extends React.Component {

    render() {
        
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
                        audio={this.props.audio}
                        video={this.props.video}                        
                        parameters={this.props.parameters}
                        title="Layer"
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
    selected: PropTypes.object.isRequired,
    select: PropTypes.func.isRequired,
    clear: PropTypes.func.isRequired,
    parameters: PropTypes.object.isRequired
}

export default Layer;

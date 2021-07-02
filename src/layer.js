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

        /*
                <div>Bypassed
                    <Parameter
                        parameters={this.props.parameters}
                        key={this.props.bypassed.id}
                        id={this.props.bypassed.id}
                        initial={this.props.bypassed}
                    />
                </div>
            */        

        /* Replace # with ((index+1) of Layer) */
        const name = this.props.name.value.replace(/#/g, this.props.index+1);

        return (
            <div className="layer">       
                <div className="controls">
                    <div className="cbs">
                        <div onClick={this.props.clear}>Clear</div>
                        <div>B</div>
                        <div>S</div>
                    </div>
                    <div className={`handle ${this.props.selected.value ? 'selected' : ''}`} onMouseDown={this.props.select}>
                        {name}
                    </div>              
                </div>
                {this.props.selected.value &&
                    <Properties
                        name={name}    
                        dashboard={this.props.dashboard}
                        autopilot={this.props.autopilot}
                        transition={this.props.transition}
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
    dashboard: PropTypes.object.isRequired,
    parameters: PropTypes.object.isRequired
}

export default Layer;

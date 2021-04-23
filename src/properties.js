import React from 'react'
import ReactDOM from 'react-dom'
import Effect from './effect.js'
import PropTypes from 'prop-types';
import Parameter from './parameter.js'
import Parameters from './parameters.js'

class Properties extends React.Component {
    constructor(props) {
        super(props);
        this.element = document.createElement('div');
    }

    componentDidMount() {
        this.props.root.appendChild(this.element);
    }

    componentWillUnmount() {
        this.props.root.removeChild(this.element);
    }
    handle_reset(id)
    {
        this.props.parameters.reset_parameter(id);
    }
    render() {
        // do we even have a video to render effects for?
        if (!this.props.video) {
            return null;
        }

        const hasSourceParams = this.props.video.sourceparams != null;
        // the elements to show
        const effects = this.props.video.effects.map((value) => {
            return (
                <Effect
                    key={`effect_${value.name}`}
                    name={value.name}
                    mixer={value.mixer}
                    params={value.params}
                    effect={value.effect}
                    parameters={this.props.parameters}
                />
            );
        });
        
        const title = this.props.title + " (" + this.props.name + ")";
        
        const effect_section = (
            <div className="properties">
                <div className="title">{title}</div>
                <div className="content">
                    <div>
                        <span className="label" onDoubleClick={() => this.handle_reset(this.props.video.opacity.id)}>Opacity</span>
                        <Parameter
                            parameters={this.props.parameters}
                            key={this.props.video.opacity.id}
                            id={this.props.video.opacity.id}
                            initial={this.props.video.opacity}
                        /> 
                    </div>
                    {this.props.video.mixer &&
                        <Parameters
                            key={`mixer_${this.props.name}`}
                            name="Mixer"
                            params={this.props.video.mixer}
                            parameters={this.props.parameters}
                        />    
                    }
                    {hasSourceParams &&
                        <Parameters
                            key={`source_${this.props.name}`}
                            name="Source"
                            params={this.props.video.sourceparams}
                            parameters={this.props.parameters}
                        />    
                    }                                                      
                    <div className="effects">
                        {effects}
                    </div>
                </div>
            </div>
        );

        return ReactDOM.createPortal(
            effect_section,
            this.element
        );
    }
}

/**
  * Property declaration for Clip component
  */
 Properties.propTypes = {
    parameters: PropTypes.object.isRequired,
}

export default Properties

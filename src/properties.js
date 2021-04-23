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

        const hasAdditionalParams = this.props.video.additionalparams && Object.keys(this.props.video.additionalparams).length > 0;

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

        const effect_section = (
            <div className="properties">
                <div className="title">{this.props.name}</div>
                <div className="content">
                    <span className="label" onDoubleClick={() => this.handle_reset(this.props.video.opacity.id)}>Opacity</span>
                    <Parameter
                        parameters={this.props.parameters}
                        key={this.props.video.opacity.id}
                        id={this.props.video.opacity.id}
                        initial={this.props.video.opacity}
                    /> 
                    {hasAdditionalParams &&
                        <Parameters
                            key={`source_${this.props.name}`}
                            name="Source"
                            params={this.props.video.additionalparams}
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

import Parameter from './parameter.js'
import Parameters from './parameters.js'
import React from 'react'
import PropTypes from 'prop-types';

/**
  * Component for rendering a CrossFader
  */
 
class CrossFader extends React.Component {

    render() {
        return (
            <div className="crossfader">
                <div className="properties">
                    <div className="title">Crossfader</div>
                    <Parameter
                        parameters={this.props.parameters}
                        name="Phase"
                        initial={this.props.phase}
                        key={this.props.phase.id}
                        id={this.props.phase.id}
                    />
                    <Parameter
                        parameters={this.props.parameters}
                        name="Behaviour"
                        initial={this.props.behaviour}
                        key={this.props.behaviour.id}
                        id={this.props.behaviour.id}
                    />                
                    <Parameter
                        parameters={this.props.parameters}
                        name="Curve"
                        initial={this.props.curve}
                        key={this.props.curve.id}
                        id={this.props.curve.id}
                    />
                    {this.props.video.mixer &&                
                        <Parameters
                            key="mixer_crossfader"
                            name="Mixer"
                            params={this.props.video.mixer}
                            parameters={this.props.parameters}
                        />  
                    }
                </div>
            </div>
        )
    }
}

/**
  * Property declaration for CrossFader component
  */
 CrossFader.propTypes = {
    parameters: PropTypes.object.isRequired,
    phase: PropTypes.object.isRequired,
    behaviour: PropTypes.object.isRequired,
    curve: PropTypes.object.isRequired,
}

export default CrossFader;



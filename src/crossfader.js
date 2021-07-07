import Parameter from './parameter.js'
import Parameters from './parameters.js'
import React from 'react'
import PropTypes from 'prop-types';

/**
  * Component for rendering a CrossFader
  */
 
class CrossFader extends React.Component {


    handle_reset(id) {
        this.props.parameters.reset_parameter(id);
    }

    render() {
        return (
            <div className="crossfader">
                <div className="title">Crossfader</div>
                <div className="content">
                    <div>
                        <span className="label" onDoubleClick={() => this.handle_reset(this.props.phase.id)}>Phase</span>
                        <Parameter
                            parameters={this.props.parameters}
                            name="Phase"
                            initial={this.props.phase}
                            key={this.props.phase.id}
                            id={this.props.phase.id}
                        />
                    </div>
                    <div>
                        <span className="label" onDoubleClick={() => this.handle_reset(this.props.behaviour.id)}>Behaviour</span>
                        <Parameter
                            parameters={this.props.parameters}
                            name="Behaviour"
                            initial={this.props.behaviour}
                            key={this.props.behaviour.id}
                            id={this.props.behaviour.id}
                        />                
                    </div>
                    <div>
                        <span className="label" onDoubleClick={() => this.handle_reset(this.props.curve.id)}>Curve</span>
                        <Parameter
                            parameters={this.props.parameters}
                            name="Curve"
                            initial={this.props.curve}
                            key={this.props.curve.id}
                            id={this.props.curve.id}
                        />
                    </div>
                    {this.props.video.mixer &&                
                        <div>
                            <Parameters
                                key="mixer_crossfader"
                                name="Mixer"
                                params={this.props.video.mixer}
                                parameters={this.props.parameters}
                            />  
                        </div>
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



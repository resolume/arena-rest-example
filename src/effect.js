import React from 'react'
import Parameters from './parameters.js'
import PropTypes from 'prop-types';

/**
  * Render a single effect in the
  * effect chain
  */
class Effect extends React.Component {  

    constructor(props) {
        super(props);
        this.state = {
            expanded: true,
        };
    }

    setExpanded(value)
    {
        this.setState( {expanded: value });
    }

    render() {
        
        /* An Effect does not always have a mixer, Mask and Transform do not for instance */
        /* Merge base params, mixer and effect params */
        const params = Object.entries(this.props.params || {}).concat(Object.entries(this.props.mixer || {}).concat(Object.entries(this.props.effect || {})));
        const show_params = this.state.expanded && params.length > 0;

        return (
            <div className="effect">
                <div className="title">
                    <span
                        onClick={() => this.setExpanded(!this.state.expanded)}
                        className={`arrow ${this.state.expanded ? 'down' : 'right'}`}
                    ></span>
                    {this.props.name}
                </div>
                {show_params &&
                    <Parameters
                        key={`mixer_${this.props.name}`}
                        name={this.props.name}
                        params={params}
                        parameters={this.props.parameters}
                    /> 
                }
            </div>
        )
    }
}

/**
  * Property declaration for Effect component
  */
Effect.propTypes = {
    parameters: PropTypes.object.isRequired
}

export default Effect

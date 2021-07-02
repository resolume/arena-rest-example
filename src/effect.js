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

    setExpanded(value, event)
    {
        event.preventDefault();
        this.setState( {expanded: value });
    }

    render() {
        
        return (
            <div className="effect">
                <div className="title" onClick={(event) => this.setExpanded(!this.state.expanded, event)}>
                    <span className={`arrow ${this.state.expanded ? 'down' : 'right'}`}></span>                    
                    {this.props.name}
                </div>                
                {this.state.expanded && this.props.mixer &&
                    /* An Effect does not always have a mixer, Mask and Transform do not for instance */
                    <Parameters
                        key={`mixer_${this.props.name}`}
                        name={this.props.name}
                        params={this.props.mixer}
                        parameters={this.props.parameters}
                    /> 
                }
                {this.state.expanded &&
                <Parameters
                    key={`params_${this.props.name}`}
                    name={this.props.name}
                    params={this.props.params}
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

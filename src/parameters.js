import React from 'react'
import Parameter from './parameter.js'
import PropTypes from 'prop-types';


/**
  * Render a list of params 
  */
class Parameters extends React.Component {    

    render() {
        
        const parameters = Object.entries(this.props.params).map((value) => {
            const name = value[0];
            const param = value[1];

            // do not render parameters that are supposed to be hidden
            // (should we be doing this in the frontend?)
            if (param.view && param.view.visible === false) {
                return null;
            }

            return (
                <div key={`parameter_wrapper_${param.id}`}>
                    <span className="label" onDoubleClick={() => this.props.parameters.reset_parameter(param.id)}>{name}</span>
                    <Parameter
                        parameters={this.props.parameters}
                        key={param.id}
                        id={param.id}
                        initial={param}
                    />
                </div>
            )
        });

        return (
            <div className="parameters">
                {parameters}
            </div>
        )   
    }
}
/**
  * Property declaration for Parameters component
  */
Parameters.propTypes = {
    parameters: PropTypes.object.isRequired
}

export default Parameters

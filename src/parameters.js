import React, { useContext } from 'react'
import { ResolumeContext } from './resolume_provider.js'
import Parameter from './parameter.js'
import PropTypes from 'prop-types';


/**
  * Render a list of params 
  */
function Parameters(props) {
    const context = useContext(ResolumeContext);

    const parameters = Object.entries(props.params).map((value) => {

        let name = value[0];
        const param = value[1];

        // do not render parameters that are supposed to be hidden
        // (should we be doing this in the frontend?)
        if (param.view && param.view.visible === false)
            return null;

        if (param.view && param.view.alternative_name)
            name = param.view.alternative_name;

        return (
            <div key={`parameter_wrapper_${param.id}`}>
                {!props.labelLast &&                    
                    <span className="label" onDoubleClick={() => context.parameters.reset_parameter(param.id)}>{name}</span>    
                }
                <Parameter
                    name={name}
                    key={param.id}
                    id={param.id}
                    parameter={param}
                />
                {props.labelLast &&                 
                    <span className="label" onDoubleClick={() => context.parameters.reset_parameter(param.id)}>{name}</span>    
                }                    
            </div>
        )
    });

    return (
        <div className="parameters">
            {parameters}
        </div>
    )   
}
/**
  * Property declaration for Parameters component
  */
Parameters.propTypes = {
    params: PropTypes.object.isRequired
}

export default Parameters

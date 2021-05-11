import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDebouncedCallback } from 'use-debounce';

/**
  * Debounce handler for smoothly updating
  * and showing the value for a parameter
  */
class value_debouncer
{
    /**
      * Constructor
      *
      * @param  updater     The function to call to send the updated value to the server
      * @param  displayer   The function to call to update the displayed value
      */
    constructor(updater, displayer) {
        this.displayer = displayer;

        this.debounced_change = useDebouncedCallback((value) => {
            updater(value);
        }, 25, { max_wait: 25 });

        this.debounced_clear = useDebouncedCallback(() => {
            displayer(undefined);
        }, 100);
    }

    /**
      * Update the value
      *
      * @param  value   The new value to store
      */
    set_value(value) {
        this.displayer(value);
        this.debounced_change.callback(value);
        this.debounced_clear.callback(value);
    }
}

/**
  * A parameter showing a simple text field
  */
function ParamString(props) {
    // are we showing a read-only parameter
    if (props.readonly) {
        return (
            <span className="parameter" title={props.parameter.value}>{props.parameter.value}</span>
        )
    } else {
        const [ value, setValue ] = useState();
        const { parameter, on_update } = props;

        const debouncer = new value_debouncer(on_update, setValue);

        return (
            <span className="parameter">
                <input
                    type="text"
                    value={value || parameter.value}
                    onChange={(event) => debouncer.set_value(event.target.value)}
                />
            </span>
        )
    }
}

/**
  * A parameter showing a checkbox for yes/no parameters
  */
function ParamBoolean(props) {
    const { parameter, readonly, on_update } = props;

    return (
        <span className="parameter">
            <input
                type="checkbox"
                checked={parameter.value}
                readOnly={readonly}
                onChange={(event) => on_update(event.target.checked)}
            />
        </span>
    )
}

/**
  * A parameter showing a dropdown with options
  */
function ParamChoice(props) {
    const [ value, setValue ] = useState();
    const { parameter, readonly, on_update } = props;

    const debouncer = new value_debouncer(on_update, setValue);

    const options = parameter.options.map((option, index) => {
        return (
            <option key={`parameter_${parameter.id}_option_${index}`} value={index}>
                {option}
            </option>
        )
    });

    return (
        <select className="choice"
            value={value || parameter.index}
            onChange={(event) => debouncer.set_value(parseInt(event.target.value, 10))}
            readOnly={readonly}
        >
            {options}
        </select>
    )
}

/**
  * A parameter showing a slider for a range of values
  */
function ParamRange(props) {
    const [ value, setValue ] = useState();
    const { parameter, readonly, on_update } = props;

    // retrieve the multiplier and view - if given
    const view          = parameter.view || {};
    const multiplier    = view.multiplier || 1;
    const step          = view.step || (parameter.max - parameter.min) / 100;
    const suffix        = view.suffix || "";
    const debouncer     = new value_debouncer(on_update, setValue);

    let show_number = (number) => {
        if (Number.isInteger(number)) {
            return number;
        } else {
            return number.toFixed(2);
        }
    }

    return (
        <span className="parameter">
            <input
                type="range"
                className="slider"
                min={parameter.min * multiplier}
                max={parameter.max * multiplier}
                step={step}
                value={(value || parameter.value) * multiplier}
                readOnly={readonly}
                onChange={(event) => debouncer.set_value(parseFloat(event.target.value) / multiplier)}
            />
            <span>{show_number(value || parameter.value) * multiplier} {suffix}</span>
        </span>
    )
}

/**
  * A parameter showing a color input color parameters
  */
 function ParamColor(props) {

    const [ value, setValue ] = useState();
    const { parameter, readonly, on_update } = props;
    const debouncer = new value_debouncer(on_update, setValue);
    
    /**  
      * Right now we ignore the alpha component of the color value we receive
      * Resolume sends hex values with four components, r,g,b,a
      * There is no HTML native way of representing a color with an alpha component
    */
    // only copy first three components
    const v = String(value || parameter.value).substring(0, 7);

    console.log(v);
    return (
        <span className="parameter">
            <input
                type="color"
                value={v}
                readOnly={readonly}
                onChange={(event) => debouncer.set_value(event.target.value)}
            />
        </span>
    )    
}


/**
  * Class for rendering a parameter
  */
class Parameter extends React.Component {
    constructor(props) {
        super(props);

        this.state = { parameter: props.initial };

        this.on_update = (update) => {
            let parameter = Object.assign({}, this.state.parameter, update);
            this.setState({ parameter });
        };
    }

    /**
      * Register the parameter when the component
      * is added to the DOM
      */
    componentDidMount() {
        this.props.parameters.register_monitor(this.props.id, this.on_update, this.props.initial);
    }

    /**
      * Unregister the parameter when the component
      * is about to be removed from the DOM
      */
    componentWillUnmount() {
        this.props.parameters.unregister_monitor(this.props.id, this.on_update);
    }

    /**
      * Handle an update to the parameter value
      *
      * @param  value   The new value for the parameter
      */
    handle_update(value) {
        this.props.parameters.update_parameter(this.props.id, value);
    }

    /**
      * Render the component
      */
    render() {
        const param = this.state.parameter;

        if (!param) {
            return (
                <span>Loading</span>
            )
        } else if (param.valuetype === "ParamBoolean") {
            return (
                <ParamBoolean
                    parameter={param}
                    readonly={this.props.readonly}
                    on_update={(value) => this.handle_update(value)}
                />
            )
        } else if (param.valuetype === "ParamRange") {
            return (
                <ParamRange
                    parameter={param}
                    readonly={this.props.readonly}
                    on_update={(value) => this.handle_update(value)}
                />
            )
        } else if (param.valuetype === "ParamChoice") {
            return (
                <ParamChoice
                    parameter={param}
                    readonly={this.props.readonly}
                    on_update={(value) => this.handle_update(value)}
                />
            )   
        } else if (param.valuetype === "ParamColor") {
            return (
                <ParamColor
                    parameter={param}
                    readonly={this.props.readonly}
                    on_update={(value) => this.handle_update(value)}
                />
            )                         
        } else {
            return (
                <ParamString
                    parameter={this.state.parameter}
                    readonly={this.props.readonly}
                    on_update={(value) => this.handle_update(value)}
                />
            )
        }
    }
}

/**
  * Property declaration for Parameter component
  */
Parameter.propTypes = {
    id: PropTypes.number.isRequired,
    parameters: PropTypes.object.isRequired,
    initial: PropTypes.object
};

export default Parameter;

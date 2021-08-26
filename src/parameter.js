import React, { useContext, useState } from 'react';
import { ResolumeContext } from './resolume_provider.js'
import ParameterMonitor from './parameter_monitor.js'
import PropTypes from 'prop-types';
import Rotary from './rotary.js';
import { useDebouncedCallback } from 'use-debounce';
import './parameter.css';

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
        }, 10, { max_wait: 25 });

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
 *  A parameter showing a button that triggers events
 */
function ParamEvent(props) {
    const { parameter, on_update } = props;

    const view  = parameter.view        || {};
    const name  = view.alternative_name || props.name;

    return (
        <button onMouseDown={() => on_update(true)} onMouseUp={() => on_update(false)}>
            {name}
        </button>
    )
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
            <option key={`parameter_${parameter.id}_option_${index}`} value={option}>
                {option}
            </option>
        )
    });

    return (
        <select className="choice"
            value={value || parameter.value}
            onChange={(event) => debouncer.set_value(event.target.value)}
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
    const { parameter, readonly, on_update, hidelabel } = props;

    // retrieve the multiplier and view - if given
    const view          = parameter.view || {};
    const multiplier    = view.multiplier || 1;
    const step          = view.step || (parameter.max - parameter.min) / 100;
    const suffix        = view.suffix || "";
    const debouncer     = new value_debouncer(on_update, setValue);
    const showlabel     = hidelabel === "no";

    let show_number = (number) => {
        if (Number.isInteger(number)) {
            return number;
        } else {
            return number.toFixed(2);
        }
    }

    if (view.control_type === 'rotary') {
        return (
            <Rotary
                size={30}
                min={parameter.min * multiplier}
                max={parameter.max * multiplier}
                step={step}
                value={(value || parameter.value) * multiplier}
                readOnly={readonly}
                onChange={(value) => debouncer.set_value(value / multiplier)}
            />
        )
    }

    const view_type = props.view_type || "range";

    return (
        <span className="parameter">
            <input
                type={view_type}
                min={parameter.min * multiplier}
                max={parameter.max * multiplier}
                step={step}
                value={(value || parameter.value) * multiplier}
                readOnly={readonly}
                onChange={(event) => debouncer.set_value(parseFloat(event.target.value) / multiplier)}
            />
            {showlabel &&
                <span>{show_number(value || parameter.value) * multiplier} {suffix}</span>
            }
        </span>
    )
}


function PaletteEntry(props) {
    const { color, onPick } = props;

    const v = String(color).substring(0, 7);
    const s = {
        backgroundColor: `${v}`,
        display: "inline-block",
        width: "15px",
        height: "15px",
        marginRight: "2px"
    }

    return (
        <span style={s} onMouseDown={onPick}/>
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

    /**
      * Create PaletteEntry for each color in the palette
    */
    const palette = parameter.palette.map((color, index) =>  
        <PaletteEntry
            key={index}
            parameter={parameter}
            color={color}
            onPick={() => debouncer.set_value(color)}
        />
    );

    return (
        <span className="parameter">
            <input
                type="color"
                value={v}
                readOnly={readonly}
                onChange={(event) => debouncer.set_value(event.target.value)}
            />
            <span>
                {palette}
            </span>
        </span>
    )
}

/**
  * Class for rendering a parameter
  */
function Parameter(props) {
    const context       = useContext(ResolumeContext);
    const handle_update = value => context.parameters.update_parameter(props.parameter.id, value);

    return (
        <ParameterMonitor.Single parameter={props.parameter} render={param => {
            const hidelabel = props.hidelabel || "no";

            if (!param) {
                return (
                    <span>Loading</span>
                )
            } else if (props.modifier && props.label) {
                const handle_click = () => {
                    const updated = props.modifier(param.value);
                    handle_update(updated);
                };

                return (
                    <span>
                        <button onClick={handle_click}>
                            {props.label}
                        </button>
                    </span>
                )
            } else if (param.valuetype === "ParamEvent") {
                return (
                    <ParamEvent
                        parameter={param}
                        name={props.name}
                        readonly={props.readonly}
                        on_update={(value) => handle_update(value)}
                    />
                )
            } else if (param.valuetype === "ParamBoolean") {
                return (
                    <ParamBoolean
                        parameter={param}
                        name={props.name}
                        readonly={props.readonly}
                        on_update={(value) => handle_update(value)}
                    />
                )
            } else if (param.valuetype === "ParamRange") {
                return (
                    <ParamRange
                        parameter={param}
                        name={props.name}
                        readonly={props.readonly}
                        on_update={(value) => handle_update(value)}
                        view_type={props.view_type}
                        hidelabel={hidelabel}
                    />
                )
            } else if (param.valuetype === "ParamChoice") {
                return (
                    <ParamChoice
                        parameter={param}
                        name={props.name}
                        readonly={props.readonly}
                        on_update={(value) => handle_update(value)}
                    />
                )
            } else if (param.valuetype === "ParamColor") {
                return (
                    <ParamColor
                        parameter={param}
                        name={props.name}
                        readonly={props.readonly}
                        on_update={(value) => handle_update(value)}
                    />
                )
            } else {
                return (
                    <ParamString
                        parameter={param}
                        name={props.name}
                        readonly={props.readonly}
                        on_update={(value) => handle_update(value)}
                    />
                )
            }
        }} />
    )
}

/**
  * Property declaration for Parameter component
  */
Parameter.propTypes = {
    name: PropTypes.string.isRequired,
    parameter: PropTypes.object
};

export default Parameter;

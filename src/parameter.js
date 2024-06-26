import React, { useContext, useRef, useState } from 'react';
import { ResolumeContext } from './resolume_provider'
import ParameterMonitor from './parameter_monitor.js'
import PropTypes from 'prop-types';
import Rotary from './rotary.js';
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
        this.updater = updater;
        this.displayer = displayer;

        this.update_timer = undefined;
        this.clear_timer = undefined;
        this.value = undefined;
    }

    /**
      * Update the value
      *
      * @param  value   The new value to store
      */
    set_value(value) {
        this.value = value;
        this.displayer(value);

        if (this.update_timer === undefined) {
            this.update_timer = window.setTimeout(() => {
                this.updater(this.value);
                this.update_timer = undefined;
            }, 25);
        }

        if (this.clear_timer !== undefined) {
            window.clearTimeout(this.clear_timer);
        }

        this.clear_timer = window.setTimeout(() => { this.displayer(undefined); }, 100);
    }
}

/**
 *  Intercept and monitor changes to submit when
 *  editing is complete
 */
class value_monitor
{
    /**
     *  Constructor
     *
     *  @param  updater     The function to call to send the updated value to the server
     *  @param  displayer   The function to call to update the displayed value
     *  @param  parser      The function to parse the value before sending
     */
    constructor(updater, displayer, parser) {
        this.updater    = updater;
        this.displayer  = displayer;
        this.parser     = parser;
        this.value      = undefined;
    }

    /**
     *  Update the shown value
     *
     *  @param  value   The new value to show
     */
    set_value(value) {
        this.displayer(value);
        this.value = value;
    }

    /**
     *  Confirm the change
     */
    confirm() {
        // if no value was saved, we need not
        // store any values
        if (!this.value) {
            return;
        }

        if (this.parser) {
            this.updater(this.parser(this.value));
        } else {
            this.updater(this.value);
        }

        this.value = undefined;

        setTimeout(() => {
            this.displayer(undefined);
        }, 25);
    }

    /**
     *  Abort changes
     */
    abort() {
        this.updater(undefined);
        this.value = undefined;
    }
};

/**
  * A parameter showing a simple text field
  */
function ParamString(props) {
    const [ value, setValue ] = useState();
    const { parameter, on_update } = props;

    const debouncer = useRef(new value_debouncer(on_update, setValue));

    // are we showing a read-only parameter
    if (props.readonly) {
        return (
            <span className="parameter" title={props.parameter.value}>{props.parameter.value}</span>
        )
    } else {
        return (
            <span className="parameter">
                <input
                    type="text"
                    value={value || parameter.value}
                    onChange={(event) => debouncer.current.set_value(event.target.value)}
                />
            </span>
        )
    }
}

/**
  * A parameter showing a multiline text field
  */
function ParamText(props) {
    const [ value, setValue ] = useState();
    const { parameter, on_update } = props;

    const debouncer = useRef(new value_debouncer(on_update, setValue));

    return (
        <span className="parameter">
            <textarea
                onChange={(event) => debouncer.current.set_value(event.target.value)}
                spellcheck="false"
            >
                {value || parameter.value}
            </textarea>
        </span>
    )
}

/**
 *  A parameter showing a button that triggers events
 */
function ParamEvent(props) {
    const { parameter, on_update } = props;

    const view  = parameter.view        || props.view || {};
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

    const debouncer = useRef(new value_debouncer(on_update, setValue));

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
            onChange={(event) => debouncer.current.set_value(parseInt(event.target.value, 10))}
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
    const view          = parameter.view || props.view || {};
    const multiplier    = view.multiplier || 1;
    const step          = view.step || (parameter.max - parameter.min) / 100;
    const suffix        = view.suffix || "";
    const debouncer     = useRef(new value_debouncer(on_update, setValue));
    const showlabel     = hidelabel === "no";

    const parser        = (value) => parseFloat(value) / multiplier;
    const monitor       = useRef(new value_monitor(on_update, setValue, parser));

    let clamp = (number) => {
        const min = parameter.in;
        const max = parameter.out;

        if (min && number < min)
            return min;

        if (max && number > max)
            return max;

        return number;
    }

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
                onChange={(value) => debouncer.current.set_value(clamp(value / multiplier))}
            />
        )
    } else if (view.control_type === 'spinner') {
        const handler = (event) => {
            switch (event.charCode) {
                case 13:
                    monitor.current.confirm();
                    event.target.blur();
                    break;
                case 27:
                    monitor.current.abort();
                    event.target.blur();
                    break;
                default:
                    break;
            }
        };

        return (
            <span className="parameter spinner">
                <input
                    type="text"
                    value={((value !== undefined) ? value : parameter.value) * multiplier}
                    onChange={(event) => monitor.current.set_value(clamp(event.target.value))}
                    onKeyPress={handler}
                    onBlur={() => monitor.current.confirm()}
                />

                <Parameter
                    name={props.name}
                    parameter={parameter}
                    label="-"
                    modifier={value => value - step}
                />

                <Parameter
                    name={props.name}
                    parameter={parameter}
                    label="+"
                    modifier={value => value + step}
                />
            </span>
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
                onChange={(event) => debouncer.current.set_value(clamp(parseFloat(event.target.value) / multiplier))}
            />
            {showlabel &&
                <span>{show_number((value || parameter.value) * multiplier)} {suffix}</span>
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
    const debouncer = useRef(new value_debouncer(on_update, setValue));

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
            onPick={() => debouncer.current.set_value(color)}
        />
    );

    return (
        <span className="parameter">
            <input
                type="color"
                value={v}
                readOnly={readonly}
                onChange={(event) => debouncer.current.set_value(event.target.value)}
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
                        view={props.view}
                        name={props.name}
                        readonly={props.readonly}
                        on_update={(value) => handle_update(value)}
                    />
                )
            } else if (param.valuetype === "ParamBoolean") {
                return (
                    <ParamBoolean
                        parameter={param}
                        view={props.view}
                        name={props.name}
                        readonly={props.readonly}
                        on_update={(value) => handle_update(value)}
                    />
                )
            } else if (param.valuetype === "ParamRange") {
                return (
                    <ParamRange
                        parameter={param}
                        view={props.view}
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
                        view={props.view}
                        name={props.name}
                        readonly={props.readonly}
                        on_update={(value) => handle_update(value)}
                    />
                )
            } else if (param.valuetype === "ParamColor") {
                return (
                    <ParamColor
                        parameter={param}
                        view={props.view}
                        name={props.name}
                        readonly={props.readonly}
                        on_update={(value) => handle_update(value)}
                    />
                )
            } else if (param.valuetype === "ParamText") {
                return (
                    <ParamText
                        parameter={param}
                        view={props.view}
                        name={props.name}
                        readonly={props.readonly}
                        on_update={(value) => handle_update(value)}
                    />
                )
            } else {
                return (
                    <ParamString
                        parameter={param}
                        view={props.view}
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

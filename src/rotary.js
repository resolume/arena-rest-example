import React, { useState } from 'react'
import './rotary.css';


function Rotary(props) {
    const [ className, setClassName ] = useState('');

    const handle_drag = event => {
        event.preventDefault();

        // ignore events when we are in read only mode
        if (props.readOnly) {
            return;
        }

        // we are now active, add class to css to mark it so
        setClassName('active');

        // get Y position at start of dragging
        const start = event.clientY;

        // the original value we started at
        const value = props.value;

        // the function to handle moves
        const move_handler = event => {
            // every 10 pixels is a single step
            const difference = start - event.clientY;
            const new_value = Math.max(props.min, Math.min(value + difference * props.step, props.max));

            if (props.onChange) {
                props.onChange(new_value);
            }
        }

        document.addEventListener('mousemove', move_handler);
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', move_handler);
            setClassName('');
        });
    };

    // the height is 8/11th of the width
    const width = props.size;
    const height = width * 8 / 11;

    // the width of the dial is 2/11th of the width
    // while it uses a border of 1/11th of the width
    const dial_width = width * 2 / 11;
    const dial_border = width / 11;
    const dial_bottom = width * 4 / 11;

    // calculate the fraction that is filled in the control
    const filled =
        (props.value - props.min) /
        (props.max - props.min);

    const rotary_style = {
        width: width,
        height: height,
    };

    // our arc spans 216 degrees, so we can rotate the dial from -108deg
    // (for the min value) to 108deg (for the max value)
    const degrees = (filled - 0.5) * 216;

    const dial_style = {
        width: dial_width,
        borderBottomWidth: dial_border,
        borderRadius: dial_border,
        marginLeft: -dial_border,
        transform: `rotate(${degrees}deg)`,
        transformOrigin: `${dial_border}px ${dial_bottom}px`,
    };

    const dial_radial = {
        borderLeftWidth: dial_border,
        borderRightWidth: dial_border,
        borderBottomWidth: dial_bottom,
    };

    const circle_center = props.size / 2;
    const circle_radius = props.size * 5 / 12;
    const stroke_width = props.size / 8;

    const empty_style = {
        strokeDasharray: `${circle_radius * 4} ${circle_radius * 10}`,
        strokeWidth: stroke_width,
    };

    const full_style = {
        strokeDasharray: `${circle_radius * 4 * filled} ${circle_radius * 10}`,
        strokeWidth: stroke_width,
    };

    return (
        <div className={`rotary ${className}`} style={rotary_style} onMouseDown={handle_drag}>
            <div className="dial" style={dial_style}>
                <div style={dial_radial}></div>
            </div>

            <svg height={props.size} width={props.size}>
                <circle className="empty" cx={circle_center} cy={circle_center} r={circle_radius} style={empty_style} />
                <circle className="full" cx={circle_center} cy={circle_center} r={circle_radius} style={full_style} />
            </svg>

        </div>
    );
}

Rotary.defaultProps = {
    size: 150,
    min: 0,
    max: 100,
    step: 1,
    value: 0,
    readOnly: false
};

export default Rotary;

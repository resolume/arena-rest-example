import React from 'react';
import Parameter from './parameter.js';
import "./tempo_toolbar.css"

function TempoToolbar(props) {
    return (
        <div class="tempo_toolbar">
            <span>
                BPM
                <Parameter
                    view_type="number"
                    parameters={props.parameters}
                    name="BPM"
                    initial={props.tempocontroller.tempo}
                    hidelabel="yes"
                    id={props.tempocontroller.tempo.id}
                />
            </span>

            <span>
                <Parameter
                    parameters={props.parameters}
                    name="BPM"
                    initial={props.tempocontroller.tempo}
                    id={props.tempocontroller.tempo.id}
                    label="-"
                    modifier={value => value - 1}
                />
            </span>

            <span>
                <Parameter
                    parameters={props.parameters}
                    name="BPM"
                    initial={props.tempocontroller.tempo}
                    id={props.tempocontroller.tempo.id}
                    label="+"
                    modifier={value => value + 1}
                />
            </span>

            <span>
                <Parameter
                    parameters={props.parameters}
                    name="↤"
                    initial={props.tempocontroller.tempo_pull}
                    id={props.tempocontroller.tempo_pull.id}
                />
            </span>

            <span>
                <Parameter
                    parameters={props.parameters}
                    name="↦"
                    initial={props.tempocontroller.tempo_push}
                    id={props.tempocontroller.tempo_push.id}
                />
            </span>

            <span>
                <Parameter
                    parameters={props.parameters}
                    name="BPM"
                    initial={props.tempocontroller.tempo}
                    id={props.tempocontroller.tempo.id}
                    label="/2"
                    modifier={value => value / 2}
                />
            </span>

            <span>
                <Parameter
                    parameters={props.parameters}
                    name="BPM"
                    initial={props.tempocontroller.tempo}
                    id={props.tempocontroller.tempo.id}
                    label="x2"
                    modifier={value => value * 2}
                />
            </span>

            <span>
                <Parameter
                    parameters={props.parameters}
                    name="TAP"
                    initial={props.tempocontroller.tempo_tap}
                    id={props.tempocontroller.tempo_tap.id}
                />
            </span>

            <span>
                <Parameter
                    parameters={props.parameters}
                    name="RESYNC"
                    initial={props.tempocontroller.resync}
                    id={props.tempocontroller.resync.id}
                />
            </span>
        </div>
    );
}

export default TempoToolbar;

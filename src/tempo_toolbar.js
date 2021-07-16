import React from 'react';
import Parameter from './parameter.js';
import "./tempo_toolbar.css"

function TempoToolbar({ tempocontroller }) {
    return (
        <div className="tempo_toolbar">
            <span>
                BPM
                <Parameter
                    view_type="number"
                    name="BPM"
                    parameter={tempocontroller.tempo}
                    hidelabel="yes"
                />
            </span>

            <span>
                <Parameter
                    name="BPM"
                    parameter={tempocontroller.tempo}
                    label="-"
                    modifier={value => value - 1}
                />
            </span>

            <span>
                <Parameter
                    name="BPM"
                    parameter={tempocontroller.tempo}
                    label="+"
                    modifier={value => value + 1}
                />
            </span>

            <span>
                <Parameter
                    name="↤"
                    parameter={tempocontroller.tempo_pull}
                />
            </span>

            <span>
                <Parameter
                    name="↦"
                    parameter={tempocontroller.tempo_push}
                />
            </span>

            <span>
                <Parameter
                    name="BPM"
                    parameter={tempocontroller.tempo}
                    label="/2"
                    modifier={value => value / 2}
                />
            </span>

            <span>
                <Parameter
                    name="BPM"
                    parameter={tempocontroller.tempo}
                    label="x2"
                    modifier={value => value * 2}
                />
            </span>

            <span>
                <Parameter
                    name="TAP"
                    parameter={tempocontroller.tempo_tap}
                />
            </span>

            <span>
                <Parameter
                    name="RESYNC"
                    parameter={tempocontroller.resync}
                />
            </span>
        </div>
    );
}

export default TempoToolbar;

import { ResolumeContext } from './resolume_provider'
import Parameter from './parameter.js'
import Parameters from './parameters.js'
import React, { useContext } from 'react'
import PropTypes from 'prop-types';

/**
  * Component for rendering a CrossFader
  */
function CrossFader({ phase, behaviour, curve, mixer }) {
    const context       = useContext(ResolumeContext);
    const handle_reset  = id => context.action('reset', `/parameter/by-id/${id}`);

    return (
        <div className="crossfader">
            <div className="title">Crossfader</div>
            <div className="content">
                <div>
                    <span className="label" onDoubleClick={() => handle_reset(phase.id)}>Phase</span>
                    <Parameter
                        name="Phase"
                        parameter={phase}
                        key={phase.id}
                        id={phase.id}
                    />
                </div>
                <div>
                    <span className="label" onDoubleClick={() => handle_reset(behaviour.id)}>Behaviour</span>
                    <Parameter
                        name="Behaviour"
                        parameter={behaviour}
                        key={behaviour.id}
                        id={behaviour.id}
                    />
                </div>
                <div>
                    <span className="label" onDoubleClick={() => handle_reset(curve.id)}>Curve</span>
                    <Parameter
                        name="Curve"
                        parameter={curve}
                        key={curve.id}
                        id={curve.id}
                    />
                </div>
                {mixer &&
                    <div>
                        <Parameters
                            key="mixer_crossfader"
                            name="Mixer"
                            params={mixer}
                        />
                    </div>
                }
            </div>
        </div>
    )
}

/**
  * Property declaration for CrossFader component
  */
 CrossFader.propTypes = {
    phase: PropTypes.object.isRequired,
    behaviour: PropTypes.object.isRequired,
    curve: PropTypes.object.isRequired
}

export default CrossFader;



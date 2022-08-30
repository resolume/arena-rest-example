import { useResolumeContext } from './resolume_provider'
import React from 'react'
import IEffects from './IEffects'
import './effects.css'


const Effects = () => {
    const context = useResolumeContext();

    const effects = Object
        .entries(context.effects as IEffects)
        .filter(([group]) => group.length > 0)
        .map(([group, sources]) => {
            const entries = sources.map(effect => {
                const presets = effect.presets.map(preset =>
                    <div
                        className="preset"
                        draggable
                        key={effect.idstring + '_' + preset}
                        onDragStart={(event) => {
                            event.dataTransfer.setData('path', `effects/${group}`);
                            event.dataTransfer.setData('object', `effect:///${group}/${effect.name}/${preset}`);
                        }}
                    >
                        {preset}
                    </div>
                )

                return (
                    <React.Fragment key={effect.idstring}>
                        <div
                            className="effect"
                            draggable
                            onDragStart={(event) => {
                                event.dataTransfer.setData('path', `effects/${group}`);
                                event.dataTransfer.setData('object', `effect:///${group}/${effect.name}`);
                            }}
                        >
                            {effect.name}
                            {presets}
                        </div>
                    </React.Fragment>
                );
            });

            return (
                <div className="group" key={"effect_group_" + group}>
                    {group}
                    <div className="effects">
                        {entries}
                    </div>
                </div>
            )
        });

    return (
        <div className="effects">
            {effects}
        </div>
    )
};

export default Effects;

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
                        key={preset.id}
                        onDragStart={(event) => {
                            event.dataTransfer.setData('path', `effects/${group}/add`);
                            event.dataTransfer.setData('object', `effect:///${group}/${encodeURIComponent(effect.name)}/${encodeURIComponent(preset.name)}`);
                        }}
                    >
                        {preset.name}
                    </div>
                )

                return (
                    <React.Fragment key={effect.idstring}>
                        <div
                            className="effect"
                            draggable
                            onDragStart={(event) => {
                                event.dataTransfer.setData('path', `effects/${group}/add`);
                                event.dataTransfer.setData('object', `effect:///${group}/${encodeURIComponent(effect.name)}`);
                            }}
                        >
                            {effect.name}
                        </div>
                        {presets}
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

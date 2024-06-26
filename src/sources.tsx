import { useResolumeContext } from './resolume_provider'
import React from 'react'
import ISources from './ISources'
import './sources.css'


const Sources = () => {
    const context = useResolumeContext();

    const sources = Object
        .entries(context.sources as ISources)
        .filter(([group]) => group.length > 0)
        .map(([group, sources]) => {
            const entries = sources.map(source => {
                const presets = source.presets.map(preset =>
                    <div
                        className="preset"
                        draggable
                        key={preset.id}
                        onDragStart={(event) =>  {
                            event.dataTransfer.setData('path', 'open');
                            event.dataTransfer.setData('object', `source:///${group}/${encodeURIComponent(source.name)}/${encodeURIComponent(preset.name)}`)
                        }}
                    >
                        {preset.name}
                    </div>
                )

                return (
                    <React.Fragment key={source.idstring}>
                        <div
                            className="source"
                            draggable
                            onDragStart={(event) => {
                                event.dataTransfer.setData('path', 'open');
                                event.dataTransfer.setData('object', `source:///${group}/${encodeURIComponent(source.name)}`)
                            }}
                        >
                            {source.name}
                        </div>
                        {presets}
                    </React.Fragment>
                );
            });

            return (
                <div className="group" key={"source_group_" + group}>
                    {group}
                    <div className="sources">
                        {entries}
                    </div>
                </div>
            )
        });

    return (
        <div className="sources">
            {sources}
        </div>
    )
};

export default Sources;

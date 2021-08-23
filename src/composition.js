import { ResolumeContext } from './resolume_provider.js'
import CrossFader from './crossfader.js'
import TempoToolbar from './tempo_toolbar.js'
import Column from './column.js'
import Deck from './deck.js'
import Layer from './layer.js'
import Clip from './clip.js'
import Properties from './properties.js'
import React, { useContext } from 'react'

// composition effect controls are rendered elseewhere
const composition_root = document.getElementById('composition_properties');

/**
  * Component rendering the entire composition
  */
function Composition() {
    const context = useContext(ResolumeContext);

    const columns = context.composition.columns.map((column, index) =>
        <Column
            id={column.id}
            key={column.id}
            index={index}
            name={column.name}
            connected={column.connected}
        />
    );

    const all_clips = Array.prototype.concat.apply([],
        context.composition.layers.map(layer => layer.clips).reverse()
    );

    const clips = all_clips.map((clip) =>
        <Clip
            id={clip.id}
            key={clip.id}
            thumbnail={clip.thumbnail}
            name={clip.name}
            selected={clip.selected}
            connected={clip.connected}
            dashboard={clip.dashboard}
            audio={clip.audio}
            video={clip.video}
            beatsnap={clip.beatsnap}
            target={clip.target}
            triggerstyle={clip.triggerstyle}
            faderstart={clip.faderstart}
            ignorecolumntrigger={clip.ignorecolumntrigger}
        />
    );

    const layers = context.composition.layers.map((layer, index) =>
        <Layer
            id={layer.id}
            key={layer.id}
            index={index}
            name={layer.name}
            bypassed={layer.bypassed}
            solo={layer.solo}
            crossfadergroup={layer.crossfadergroup}
            master={layer.master}
            dashboard={layer.dashboard}
            autopilot={layer.autopilot}
            transition={layer.transition}
            audio={layer.audio}
            video={layer.video}
            selected={layer.selected}
        />
    ).reverse();

    const decks = context.composition.decks.map((deck) =>
        <Deck
            id={deck.id}
            key={deck.id}
            name={deck.name}
            selected={deck.selected.value}
        />
    );

    //min is 100 + 5 margin
    const s = {
        gridTemplateColumns: `repeat( ${columns.length}, minmax(105px, 1fr)`
    }

    let crossfader = null;
    if (context.composition.crossfader.id) {
        crossfader = (
            <CrossFader
                key={context.composition.crossfader.id}
                phase={context.composition.crossfader.phase}
                behaviour={context.composition.crossfader.behaviour}
                curve={context.composition.crossfader.curve}
                mixer={context.composition.crossfader.mixer}
            />
        );
    };

    let tempocontroller = null;
    if (context.composition.tempocontroller.tempo) {
        tempocontroller = (
            <TempoToolbar
                tempocontroller={context.composition.tempocontroller}
            />
        );
    }

    return (
        <React.Fragment>
            <div className="composition">
                <div className="layers_and_clips">
                    <div className="layers">
                        {layers}
                    </div>
                    <div className="clips" style={s}>
                        {columns}
                        {clips}
                    </div>
                </div>
                <div className="decks">
                    {decks}
                </div>
                {crossfader}
                {tempocontroller}
            </div>
            <Properties
                name="Composition"
                dashboard={context.composition.dashboard}
                audio={context.composition.audio}
                video={context.composition.video}
                title="Composition"
                root={composition_root}
            />
        </React.Fragment>
    );
}

export default Composition;

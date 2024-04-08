import { ResolumeContext } from './resolume_provider'
import ParameterMonitor from './parameter_monitor.js'
import CrossFader from './crossfader.js'
import TempoToolbar from './tempo_toolbar.js'
import Column from './column.js'
import Deck from './deck.js'
import Layer from './layer.js'
import Clip from './clip.js'
import Browser from './browser'
import LayerGroup from './layer_group.js'
import Properties from './properties.js'
import React, { useContext } from 'react'

// composition effect controls and browser are rendered elseewhere
const composition_root = document.getElementById('composition_properties');
const browser_root = document.getElementById('browser');

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

    const { clips, layers_and_groups } = (() => {
        // first get an iterator on both the layers and groups
        const layer_iter = context.composition.layers[Symbol.iterator]();
        const group_iter = context.composition.layergroups[Symbol.iterator]();

        // load the first value from both
        let layer = layer_iter.next().value;
        let group = group_iter.next().value;

        // this will hold all the resulting clips layers
        const clip_rows = [];
        const layers_and_groups = [];

        // we need to keep track of layer and group indices (necessary
        // so we can translate layer names if they are set to default)
        let layer_index = 0;
        let group_index = 0;

        // as long as there are both layers and groups left
        // we are going to have to figure out who comes first
        while (layer || group) {
            // we compare the first layer in the group with the current layer
            // if that's a match, we'll add the group at this spot and then
            // skip all the layers (since they are already in the group)
            if (!layer || (layer && group && layer.id === group.layers[0].id)) {
                // add layer group to result
                layers_and_groups.push(
                    <LayerGroup
                        id={group.id}
                        key={group.id}
                        index={group_index}
                        name={group.name}
                        bypassed={group.bypassed}
                        ignorecolumntrigger={group.ignorecolumntrigger}
                        solo={group.solo}
                        selected={group.selected}
                        layers={group.layers}
                    />
                );

                // skip layers already in group
                for (let i = 0; i < group.layers.length; i++) {
                    // add all the clips
                    clip_rows.push(layer.clips.map(clip =>
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
                            transporttype={clip.transporttype}
                            target={clip.target}
                            triggerstyle={clip.triggerstyle}
                            faderstart={clip.faderstart}
                            ignorecolumntrigger={clip.ignorecolumntrigger}
                            transport={clip.transport}
                        />
                    ));

                    layer = layer_iter.next().value;
                }

                // add layer group columns
                clip_rows.push(group.columns.map((column, index) =>
                    <Column
                        id={column.id}
                        key={column.id}
                        index={index}
                        name={column.name}
                        connected={column.connected}
                    />
                ));

                // move to next group
                group_index++;
                group = group_iter.next().value;
            } else {
                layers_and_groups.push(
                    <Layer
                        id={layer.id}
                        key={layer.id}
                        index={layer_index}
                        name={layer.name}
                        bypassed={layer.bypassed}
                        solo={layer.solo}
                        crossfadergroup={layer.crossfadergroup}
                        master={layer.master}
                        maskmode={layer.maskmode}
                        faderstart={layer.faderstart}
                        ignorecolumntrigger={layer.ignorecolumntrigger}
                        dashboard={layer.dashboard}
                        autopilot={layer.autopilot}
                        transition={layer.transition}
                        audio={layer.audio}
                        video={layer.video}
                        selected={layer.selected}
                    />
                )

                // add all the clips
                clip_rows.push(layer.clips.map(clip =>
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
                        transporttype={clip.transporttype}
                        target={clip.target}
                        triggerstyle={clip.triggerstyle}
                        faderstart={clip.faderstart}
                        ignorecolumntrigger={clip.ignorecolumntrigger}
                        transport={clip.transport}
                    />
                ))

                // move to next layer
                layer_index++;
                layer = layer_iter.next().value;
            }
        }

        // reverse and flatten clips
        clip_rows.reverse();
        const clips = Array.prototype.concat.apply([], clip_rows);

        // reverse layers
        layers_and_groups.reverse();

        return { clips, layers_and_groups };
    })();

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

    const set_bypass    = bypassed => context.parameters.update_parameter(context.composition.bypassed.id, bypassed);
    const select        = () => context.action('trigger', `/composition/selected`);
    const disconnect    = () => {
        context.action('trigger', `/composition/disconnect-all`, true);
        context.action('trigger', '/composition/disconnect-all', false);
    }

    return (
        <React.Fragment>
            <div className="composition">
                <div className="composition_layers_and_clips">
                    <div className="composition_and_layers">
                        {context.composition.selected &&
                            <div className="composition">
                                <ParameterMonitor.Single parameter={context.composition.selected} render={selected => (
                                    <div className={`button ${selected.value ? 'on' : 'off'}`} onMouseDown={select}>
                                        Composition
                                    </div>
                                )} />
                                <div className="button off" onMouseDown={disconnect}>
                                    X
                                </div>
                                <ParameterMonitor.Single parameter={context.composition.bypassed} render={bypassed => (
                                    <div className={`button ${bypassed.value ? 'on' : 'off'}`} onMouseDown={() => set_bypass(!bypassed.value)}>B</div>
                                )} />
                            </div>
                        }

                        {layers_and_groups}
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
            <Browser
                root={browser_root}
            />
        </React.Fragment>
    );
}

export default Composition;

import { ResolumeContext } from './resolume_provider.js'
import CrossFader from './crossfader.js'
import TempoToolbar from './tempo_toolbar.js'
import Column from './column.js'
import Deck from './deck.js'
import Layer from './layer.js'
import Clip from './clip.js'
import Properties from './properties.js'
import React from 'react'
import PropTypes from 'prop-types';

// composition effect controls are rendered elseewhere
const composition_root = document.getElementById('composition_properties');

/**
  * Component rendering the entire composition
  */
class Composition extends React.Component {

    /**
      * Select the deck with the given id
      *
      * @param  id  The id of the deck to select
      */
    select_deck(id) {
        this.context.transport.send_message({
            action:     "trigger",
            parameter:  `/composition/decks/by-id/${id}/select`,
        });
    }

    /**
      * Get the URI to show a given clip
      *
      * @param  id          The id of the clip to display
      * @param  last_update The timestamp the thumbnail was last updated
      */
    clip_url(id, last_update) {
        // is this the default clip (i.e. it has never been updated from its dummy
        if (last_update === "0") {
            return `http://${this.props.host}:${this.props.port}/api/v1/composition/thumbnail/dummy`;
        } else {
            return `http://${this.props.host}:${this.props.port}/api/v1/composition/clips/by-id/${id}/thumbnail/${last_update}`;
        }
    }

    /**
      * Connect a clip
      *
      * @param  id  The id of the clip to connect
      */
    connect_clip(id, down) {
        this.context.transport.send_message({
            action:     "trigger",
            parameter:  `/composition/clips/by-id/${id}/connect`,
            value:      down,
        });
    }

    /**
      * Select a clip
      *
      * @param  id  The id of the clip to select
      */
    select_clip(id) {
        this.context.transport.send_message({
            action:     "trigger",
            parameter:  `/composition/clips/by-id/${id}/select`,
        });
    }

    render() {
        const columns = this.context.composition.columns.map((column, index) =>
            <Column
                id={column.id}
                key={column.id}
                index={index}
                name={column.name}
                connected={column.connected}
                parameters={this.context.parameters}
            />
        );

        let all_clips = [];
        for (let i=this.context.composition.layers.length-1;i>=0;--i)
            all_clips = all_clips.concat(this.context.composition.layers[i].clips);

        const clips = all_clips.map((clip) => 
            <Clip
                id={clip.id}
                key={clip.id}
                src={this.clip_url(clip.id, clip.thumbnail.last_update)}
                name={clip.name}
                selected={clip.selected}
                select={() =>  this.select_clip(clip.id)}                
                connected={clip.connected}
                connect_down={() => this.connect_clip(clip.id, true)}
                connect_up={() =>  this.connect_clip(clip.id, false)}
                dashboard={clip.dashboard}
                audio={clip.audio}
                video={clip.video}
                parameters={this.context.parameters}
                beatsnap={clip.beatsnap}
                target={clip.target}
                triggerstyle={clip.triggerstyle}
                faderstart={clip.faderstart}
                ignorecolumntrigger={clip.ignorecolumntrigger}
            />
        );

        const layers = this.context.composition.layers.map((layer, index) =>
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
                clip_url={(id, last_update) => this.clip_url(id, last_update)}
                selected={layer.selected}
                parameters={this.context.parameters}
            />
        ).reverse();

        const decks = this.context.composition.decks.map((deck, index) =>
            <Deck
                key={deck.id}
                index={index}
                name={deck.name}
                select={() => this.select_deck(deck.id)}
                selected={deck.selected.value}
                parameters={this.context.parameters}
            />
        );
        
        //min is 100 + 5 margin
        const c = columns.length;
        let s = {
            gridTemplateColumns: `repeat( ${c}, minmax(105px, 1fr)`
        }

        let crossfader = null;
        if (this.context.composition.crossfader.id) {
            crossfader = ( 
                <CrossFader
                    key={this.context.composition.crossfader.id}
                    phase={this.context.composition.crossfader.phase}
                    behaviour={this.context.composition.crossfader.behaviour}
                    curve={this.context.composition.crossfader.curve}
                    video={this.context.composition.crossfader.video}
                />            
            );
        };

        let tempocontroller = null;
        if (this.context.composition.tempocontroller.tempo) {
            tempocontroller = (
                <TempoToolbar
                    tempocontroller={this.context.composition.tempocontroller}
                />
            );
        }

        const name = "Composition";
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
                    name={name}
                    dashboard={this.context.composition.dashboard}
                    audio={this.context.composition.audio}
                    video={this.context.composition.video}
                    title="Composition"
                    root={composition_root}
                />
            </React.Fragment>
        );
    }
}

Composition.contextType = ResolumeContext;

/**
  * Property declaration for Composition component
  */
Composition.propTypes = {
    host: PropTypes.string.isRequired,
    port: PropTypes.number.isRequired
}

export default Composition;

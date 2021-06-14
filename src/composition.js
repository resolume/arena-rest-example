import Transport from './transport.js'
import ParameterContainer from './parameter_container.js'
import CrossFader from './crossfader.js'
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
      * Constructor
      */
    constructor(props) {
        super(props);
        this.transport = new Transport(props.host, props.port);
        this.parameters = new ParameterContainer(this.transport);
        this.transport.on_message((message) => this.handle_message(message));
        this.state = {
            dashboard: {},
            crossfader: {},
            decks: [],
            columns: [],
            layers: [],
        };
    }

    /**
      * Handle incoming messages
      *
      * @param  message The message coming from the server
      */
    handle_message(message) {
        // TODO: properly check the type, right now it's only for param updates
        if (typeof message.type !== 'string') {
            this.setState(message);
        }
    }

    /**
      * Connect the column with the given id
      *
      * @param  id  The id of the column to select
      */
    connect_column(id) {
        this.transport.send_message({
            action:     "trigger",
            parameter:  `/composition/columns/by-id/${id}/connect`,
            value:      true,
        });

        this.transport.send_message({
            action:     "trigger",
            parameter:  `/composition/columns/by-id/${id}/connect`,
            value:      false,
        });
    }

    /**
      * Select the layer with the given id
      *
      * @param  id  The id of the layer to select
      */
    select_layer(id) {
        this.transport.send_message({
            action:     "trigger",
            parameter:  `/composition/layers/by-id/${id}/select`,
        });
    }

    /**
      * Clear the layer with the given id
      *
      * @param  id  The id of the layer to clear
      */
    clear_layer(id) {
        this.transport.send_message({
            action:     "trigger",
            parameter:  `/composition/layers/by-id/${id}/clear`,
        });
    }

    /**
      * Select the deck with the given id
      *
      * @param  id  The id of the deck to select
      */
    select_deck(id) {
        this.transport.send_message({
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
      * Connect a clip, possibly causing it to be displayed
      *
      * @param  id  The id of the clip to trigger
      */
    connect_clip(id, down) {
        // TODO: fix this weirdness with toggling 'selected', we should
        // find a better name for this parameter, because setting it to
        // false will not stop it being selected.
        this.transport.send_message({
            action:     "trigger",
            parameter:  `/composition/clips/by-id/${id}/connect`,
            value:      down,
        });
    }

    /**
      * Select a clip, triggering it for display
      *
      * @param  id  The id of the clip to trigger
      */
    select_clip(id) {
        this.transport.send_message({
            action:     "trigger",
            parameter:  `/composition/clips/by-id/${id}/select`,
        });
    }

    /**
      * Generate the component output
      */
    render() {

        const columns = this.state.columns.map((column, index) =>
            <Column
                key={column.id}
                index={index}
                name={column.name}
                connect={() => this.connect_column(column.id)}
                connected={column.connected}
                parameters={this.parameters}
            />
        );

        let all_clips = [];
        for (let i=this.state.layers.length-1;i>=0;--i)
            all_clips = all_clips.concat(this.state.layers[i].clips);

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
                parameters={this.parameters}
                beatsnap={clip.beatsnap}
                target={clip.target}
                triggerstyle={clip.triggerstyle}
                faderstart={clip.faderstart}
                ignorecolumntrigger={clip.ignorecolumntrigger}
            />
        );

        const layers = this.state.layers.map((layer, index) =>                    
            <Layer
                key={layer.id}
                index={index}
                name={layer.name}
                bypassed={layer.bypassed}
                dashboard={layer.dashboard}
                audio={layer.audio}
                video={layer.video}
                select={() => this.select_layer(layer.id)}
                clear={() => this.clear_layer(layer.id)}
                clip_url={(id, last_update) => this.clip_url(id, last_update)}
                connect_clip={(id, down) => this.connect_clip(id, down)}
                select_clip={(id) => this.select_clip(id)}
                selected={layer.selected}
                parameters={this.parameters}
            />
        ).reverse();

        const decks = this.state.decks.map((deck, index) =>
            <Deck
                key={deck.id}
                index={index}
                name={deck.name}
                select={() => this.select_deck(deck.id)}
                selected={deck.selected.value}
                parameters={this.parameters}
            />
        );
        
        const c = columns.length;
        let s = {
            gridTemplateColumns: `repeat( ${c}, minmax(105px, 1fr)`
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
                    {/* {this.state.crossfader.id &&
                        <CrossFader
                            key={this.state.crossfader.id}
                            phase={this.state.crossfader.phase}
                            behaviour={this.state.crossfader.behaviour}
                            curve={this.state.crossfader.curve}
                            video={this.state.crossfader.video}
                            parameters={this.parameters}
                        />
                    } */}
                </div>
                <Properties
                    name={name}
                    dashboard={this.state.dashboard}
                    audio={this.state.audio}
                    video={this.state.video}                    
                    parameters={this.parameters}
                    title="Composition"
                    root={composition_root}
                />
            </React.Fragment>
        );
    }
}

/**
  * Property declaration for Composition component
  */
Composition.propTypes = {
    host: PropTypes.string.isRequired,
    port: PropTypes.number.isRequired
}

export default Composition;

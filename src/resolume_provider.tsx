import React, { useState, useContext, createContext } from 'react';
import Transport from './transport.js'
import ParameterContainer from './parameter_container.js'
import IEffects from './IEffects'
import ISources from './ISources'

type ResolumeContextProperties = {
    action: (type: string, path: string, value: any) => void,
    post: (path: string, body: string) => void,
    remove: (path: string) => void,
    effects: IEffects,
    sources: ISources,
};

type ResolumeContextParameters = {
    children: React.ReactNode,
    host: string,
    port: number,
}

export const ResolumeContext = createContext<ResolumeContextProperties | undefined>(undefined);

function ResolumeProvider(props: ResolumeContextParameters) {
    // the default product info if we are not connected to a backend
    const default_product = {
        name: '(disconnected)',
        major: 0,
        minor: 0,
        micro: 0,
        revision: 0
    };

    // the default composition to use when disconnected
    const default_composition = {
        dashboard: {},
        crossfader: {},
        tempocontroller: {},
        decks: [],
        layers: [],
        columns: [],
        layergroups: []
    };

    // the default sources list to use when disconnected
    const default_sources = {
        audio: [],
        video: []
    };

    // the default effect list to use when disconnected
    const default_effects = {
        audio: [],
        video: [],
    };

    // store the composition, give an initial value
    const [ composition, setComposition ]   = useState(default_composition);
    const [ sources, setSources ]           = useState(default_sources);
    const [ effects, setEffects ]           = useState(default_effects);
    const [ connected, setConnected ]       = useState(false);
    const [ product, setProduct ]           = useState(default_product);

    // create a new transport and register connection state listeners
    const create_transport = () => {
        // create the transport
        let transport = new Transport(props.host, props.port);

        // maintain updated state
        transport.on_message((message: any) => {
            // TODO: properly check the type, right now it's only for param updates
            if (typeof message.type !== 'string') {
                /* check if message contains a composition, does it have columns and layers */
                if (message.columns && message.layers) {
                    console.log('state update', message);
                    setComposition(message);
                } else {
                    console.log('state does not contain a composition', message);
                }
            } else if (message.type === 'sources_update') {
                console.log('sources update', message.value);
                setSources(message.value);
            } else if (message.type === 'effects_update') {
                console.log('effects update', message.value);
                setEffects(message.value);
            }
        });

        // register state handler
        transport.on_connection_state_change((is_connected: boolean) => {
            // update connection state
            setConnected(is_connected);

            // revert to default product info on disconnection
            if (is_connected) {
                let xhr = new XMLHttpRequest();

                xhr.addEventListener('load', event => {
                    const product = JSON.parse(xhr.responseText);
                    setProduct(product)
                });

                xhr.open('GET', `//${props.host}:${props.port}/api/v1/product`);
                xhr.send();
            } else {
                setComposition(default_composition);
                setSources(default_sources);
                setEffects(default_effects);
                setProduct(default_product);
            }
        });

        // register state change handler
        return transport;
    };

    const [ transport ]     = useState(create_transport);
    const [ parameters ]    = useState(() => { return new ParameterContainer(transport) });

    // execute an action on a parameter
    const action = (type: string, path: string, value: any) => {
        // do we have a value to provide
        if (value !== undefined) {
            // create the message
            let message = {
                action:     type,
                parameter:  path,
                value:      value,
            };

            // now send the message over the transport
            transport.send_message(message);
        } else {
            // create the message
            let message = {
                action:     type,
                parameter:  path
            };

            // now send the message over the transport
            transport.send_message(message);
        }
    };

    // send a post-like request
    const post = (path: string, body: string) => {
        // create the message
        let message = {
            action: 'post',
            path:   path,
            body:   body
        };

        // now send the message over the transport
        transport.send_message(message);
    };

    // send a delete-like request
    const remove = (path: string) => {
        // create the message
        let message = {
            action: 'remove',
            path:   path,
        };

        // now send the message over the transport
        transport.send_message(message);
    };

    // send a regular HTTP request using fetch
    const fetch = (path: string, options: Record<string, unknown>) => {
        return window.fetch(`//${props.host}:${props.port}/api/v1${path}`, options);
    };

    const clip_url = (id: number, last_update: string) => {
        // is this the default clip (i.e. it has never been updated from its dummy
        if (last_update === "0") {
            return `//${props.host}:${props.port}/api/v1/composition/thumbnail/dummy`;
        } else {
            return `//${props.host}:${props.port}/api/v1/composition/clips/by-id/${id}/thumbnail/${last_update}`;
        }
    };

    const properties = {
        action,         // execute an action
        post,           // send a 'post' request
        remove,         // send a 'delete' request
        fetch,          // send a regular http request, using fetch
        composition,    // the current composition state
        sources,        // the current sources available
        effects,        // the current effects available
        connected,      // whether we are currently connected to the server
        parameters,     // the parameter collection
        product,        // information on the product we are connected to
        transport,      // the transport for communicating with the backend
        clip_url        // get the url for a given clip
    };

    return (
        <ResolumeContext.Provider value={properties}>
            {props.children}
        </ResolumeContext.Provider>
    )
}

// use the created context and check that it is valid
// (i.e. it is used within a <ResolumeProvider> component)
export const useResolumeContext = (): ResolumeContextProperties => {
    const properties = useContext(ResolumeContext);

    if (properties === undefined) {
        throw new Error("Context may only be used within ResolumeProvider")
    }

    return properties as ResolumeContextProperties;
}

export default ResolumeProvider;

import React from 'react';
import ReactDOM from 'react-dom';
import Composition from './composition.js'
import ResolumeProvider from './resolume_provider'
import './index.css';

// ========================================

function get_option(production, development, fallback) {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
        return production;
    } else if (development) {
        return development;
    } else {
        return fallback;
    }
}

const host = get_option(window.location.hostname, process.env.REACT_APP_HOST, '127.0.0.1');
const port = parseInt(get_option(window.location.port, process.env.REACT_APP_PORT, 8080), 10);

ReactDOM.render(
    <ResolumeProvider host={host} port={port}>
        <Composition host={host} port={port} />
    </ResolumeProvider>,
    document.getElementById('grid')
);

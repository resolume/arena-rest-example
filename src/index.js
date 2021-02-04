import React from 'react';
import ReactDOM from 'react-dom';
import Composition from './composition.js'
import './index.css';

// ========================================

ReactDOM.render(
    <Composition
        host={process.env.REACT_APP_HOST || "127.0.0.1"}
        port={parseInt(process.env.REACT_APP_PORT, 10) || 8080}
    />,
    document.getElementById('grid')
);

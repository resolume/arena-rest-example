import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import Effects from './effects'
import Sources from './sources'
import Tabs from './tabs'

type Props = {
    root: HTMLElement,
};


const Browser = (props: Props) => {
    const [ element ] = useState(() => document.createElement('div'));

    useEffect(() => {
        props.root.appendChild(element);
        return () => { props.root.removeChild(element) };
    });

    // the components with the effects and sources to render
    const effects = <Effects />;
    const sources = <Sources />;

    const browser = <Tabs
        tabs={[
            { name: "Effects", component: effects },
            { name: "Sources", component: sources },
        ]}
    />

    return ReactDOM.createPortal(
        browser,
        element
    );
}

export default Browser;

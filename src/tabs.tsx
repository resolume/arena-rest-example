import React, { ReactNode, useState } from 'react'
import './tabs.css'

type Tab = {
    name: string,
    component: ReactNode,
}

type Props = {
    tabs: Tab[],
}


const Tabs = (props: Props) => {
    const [ selectedIndex, setSelectedIndex ] = useState(0);

    const names = props.tabs.map((prop, index) =>
        <div
            key={'effect' + index}
            onClick={() => setSelectedIndex(index)}
            className={selectedIndex === index ? "selected" : "deselected"}>
                {prop.name}
        </div>
    );

    const component = props.tabs[selectedIndex].component;

    return (
        <div className="tabs">
            <div className="names">{names}</div>
            <div className="component">{component}</div>
        </div>
    )
};

export default Tabs;

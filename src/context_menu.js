import React, { useState, useContext } from 'react'
import { ResolumeContext } from './resolume_provider'
import ParameterMonitor from './parameter_monitor.js'


/**
  * Component for rendering a parameter option
  * in a menu
  */
function MenuOption(props) {
    const context                   = useContext(ResolumeContext);
    const [ expanded, setExpanded ] = useState(false);

    const update = value => context.action('set', `/parameter/by-id/${props.param.id}`, value);

    return (
        <ParameterMonitor.Single parameter={props.param} render={parameter => {            
            /* this check is in because the ContexMenu for the Layer passes Boolean Parameters to this menu, and those don't have any options  */
            if (parameter.options) {
                const options = parameter.options.map((option, index) => {
                    return (
                        <div
                            className={`option ${index === parameter.index ? 'selected' : ''}`}
                            onClick={() => update(index)}
                        >
                        {option}
                        </div>
                    )
                });
                return (
                    <div className="option menu" onMouseEnter={() => setExpanded(true)} onMouseLeave={() => setExpanded(false)}>
                        {props.name}
                        {expanded &&
                            <div className="sub-menu">{options}</div>
                        }
                    </div>
                )
            } else if (parameter.valuetype === 'ParamBoolean') {
                return (
                    <div className={`option ${parameter.value === true ? 'checked' : ''}`} onClick={() => update(!parameter.value)}>
                        {props.name}
                    </div>
                )
            } else {
                console.warn("Unsupported parameter in context menu");
            }
        }} />
    );
}


/**
  * Component for rendering a context menu
  */
function ContextMenu(props) {
    const [ open, setOpen ]         = useState(false);
    const [ position, setPosition ] = useState({ top: 0, left: 0 });

    const close_menu = event => {
        event.preventDefault();
        document.removeEventListener("click", close_menu);
        setOpen(false);
    }

    const open_menu = event => {
        event.preventDefault();
        document.addEventListener("click", close_menu);

        setOpen(true);
        setPosition({ top: event.pageY, left: event.pageX })
    };

    /**
      * Render the menu content
      */
    const options = Object.entries(props.options).map((value) => {
        const name      = value[0];
        const option    = value[1];

        return (
            <MenuOption
                name={name}
                param={option}
                key={`menu_option_${option.id}`}
            />
        )
    });

    return (
        <React.Fragment>
            <span onContextMenu={open_menu}>
                {props.children}
            </span>
            {open && 
                <div className="context-menu" style={position}>
                    <div className="label">{props.name}</div>
                    {options}
                </div>
            }
        </React.Fragment>
    )
}

export default ContextMenu;

import React from 'react'
import Properties from './properties.js';
import PropTypes from 'prop-types';

// we need to draw outside of our container, but instead
// draw elsewhere in the html hierarchy
const layer_root = document.getElementById('layer_properties');

/**
  * Render a layer
  */
class Layer extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            bypassed: this.props.bypassed,
            solo: this.props.solo
        };

        this.update_bypass = (parameter) => {
            this.setState({ bypassed: parameter });
        };

        this.update_solo = (parameter) => {
            this.setState({ solo: parameter });
        };

        this.toggle_bypass = () => {
            this.props.parameters.update_parameter(this.props.bypassed.id, !this.state.bypassed.value);
        }

        this.toggle_solo = () => {
            this.props.parameters.update_parameter(this.props.solo.id, !this.state.solo.value);
        }        

    }

    componentDidMount() {
        this.props.parameters.register_monitor(this.props.bypassed.id, this.update_bypass, this.props.bypassed);
        this.props.parameters.register_monitor(this.props.solo.id, this.update_solo, this.props.solo);
    }

    componentWillUnmount() {
        this.props.parameters.unregister_monitor(this.props.bypassed.id, this.update_bypass);
        this.props.parameters.unregister_monitor(this.props.solo.id, this.update_solo);
    }

    render() {
        /* Replace # with ((index+1) of Layer) */
        const name = this.props.name.value.replace(/#/g, this.props.index+1);

        return (
            <div className="layer">       
                <div className="controls">
                    <div className="cbs">
                        <div className={`button off`} onClick={this.props.clear}>Clear</div>
                        <div className={`button ${this.state.bypassed.value ? 'on' : 'off'}`} onClick={this.toggle_bypass}>B</div>
                        <div className={`button ${this.state.solo.value ? 'on' : 'off'}`} onClick={this.toggle_solo}>S</div>
                    </div>
                    <div className={`handle ${this.props.selected.value ? 'selected' : ''}`} onMouseDown={this.props.select}>
                        {name}
                    </div>              
                </div>
                {this.props.selected.value &&
                    <Properties
                        name={name}    
                        dashboard={this.props.dashboard}
                        autopilot={this.props.autopilot}
                        transition={this.props.transition}
                        video={this.props.video}                        
                        parameters={this.props.parameters}
                        title="Layer"
                        root={layer_root}
                    />
                }
            </div>
        );
    }
}

/**
  * Property declaration for Layer component
  */
Layer.propTypes = {
    selected: PropTypes.object.isRequired,
    select: PropTypes.func.isRequired,
    clear: PropTypes.func.isRequired,
    dashboard: PropTypes.object.isRequired,
    parameters: PropTypes.object.isRequired
}

export default Layer;

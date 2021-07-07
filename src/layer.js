import React from 'react'
import Properties from './properties.js';
import PropTypes from 'prop-types';
import Parameter from './parameter';

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
            solo: this.props.solo,
            crossfader_group: this.props.crossfader_group
        };

        this.update_bypass = (parameter) => {
            this.setState({ bypassed: parameter });
        };

        this.update_solo = (parameter) => {
            this.setState({ solo: parameter });
        };

        this.update_crossfader_group = (parameter) => {
            this.setState({ crossfader_group: parameter });
        };

        this.toggle_bypass = () => {
            this.props.parameters.update_parameter(this.props.bypassed.id, !this.state.bypassed.value);
        }

        this.toggle_solo = () => {
            this.props.parameters.update_parameter(this.props.solo.id, !this.state.solo.value);
        }        

        this.toggle_crossfader_group = (value) => {
            this.props.parameters.update_parameter(this.props.crossfader_group.id, value);
        }        

    }

    componentDidMount() {
        this.props.parameters.register_monitor(this.props.bypassed.id, this.update_bypass, this.props.bypassed);
        this.props.parameters.register_monitor(this.props.solo.id, this.update_solo, this.props.solo);
        this.props.parameters.register_monitor(this.props.crossfader_group.id, this.update_crossfader_group, this.props.crossfader_group);
    }

    componentWillUnmount() {
        this.props.parameters.unregister_monitor(this.props.bypassed.id, this.update_bypass);
        this.props.parameters.unregister_monitor(this.props.solo.id, this.update_solo);
        this.props.parameters.unregister_monitor(this.props.crossfader_group.id, this.update_crossfader_group);
    }

    render() {
        /* Replace # with ((index+1) of Layer) */
        const name = this.props.name.value.replace(/#/g, this.props.index+1);

//onDoubleClick={() => this.handle_reset(this.props.autopilot.target.id)}

        return (
            <div className="layer">       
                <div className="controls">
                    <div className="cbs">
                        <div className={`button off`} onClick={this.props.clear}>Clear</div>
                        <div className={`button ${this.state.bypassed.value ? 'on' : 'off'}`} onClick={this.toggle_bypass}>B</div>
                        <div className={`button ${this.state.solo.value ? 'on' : 'off'}`} onClick={this.toggle_solo}>S</div>
                    </div>
                    <div className="crossfader_group">
                        <div className={`button ${this.state.crossfader_group.index == 1 ? 'on' : 'off'}`} onClick={() => this.toggle_crossfader_group(1)}>A</div>
                        <div className={`button ${this.state.crossfader_group.index == 2 ? 'on' : 'off'}`} onClick={() => this.toggle_crossfader_group(2)}>B</div>
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

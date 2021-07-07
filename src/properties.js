import React from 'react'
import ReactDOM from 'react-dom'
import Effect from './effect.js'
import PropTypes from 'prop-types';
import Parameter from './parameter.js'
import Parameters from './parameters.js'

class Properties extends React.Component {
    constructor(props) {
        super(props);
        this.element = document.createElement('div');
    }

    componentDidMount() {
        this.props.root.appendChild(this.element);
    }

    componentWillUnmount() {
        this.props.root.removeChild(this.element);
    }
    
    handle_reset(id) {
        this.props.parameters.reset_parameter(id);
    }

    render() {

        let dashboard = null;
        if (this.props.dashboard) {
            dashboard = (
                <div className="dashboard">
                    <Parameters
                        key={`dashboard_${this.props.name}`}
                        name={this.props.name}
                        params={this.props.dashboard}
                        parameters={this.props.parameters}
                        labelLast={true}
                    />
                </div>                
            );
        }
        
        let autopilot = null;
        if (this.props.autopilot) {
            autopilot = (
                <div>
                    <span className="label" onDoubleClick={() => this.handle_reset(this.props.autopilot.target.id)}>Behaviour</span>
                    <Parameter
                        parameters={this.props.parameters}
                        name="Target"
                        key={this.props.autopilot.target.id}
                        id={this.props.autopilot.target.id}
                        initial={this.props.autopilot.target}
                    />
                </div>
            );
        }

        let transition = null;
        if (this.props.transition) {
            transition = (
                <div>
                    <div>
                        <span className="label" onDoubleClick={() => this.handle_reset(this.props.transition.duration.id)}>Duration</span>
                        <Parameter
                            parameters={this.props.parameters}
                            name="Duration"
                            key={this.props.transition.duration.id}
                            id={this.props.transition.duration.id}
                            initial={this.props.transition.duration}
                        />
                    </div>
                    <div>
                        <span className="label" onDoubleClick={() => this.handle_reset(this.props.transition.blend_mode.id)}>Blend Mode</span>
                        <Parameter
                            parameters={this.props.parameters}
                            name="Blend Mode"
                            key={this.props.transition.blend_mode.id}
                            id={this.props.transition.blend_mode.id}
                            initial={this.props.transition.blend_mode}
                        />
                    </div>
                </div>
            );
        }        

        let audio_section = null;
        if (this.props.audio) {
            const effects = this.props.audio.effects.map((value) => {
                return (
                    <Effect
                        key={`effect_${value.name}`}
                        name={value.name}
                        mixer={value.mixer}
                        params={value.params}
                        parameters={this.props.parameters}
                    />
                );
            });

            audio_section = (
                <div>
                    <div>
                        <div>
                            <span className="label" onDoubleClick={() => this.handle_reset(this.props.audio.volume.id)}>Volume</span>
                            <Parameter
                                parameters={this.props.parameters}
                                name="Volume"
                                key={this.props.audio.volume.id}
                                id={this.props.audio.volume.id}
                                initial={this.props.audio.volume}
                            />
                        </div>
                        <div>
                            <span className="label" onDoubleClick={() => this.handle_reset(this.props.audio.pan.id)}>Pan</span>
                            <Parameter
                                parameters={this.props.parameters}
                                name="Audio Pan"
                                key={this.props.audio.pan.id}
                                id={this.props.audio.pan.id}
                                initial={this.props.audio.pan}
                            />
                        </div>                         
                    </div>
                    <div className="effects">
                        {effects}
                    </div>
                </div>
            );
        }  

        let video_section = null;
        if (this.props.video) {
            const effects = this.props.video.effects.map((value) => {
                return (
                    <Effect
                        key={`effect_${value.name}`}
                        name={value.name}
                        mixer={value.mixer}
                        params={value.params}
                        parameters={this.props.parameters}
                    />
                );
            });

            video_section = (
                <div>
                    {this.props.video.sourceparams &&
                        <div>
                            <div className="title">{this.props.name}</div>
                            <div className="content">
                                <Parameters
                                    key={`source_${this.props.name}`}
                                    name="Source"
                                    params={this.props.video.sourceparams}
                                    parameters={this.props.parameters}
                                />
                            </div>
                        </div>
                    }
                    <div className="title">Video</div>
                        <div className="content">
                            <div>
                                <span className="label" onDoubleClick={() => this.handle_reset(this.props.video.opacity.id)}>Opacity</span>
                                <Parameter
                                    parameters={this.props.parameters}
                                    name="Opacity"
                                    key={this.props.video.opacity.id}
                                    id={this.props.video.opacity.id}
                                    initial={this.props.video.opacity}
                                /> 
                            </div>
                            {this.props.video.mixer &&
                                <Parameters
                                    key={`mixer_${this.props.name}`}
                                    name="Mixer"
                                    params={this.props.video.mixer}
                                    parameters={this.props.parameters}
                                />    
                            }
                            <div className="effects">
                                {effects}
                            </div>
                        </div>
                </div>
            );
        }


        const title = this.props.title + " (" + this.props.name + ")";
        const properties = (
            <div className="properties">
                <div className="title">{title}</div>
                <div className="content">
                    {dashboard}
                </div>
                {autopilot &&
                    <div>
                        <div className="title">Autopilot</div>
                        <div className="content">
                            {autopilot}
                        </div>
                    </div>
                }
                {transition &&
                    <div>
                        <div className="title">Transition</div>
                        <div className="content">
                            {transition}
                        </div>
                    </div>
                }                
                {audio_section &&
                    <div>
                        <div className="title">Audio</div>
                        <div className="content">
                            {audio_section}
                        </div>
                    </div>
                }
                <div>
                    {video_section}
                </div>
            </div>            
        );

        return ReactDOM.createPortal(
            properties,
            this.element
        );
    }
}

/**
  * Property declaration for Properties component
  */
 Properties.propTypes = {
    dashboard: PropTypes.object.isRequired,
    parameters: PropTypes.object.isRequired,
}

export default Properties

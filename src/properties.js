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
    handle_reset(id)
    {
        this.props.parameters.reset_parameter(id);
    }
    render() {

        let dashboard = null;
        if (this.props.dashboard) {
            dashboard = (
                /* An Effect does not always have a mixer, Mask and Transform do not for instance */
                <Parameters
                    key={`dashboard_${this.props.name}`}
                    name={this.props.name}
                    params={this.props.dashboard}
                    parameters={this.props.parameters}
                /> 
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
                                key={this.props.audio.volume.id}
                                id={this.props.audio.volume.id}
                                initial={this.props.audio.volume}
                            />
                        </div>
                        <div>
                            <span className="label" onDoubleClick={() => this.handle_reset(this.props.audio.pan.id)}>Pan</span>
                            <Parameter
                                parameters={this.props.parameters}
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
                    <div>
                        <span className="label" onDoubleClick={() => this.handle_reset(this.props.video.opacity.id)}>Opacity</span>
                        <Parameter
                            parameters={this.props.parameters}
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
                    {this.props.video.sourceparams &&
                        <Parameters
                            key={`source_${this.props.name}`}
                            name="Source"
                            params={this.props.video.sourceparams}
                            parameters={this.props.parameters}
                        />    
                    }
                    <div className="effects">
                        {effects}
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
                {audio_section &&
                    <div>
                        <div className="title">Audio</div>
                        <div className="content">
                            {audio_section}
                        </div>
                    </div>
                }
                <div>
                    <div className="title">Video</div>
                    <div className="content">
                        {video_section}
                    </div>
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

import React from 'react'
import PropTypes from 'prop-types'

/**
  * Component rendering a column within the composition
  */
class Column extends React.Component {  

    /* Replace # with ((index+1) of Layer) */
    render() {
      const name = this.props.name.value.replace(/#/g, this.props.index+1);
      const connected = this.props.connected.value;
      return (
          <div
              className={`column ${connected ? 'connected' : ''}`}
              onClick={this.props.connect}
          >
          {name}
          </div>
      );
    }
}

/**
  * Property declaration for Column component
  */
Column.propTypes = {
    connected: PropTypes.object.isRequired,
    connect: PropTypes.func.isRequired
}

export default Column;

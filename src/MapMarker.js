import React, { Component } from 'react';
import { Icon, Popover } from 'antd';

export default class MapMarker extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  handleClick = () => {
    console.log(this.props.name)
  }
  render(){
    const { name, county } = this.props
    const popContent = (
      <div>
        <p>{name}</p>
        <p>{county}</p>
      </div>
    );
    return(
      <Popover content={popContent} title={name}>
        <div className="marker" onClick={this.handleClick}>{name.split('')[0]}</div>
      </Popover>
    )
  }
}

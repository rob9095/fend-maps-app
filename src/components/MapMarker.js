import React, { Component } from 'react';
import { Icon, Spin, Tooltip } from 'antd';
import SpotModal from './SpotModal';

export default class MapMarker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
    }
  }

  handleClick = (e) => {
    this.setState({showModal: true})
    this.props.onNewSpot(this.props.id)
  }

  closeModal = () => {
    this.setState({
      showModal: false,
    })
  }

  render(){
    const { name, county, id } = this.props
    let n = ''
    for (let word of name.split(' ')){
      n = n + word[0]
    }
    return(
      <div>
        <Tooltip placement="top" title={name}>
          <div className={this.props.isCurrentSpot ? 'marker open' : 'marker'} onClick={this.handleClick}>{n}</div>
        </Tooltip>
        {this.state.showModal && (
          <SpotModal
            id={id}
            name={name}
            county={county}
            onClose={this.closeModal}
          />
        )}
      </div>
    )
  }
}

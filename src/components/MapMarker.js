import React, { Component } from 'react';
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
    const { name, county, id, isCurrentSpot } = this.props
    let n = ''
    for (let word of name.split(' ')){
      n = n + word[0]
    }
    return(
      <div>
        <div
          onMouseOut={()=>this.setState({showPopover: false})}
          onMouseOver={()=>this.setState({showPopover: true})}
          className={isCurrentSpot ? 'marker open' : 'marker'}
          onClick={this.handleClick}>{n}
        </div>
        {this.state.showPopover || isCurrentSpot ? (
          <div className="info-popover">
            <div>
              <h3>{name}</h3>
            </div>
          </div>
        ) : null}
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

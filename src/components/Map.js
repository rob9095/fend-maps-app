import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { Button, Icon } from 'antd'
import MapMarker from './MapMarker';

class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {
      zoom: 12,
    }
  }

  handleNewSpot = (id) => {
    this.props.onNewSpot(id,false)
  }

  showModal = (id) => {
    this.setState({
      modal_id: id,
    })
  }

  render() {
    const {searchValue, allSpots, currentSpot, clickedSpot} = this.props
    let searchMarkers = allSpots.filter(s=>s.spot_name.toLowerCase().includes(searchValue)).map(s => (
      <MapMarker
        key={s.spot_id}
        lat={s.cords.lat}
        lng={s.cords.lng}
        name={s.spot_name}
        county={s.county_name}
        id={s.spot_id}
        onNewSpot={this.handleNewSpot}
        isCurrentSpot={s.spot_id == currentSpot.spot_id}
      />
    ))
    let markers = allSpots.map(s => (
      <MapMarker
        key={s.spot_id}
        lat={s.cords.lat}
        lng={s.cords.lng}
        name={s.spot_name}
        county={s.county_name}
        id={s.spot_id}
        onNewSpot={this.handleNewSpot}
        isCurrentSpot={s.spot_id == currentSpot.spot_id}
      />
    ))
    return (
      <div>
        <GoogleMapReact
          style={{width: '100%', height: '95vh'}}
          // bootstrapURLKeys={{ key: 'AIzaSyDCbwt_f4xYHZsCC54Zjq_eb5b5nb4RrAU' }}
          center={currentSpot.cords}
          defaultZoom={this.state.zoom}
          hoverDistance={20}
        >
          {searchValue ? searchMarkers : markers}
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;

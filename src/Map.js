import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { Button, Icon } from 'antd'
import MapMarker from './MapMarker';

class Map extends Component {
  state = {
    zoom: 13
  }

  render() {
    let markers = this.props.localSpots.map(s => (
      <MapMarker
        key={s.spot_id}
        lat={s.cords.lat}
        lng={s.cords.lng}
        name={s.spot_name}
        county={s.county}
      />
    ))
    return (
      <div>
        <GoogleMapReact
          style={{width: '100%', height: '100%'}}
          bootstrapURLKeys={{ key: 'AIzaSyDCbwt_f4xYHZsCC54Zjq_eb5b5nb4RrAU' }}
          defaultCenter={this.props.currentSpot.cords}
          defaultZoom={this.state.zoom}
          hoverDistance={20}
        >
          {markers}
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;

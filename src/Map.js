import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { Button, Icon } from 'antd'

const AnyReactComponent = ({ text }) => <div><Icon type="pushpin" theme="filled" className="marker" /></div>;

class Map extends Component {
  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyDCbwt_f4xYHZsCC54Zjq_eb5b5nb4RrAU' }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          <AnyReactComponent
            lat={59.955413}
            lng={30.337844}
            text={'Kreyser Avrora'}
          />
        </GoogleMapReact>
      </div>
    );
  }
}

export default Map;

import React, { Component } from 'react';
import { Spin, Button, Icon } from 'antd';
import GoogleMapReact from 'google-map-react';
import MapMarker from './MapMarker';

class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {
      zoom: 12,
      loading: true,
    }
  }

  componentDidMount() {
    if (this.props.errors) {
      this.setState({
        loading: false,
        error: true,
      })
    }
  }

  handleGoogleApiLoaded = ({map, maps}) => {
    if (map && maps) {
      this.setState({
        loading: false
      })
    } else {
      this.setState({
        loading: false,
        error: true,
      })
      this.props.onError({message: 'Failed to load Google Maps'})
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
    const {searchValue, allSpots, currentSpot } = this.props
    let searchMarkers = allSpots.filter(s=>s.spot_name.toLowerCase().includes(searchValue)).map(s => (
      <MapMarker
        key={s.spot_id}
        lat={s.cords.lat}
        lng={s.cords.lng}
        name={s.spot_name}
        county={s.county_name}
        id={s.spot_id}
        onNewSpot={this.handleNewSpot}
        isCurrentSpot={s.spot_id === currentSpot.spot_id}
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
        isCurrentSpot={s.spot_id === currentSpot.spot_id}
      />
    ))
    if (this.state.error) {
      return(
        <div
          className="map-error-container column"
        >
          <div className="map-message">
            <Icon type="warning" theme="outlined" style={{fontSize: '3em',marginBottom: 10}} />
            <h3>Failed to Load Google Maps</h3>
            <Button
              type="primary"
              onClick={()=>window.location.reload()}
              aria-label="Refresh Page"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      )
    }
    return (
      <Spin spinning={this.state.loading}>
          <GoogleMapReact
            style={{width: '100%', height: '95vh',marginBottom: -61}}
            bootstrapURLKeys={{ key: 'AIzaSyDCbwt_f4xYHZsCC54Zjq_eb5b5nb4RrAU' }}
            center={currentSpot.cords}
            defaultZoom={this.state.zoom}
            hoverDistance={20}
            onGoogleApiLoaded={this.handleGoogleApiLoaded}
            yesIWantToUseGoogleMapApiInternals
          >
            {searchValue ? searchMarkers : markers}
          </GoogleMapReact>
      </Spin>
    );
  }
}

export default Map;

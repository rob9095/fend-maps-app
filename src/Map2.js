import React from "react";
import ReactDOM from "react-dom";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDCbwt_f4xYHZsCC54Zjq_eb5b5nb4RrAU",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => {
  let markers = props.localSpots.map(s => (
    <Marker key={s.spot_id} position={s.cords} onClick={props.onMarkerClick} />
  ))
  return (
    <GoogleMap defaultZoom={11} defaultCenter={props.currentSpot.cords}>
      {markers}
    </GoogleMap>
  )
});

class MyFancyComponent extends React.PureComponent {
  state = {
    isMarkerShown: true,
  }

  componentDidMount() {
    this.delayedShowMarker()
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true })
    }, 3000)
  }

  handleMarkerClick = (e) => {
    console.log(e)
  }

  render() {
    return (
      <MyMapComponent
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick}
        currentSpot={this.props.currentSpot}
        localSpots={this.props.localSpots}
      />
    )
  }
}

export default MyFancyComponent;

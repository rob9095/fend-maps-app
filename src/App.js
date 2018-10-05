import React, { Component } from 'react';
import Map from './Map';
import { Button, Icon } from 'antd'
import {apiCall} from './services';

class App extends Component {
  componentDidMount() {
    apiCall('http://api.spitcast.com/api/county/spots/orange-county/')
  }
  render() {
    return (
      <div className="App">
        <div id="left-sidebar" className="column">
            <div className="sidebar-top">
              <Button type="primary">Hi</Button>
              <Icon type="pushpin" theme="filled" className="marker" />
            </div>
            <div className="bottom">

            </div>
        </div>
        <div id="main-content" className="column">
            <div className="content-top"></div>
            <div className="bottom">
              <Map />
            </div>
        </div>
      </div>
    );
  }
}

export default App;

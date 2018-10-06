import React, { Component } from 'react';
import MyFancyComponent from './Map2';
import Map from './Map';
import SpotMenu from './SpotMenu';
import { Button, Icon, Input } from 'antd'
import {apiCall} from './services';

class App extends Component {
  state = {
    loading: true,
  }
  componentDidMount() {
    this.init()
  }

  handleError = ({err, message}) => {
    console.log(err)
    this.setState({
      loading: false,
      error: {
        message,
      }
    })
  }

  handleSearch = (e) => {
    this.setState({
      [e.target.name]: e.target.value ? e.target.value.toLowerCase() : '',
    })
  }

  init = () => {
    apiCall('http://api.spitcast.com/api/spot/all')
    .then(allSpots => {
      allSpots = allSpots.map(s=>({
        ...s,
        cords: {
          lat: s.latitude,
          lng: s.longitude,
        }
      }))
      let counties = allSpots.map(s=>s.county_name).filter((c,i,a)=> c !== a[i+1] ? c : null)
      this.setState({
        loading: false,
        allSpots,
        //salt creek/orange county are defaults
        currentSpot: allSpots.find(s => s.spot_id === 214),
        localSpots: allSpots.filter(s => s.county_name === 'Orange County'),
        counties,
      })
    })
    .catch(err => {
      this.handleError({err,message:'Unable to get spot data'})
    })
  }

  handleApiRequest = (url) => {
    apiCall(url)
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      this.handleError({err,message:'Unable to get spot data'})
    })
  }

  render() {
    const {currentSpot, localSpots, counties, allSpots, searchValue} = this.state;
    if (this.state.loading) {
      return (
        <div>loading...</div>
      )
    }
    return (
      <div className="App">
        <div id="left-sidebar" className="column">
            <div className="sidebar-top">
              <h4></h4>
            </div>
            <div className="bottom">
              <Input placeholder="Search" value={searchValue} name="searchValue" onChange={this.handleSearch} />
              <SpotMenu
                allSpots={allSpots}
                currentSpot={currentSpot}
                counties={counties}
                searchValue={searchValue}
              />
            </div>
        </div>
        <div id="main-content" className="column">
            <div className="content-top">
              <div className="navbar">
                <div className="logo">
                  <h1>Surfari</h1>
                </div>
                <div className="actions">
                  <Icon type="ellipsis" theme="outlined" className="menu-trigger" />
                </div>
              </div>
            </div>
            <div className="bottom">
              <Map
                currentSpot={currentSpot}
                localSpots={localSpots}
              />
            </div>
        </div>
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import Map from './Map';
import SpotMenu from './SpotMenu';
import SpotModal from './SpotModal';
import { Button, Icon, Input, Spin } from 'antd'
import MenuIcon from './MenuIcon';
import {apiCall} from '../services';
import {activeSpots} from '../activeSpots'

const Search = Input.Search;

class App extends Component {
  state = {
    loading: true,
    showSidebar: true,
    showModal: false,
    showMenu: false,
  }

  toggle = (prop) => {
    return () => {
      this.setState({
        [prop]: !this.state[prop],
      })
    }
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

  //initalize view when componentMounts, gets all surf spot data
  init = () => {
    apiCall('http://api.spitcast.com/api/spot/all')
    // map over the response, add cords object to use on map. filter out spots not in activeSpots array since they dont have forcast data
    .then(allSpots => {
      allSpots = allSpots.map(s=>({
        ...s,
        cords: {
          lat: s.latitude,
          lng: s.longitude,
        }
      })).filter(s=>activeSpots.includes(s.spot_name))
      // map spots to create array of county names, filter out duplicates
      let counties = allSpots.map(s=>s.county_name).filter((c,i,a)=> c !== a[i+1] ? c : null)
      this.setState({
        loading: false,
        allSpots,
        //Huntington Beach Orange County is defaults
        currentSpot: allSpots.find(s => s.spot_id === 643),
        counties,
        showSidebar: document.documentElement.clientWidth > 500 ? true : false,
      })
    })
    .catch(err => {
      this.handleError({err,message:'Unable to get spot data'})
    })
  }

  handleNewSpot = (id,showModal) => {
    let currentSpot = this.state.allSpots.find(s=>s.spot_id === parseInt(id))
    this.setState({
      currentSpot,
      showModal,
    })
  }

  render() {
    const {currentSpot, counties, allSpots, searchValue} = this.state;
    if (this.state.loading) {
      return (
        <Spin className="loader" spinning size="large"/>
      )
    }
    return (
      <div className="App">
        <div id="left-sidebar" className={this.state.showSidebar ? "column open" : "column closed"}>
            <div className="bottom">
              <div className="search-container">
                <Search placeholder="Search" value={searchValue} name="searchValue" onChange={this.handleSearch} />
              </div>
              <SpotMenu
                allSpots={allSpots}
                currentSpot={currentSpot}
                counties={counties}
                searchValue={searchValue}
                onMenuClick={this.handleNewSpot}
              />
            </div>
        </div>
        <div id="main-content" className="column">
            <div className="content-top">
              <div className="navbar">
                <div className="logo-container">
                  <MenuIcon className="menu-trigger" onClick={this.toggle('showSidebar')} />
                  <h1 className="logo">Surfcast</h1>
                </div>
                <div className="actions">
                  <Icon type="ellipsis" theme="outlined" className="menu-trigger" onClick={this.toggle('showMenu')} />
                </div>
              </div>
            </div>
            {this.state.showMenu && (
              <div className="drop-menu">
                  <div className="menu-container">
                      <h1>hi</h1>
                  </div>
              </div>
            )}
            <div className="bottom">
              <Map
                currentSpot={currentSpot}
                allSpots={allSpots}
                searchValue={searchValue}
                onNewSpot={this.handleNewSpot}
              />
              {this.state.showModal && (
                <SpotModal
                  id={currentSpot.spot_id}
                  name={currentSpot.spot_name}
                  county={currentSpot.county_name}
                  onClose={this.toggle('showModal')}
                />
              )}
            </div>
        </div>
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import Map from './Map';
import SpotMenu from './SpotMenu';
import SpotModal from './SpotModal';
import { Button, Icon, Input, Spin } from 'antd'
import {apiCall} from '../services';
import {activeSpots} from '../activeSpots'

class App extends Component {
  state = {
    loading: true,
    showSidebar: true,
    showModal: false,
    showMenu: false,
    allSpots: [],
    counties: [],
    currentSpot: {},
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
      const clientWidth = document.documentElement.clientWidth
      this.setState({
        loading: false,
        allSpots,
        //Huntington Beach Orange County is defaults
        currentSpot: allSpots.find(s => s.spot_id === 643),
        counties,
        showSidebar: clientWidth > 600 ? true : false,
      })
    })
    .catch(err => {
      this.handleError({err,message:'Unable to get spot data'})
    })
  }

  handleWindowResize = () => {
    const clientWidth = document.documentElement.clientWidth;
    this.setState({
      showSidebar: clientWidth <= 600 ? false : this.state.showSidebar,
    })
  }

  handleNewSpot = (id,showModal) => {
    let currentSpot = this.state.allSpots.find(s=>s.spot_id === parseInt(id))
    this.setState({
      currentSpot,
      showModal,
    })
  }

  handleSearchClear = () => {
    this.setState({searchValue: ''})
    document.getElementById('search').focus()
  }

  render() {
    const {currentSpot, counties, allSpots, searchValue} = this.state;
    window.onresize = (e) => {
      this.handleWindowResize();
    }
    if (this.state.loading) {
      return (
        <Spin className="loader" spinning size="large"/>
      )
    }
    return (
      <div className="App">
        <aside id="left-sidebar" className={this.state.showSidebar ? "column open" : "column closed"}>
            <div className="content">
              <div className="search-container">
                <Input
                  id="search"
                  placeholder="Search"
                  value={searchValue}
                  name="searchValue"
                  onChange={this.handleSearch}
                  suffix={
                    searchValue ?
                    <Icon type="close" onClick={this.handleSearchClear} style={{cursor: 'pointer'}} />
                    :
                    <Icon type="search" style={{cursor: 'pointer'}} onClick={()=>document.getElementById('search').focus()} />
                  }
                />
              </div>
              <SpotMenu
                allSpots={allSpots}
                currentSpot={currentSpot}
                counties={counties}
                searchValue={searchValue}
                onMenuClick={this.handleNewSpot}
              />
            </div>
        </aside>
        <div id="app-container" className="column">
            <header>
              <nav className="navbar">
                <Icon
                  type={this.state.showSidebar ? "align-right" : "align-left"}
                  theme="outlined"
                  className="menu-trigger"
                  onClick={this.toggle('showSidebar')}
                />
                <div>
                  <h1 className="logo">Surfcast</h1>
                </div>
                <div className="actions">
                  <Icon
                    type="ellipsis"
                    theme="outlined"
                    className="menu-trigger"
                    onClick={this.toggle('showMenu')}
                  />
                </div>
              </nav>
            </header>
            {this.state.showMenu && (
              <div className="drop-menu">
                  <div className="menu-container">
                      <h1>hi</h1>
                  </div>
              </div>
            )}
            <article className="content">
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
            </article>
            <footer className={this.state.showSidebar ? "footer sidebar-open" : "footer"}>
              <div className="details">
                <a href="http://github.com/rob9095"><Icon type="github" theme="outlined" /> @rob9095</a>
              </div>
              <div className="credit">
                Data Provided by <a className="underline" href="http://www.spitcast.com/api/docs/">Spit Cast</a>
              </div>
            </footer>
        </div>
      </div>
    );
  }
}

export default App;

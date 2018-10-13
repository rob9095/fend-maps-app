import React, { Component } from 'react';
import Map from './Map';
import SidebarMenu from './SidebarMenu';
import SpotModal from './SpotModal';
import { Icon, Input, Spin, Button } from 'antd'
import {apiCall} from '../services';
import {activeSpots} from '../activeSpots';

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

  gm_authFailure(){
    window.alert("Google Maps error")
  }

  componentDidMount() {
    window.gm_authFailure = this.gm_authFailure;
    this.init()
  }

  handleError = ({err, message}) => {
    this.setState({
      errors: [this.state.errors, message],
      loading: false,
    })
  }

  handleSearch = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  //initalize view when componentMounts, gets all surf spot data
  init = () => {
    apiCall('http://api.spitcast.com/api/spot/all')
    // map over the response, add cords object to use on map. filter out spots not in activeSpots array since they dont have forecast data
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
        //Huntington Beach Orange County is default
        currentSpot: allSpots.find(s => s.spot_id === 643),
        counties,
        showSidebar: clientWidth > 600 ? true : false,
      })
    })
    .catch(err => {
      this.handleError({err,message:'Failed to get surf spot data'})
      window.alert('Failed to get surf spot data')
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
      <div className={this.state.errors ? "App error" : "App"}>
        {this.state.errors && (
          <div className="error-message-container">
            <div className="column error-message">
              <ul className="error-list">
                {this.state.errors.map(e=><li key={e}>{e}</li>)}
              </ul>
            </div>
          </div>
        )}
        <aside id="left-sidebar" className={this.state.showSidebar ? "column open" : "column closed"}>
            <div className="content">
              <div className="search-container">
                <Input
                  aria-label="search surf spots"
                  autoFocus
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
              <SidebarMenu
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
                <button
                  className="menu-button"
                  onClick={this.toggle('showSidebar')}
                  aria-label={this.state.showSidebar ? 'Side Navigation, click to close' : 'Side Navigation, click to open'}
                  title="Side Navigation"
                  >
                    <Icon
                      type={this.state.showSidebar ? "align-right" : "align-left"}
                      theme="outlined"
                      className="menu-trigger"
                    />
                </button>
                <div>
                  <h1 className="logo">Surfcast</h1>
                </div>
                <div className="actions">
                  <button
                    className="menu-button"
                    onClick={this.toggle('showMenu')}
                    aria-label={this.state.showMenu ?
                      'More Information Menu, click to close'
                      :
                      'More Information Menu, click to open'
                    }
                    title="More Information Menu"
                    >
                    <Icon
                      type="ellipsis"
                      theme="outlined"
                      className="menu-trigger"
                    />
                  </button>
                </div>
              </nav>
            </header>
            {this.state.showMenu && (
              <div className="drop-menu" role="menu">
                  <div className="menu-container">
                      <p style={{margin: 0}}>
                        Surfcast provides live surf forecasts, wind, and tide information for more than 100 surf spots in California.
                      </p>
                      <div className="column" style={{paddingTop: 10}}>
                        <Button
                          href="https://github.com/rob9095/fend-maps-app"
                          type="primary"
                          icon="github"
                          aria-label="See Project on Github"
                        >
                          Github
                        </Button>
                      </div>
                  </div>
                  <div className="menu-footer">
                    Data provided by <a aria-label="Spit Cast Api" href="http://www.spitcast.com/api/docs/">Spit Cast</a>
                  </div>
              </div>
            )}
            <article className="content">
                <Map
                  currentSpot={currentSpot}
                  allSpots={allSpots}
                  searchValue={searchValue}
                  onNewSpot={this.handleNewSpot}
                  onError={this.handleError}
                  errors={this.state.errors}
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
                <a aria-label="@rob9095 Github Profile" href="http://github.com/rob9095"><Icon type="github" theme="outlined" /> @rob9095</a>
              </div>
              <div className="credit">
                Data Provided by <a aria-label="Spit Cast Api" className="underline" href="http://www.spitcast.com/api/docs/">Spit Cast</a>
              </div>
            </footer>
        </div>
      </div>
    );
  }
}

export default App;

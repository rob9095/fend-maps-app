import React, { Component } from 'react';
import MyFancyComponent from './Map2';
import Map from './Map';
import SpotMenu from './SpotMenu';
import SpotModal from './SpotModal';
import { Button, Icon, Input, Spin } from 'antd'
import {apiCall} from './services';
import {activeSpots} from './activeSpots'

const Search = Input.Search;

const menuSvg = () => (
  <svg viewBox="0 0 384.97 384.97" fill="currentColor" width="1em" height="1em">
    <g>
    	<g id="Menu">
    		<path d="M12.03,84.212h360.909c6.641,0,12.03-5.39,12.03-12.03c0-6.641-5.39-12.03-12.03-12.03H12.03
    			C5.39,60.152,0,65.541,0,72.182C0,78.823,5.39,84.212,12.03,84.212z"/>
    		<path d="M372.939,180.455H12.03c-6.641,0-12.03,5.39-12.03,12.03s5.39,12.03,12.03,12.03h360.909c6.641,0,12.03-5.39,12.03-12.03
    			S379.58,180.455,372.939,180.455z"/>
    		<path d="M372.939,300.758H12.03c-6.641,0-12.03,5.39-12.03,12.03c0,6.641,5.39,12.03,12.03,12.03h360.909
    			c6.641,0,12.03-5.39,12.03-12.03C384.97,306.147,379.58,300.758,372.939,300.758z"/>
    	</g>
    </g>
  </svg>
)

const MenuIcon = props => (
  <span className="custom-icon">
    <Icon component={menuSvg} {...props} />
  </span>
);

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

  init = () => {
    apiCall('http://api.spitcast.com/api/spot/all')
    .then(allSpots => {
      allSpots = allSpots.map(s=>({
        ...s,
        cords: {
          lat: s.latitude,
          lng: s.longitude,
        }
      })).filter(s=>activeSpots.includes(s.spot_name))
      let counties = allSpots.map(s=>s.county_name).filter((c,i,a)=> c !== a[i+1] ? c : null)
      this.setState({
        loading: false,
        allSpots,
        //Huntington Beach/orange county are defaults
        currentSpot: allSpots.find(s => s.spot_id === 643),
        localSpots: allSpots.filter(s => s.county_name === 'Orange County'),
        counties,
        showSidebar: document.documentElement.clientWidth > 500 ? true : false,
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

  handleNewSpot = (id,showModal) => {
    let currentSpot = this.state.allSpots.find(s=>s.spot_id === parseInt(id))
    this.setState({
      currentSpot,
      localSpots: this.state.allSpots.filter(s => s.county_name === currentSpot.county_name),
      showModal,
    })
  }

  render() {
    const {currentSpot, localSpots, counties, allSpots, searchValue} = this.state;
    if (this.state.loading) {
      return (
        <Spin className="loader" spinning size="large"/>
      )
    }
    return (
      <div className="App">
        <div id="left-sidebar" className={this.state.showSidebar ? "column open" : "column closed"}>
            <div className="bottom">
              <div className="seach-container">
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
                localSpots={localSpots}
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

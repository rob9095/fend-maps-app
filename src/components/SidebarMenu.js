import React from 'react';
import { Menu, Icon } from 'antd'; // eslint-disable-line no-unused-vars
const SubMenu = Menu.SubMenu; // eslint-disable-line no-unused-vars

class SidebarMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openKeys: [],
    }
  }

  componentDidMount() {
    this.setState({openKeys: [this.props.currentSpot.county_name]})
    setTimeout(()=>{
      this.scrollTo(this.props.currentSpot.spot_id)
    },1000)
  }

  scrollTo = (id) => {
    const node = document.getElementById(id)
    if (node) {
      node.scrollIntoView({block: 'center', behavior: 'smooth'})
    }
  }

  toggleKey = (id) => {
    let openKeys = this.state.openKeys.includes(id) ?
      this.state.openKeys.filter(val=>val !== id)
      :
      [...this.state.openKeys, id]

    this.setState({openKeys})
  }


  handleSpotClick = (e) => {
    let id = e.target.id
    if (e.key === "Enter" || e.key === undefined) {
      this.props.onMenuClick(id,true)
    }
  }

  handleCountyClick = (e, name) => {
    let id = name === undefined ? e.target.id.split("-")[0] : name
    if (e.key === "Enter" || e.key === undefined) {
      this.toggleKey(id)
    }
  }

  render() {
    const { allSpots, counties, currentSpot, searchValue } = this.props
    const { openKeys } = this.state
    let val = searchValue ? searchValue.toLowerCase() : null
    const searchMenu = allSpots.filter(s=>s.spot_name.toLowerCase().includes(val)).map(s => (
      <li
        tabIndex="0"
        id={s.spot_id}
        key={s.spot_id}
        onMouseDown={this.handleSpotClick}
        onKeyPress={this.handleSpotClick}
        className={currentSpot.spot_id === s.spot_id ?
          "ant-menu-item menu-item ant-menu-item-selected"
          :
          "ant-menu-item menu-item"
        }
      >
        {s.spot_name}
      </li>
    ))
    const menu = counties.map(county => {
      let items = allSpots.filter(s => s.county_name === county).map(s =>(
        <li
          tabIndex="0"
          id={s.spot_id}
          key={s.spot_id}
          onMouseDown={this.handleSpotClick}
          onKeyPress={this.handleSpotClick}
          className={currentSpot.spot_id === s.spot_id ?
            "ant-menu-item menu-item ant-menu-item-selected"
            :
            "ant-menu-item menu-item"
          }
        >
          {s.spot_name}
        </li>
      ))
      return (
        <li
          tabIndex="0"
          id={county+"-li"}
          onClick={this.handleCountyClick}
          onKeyPress={this.handleCountyClick}
          key={county}
          className="ant-menu-submenu ant-menu-submenu-inline menu-item"
          >
          <div
            id={county+ "-title"}
            className="ant-menu-submenu-title"
            aria-label={`${county}, click to expand/collapse`}
            role="link"
          >
            <span id={county + "-span"}>{county}</span>
              <Icon
                type={openKeys.includes(county) ? "up" : "down"}
                className="menu-arrow"
                theme="outlined"
                onMouseDown={(e)=>this.handleCountyClick(e,county)}
              />
          </div>
          <ul
            id={`${county}-menu`}
            className={openKeys.includes(county) ?
              "ant-menu ant-menu-sub ant-menu-inline"
              :
              "ant-menu ant-menu-sub ant-menu-inline ant-menu-hidden"
            }
          >
            {items}
          </ul>
        </li>
      )
    })
    return (
      <nav>
        <ul className="ant-menu ant-menu-dark ant-menu-root ant-menu-inline">
          {searchValue ? searchMenu : menu}
        </ul>
      </nav>
    );
  }
}

export default SidebarMenu;

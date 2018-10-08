import React from 'react';
import { Menu } from 'antd';

const SubMenu = Menu.SubMenu;

class SpotMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      theme: 'dark',
      openKeys: [],
    }
  }

  componentDidMount() {
    this.setState({openKeys: [this.props.currentSpot.county_name]})
    setTimeout(()=>{
      this.scrollTo(this.props.currentSpot.spot_id)
    },1000)
  }

  scrollTo = (key) => {
    const node = document.getElementById(key)
    node.scrollIntoView({block: 'center', behavior: 'smooth'});
  }

  handleSpotClick = (e) => {
    this.setState({
      current: e.key,
    });
    this.props.onMenuClick(e.key,true)
  }

  handleCountyClick = (e) => {
    // if the target is undefined we got a click and we use the key, otherwise it was a keydown
    let id = e.target === undefined ? e.key : e.target.id
    // if the key pressed was an enter key or it was a click with a valid key
    if (e.key === 'Enter' || e.key) {
      // if the id is not a number, add/remove the county from openKeys
      if (!Number(parseInt(id))) {
        let openKeys = this.state.openKeys.includes(id) ?
          this.state.openKeys.filter(key=>key !== id)
          :
          [...this.state.openKeys, id]
        this.setState({
          openKeys,
        })
      } else {
        // spot was clicked/entered
        this.handleSpotClick({key: id})
      }
    }
  }

  render() {
    const {allSpots,counties,currentSpot,searchValue} = this.props
    let val = searchValue ? searchValue.toLowerCase() : null
    const searchMenu = allSpots.filter(s=>s.spot_name.toLowerCase().includes(val)).map(s => (
      <Menu.Item
        className="menu-item"
        onClick={this.handleSpotClick}
        onKeyPress={()=>this.handleSpotClick({key:s.spot_id})}
        key={s.spot_id}
        id={s.spot_id}
      >
        {s.spot_name}
      </Menu.Item>
    ))
    const menu = counties.map(county => {
      let items = allSpots.filter(s => s.county_name === county).map(s =>(
        <Menu.Item
          className="menu-item"
          onClick={this.handleSpotClick}
          onKeyPress={()=>this.handleSpotClick({key:s.spot_id})}
          key={s.spot_id}
          id={s.spot_id}>
          {s.spot_name}
        </Menu.Item>
      ))
      return (
        <SubMenu
          className="menu-item"
          onTitleClick={this.handleCountyClick}
          onKeyPress={this.handleCountyClick}
          key={county}
          id={county}
          title={<span>{county}</span>}
        >
          {items}
        </SubMenu>
      )
    })
    return (
      <div>
        <Menu
          theme={this.state.theme}
          forceSubMenuRender={true}
          openKeys={this.state.openKeys}
          selectedKeys={[`${currentSpot.spot_id}`]}
          mode="inline"
        >
          {searchValue ? searchMenu : menu}
        </Menu>
      </div>
    );
  }
}

export default SpotMenu;

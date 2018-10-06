import React from 'react';
import { Menu, Icon, Switch } from 'antd';

const SubMenu = Menu.SubMenu;

class SpotMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      theme: 'dark'
    }
  }

  componentDidMount() {
    setTimeout(()=>{
      this.scrollTo(this.props.currentSpot.spot_id)
    }, 1000)
  }

  scrollTo = (key) => {
    const node = document.getElementById(key)
    node.scrollIntoView({block: 'start', behavior: 'smooth'});
  }

  changeTheme = (value) => {
    this.setState({
      theme: value ? 'dark' : 'light',
    });
  }

  handleClick = (e) => {
    console.log('click ', e);
    this.scrollTo(e.key)
    this.setState({
      current: e.key,
    });
  }

  render() {
    const {allSpots,counties,currentSpot,searchValue} = this.props
    const searchMenu = allSpots.filter(s=>s.spot_name.toLowerCase().includes(searchValue)).map(s => (
      <Menu.Item key={s.spot_id} id={s.spot_id}>
        {s.spot_name}
      </Menu.Item>
    ))
    const menu = counties.map(county => {
      let items = allSpots.filter(s => s.county_name === county).map(s =>(
        <Menu.Item key={s.spot_id} id={s.spot_id}>
          {s.spot_name}
        </Menu.Item>
      ))
      return (
        <SubMenu key={county} id={county} title={<span>{county}</span>}>
          {items}
        </SubMenu>
      )
    })
    return (
      <div>
        <Switch
          checked={this.state.theme === 'dark'}
          onChange={this.changeTheme}
          checkedChildren="Dark"
          unCheckedChildren="Light"
        />
        <br />
        <br />
        <Menu
          theme={this.state.theme}
          onClick={this.handleClick}
          defaultOpenKeys={[currentSpot.county_name]}
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

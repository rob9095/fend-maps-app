import React, {Component} from 'react'
import { Table, Divider, Tag, Spin, Alert } from 'antd';
import ReactChartkick, { AreaChart } from 'react-chartkick'
import Chart from 'chart.js'
import { apiCall } from './services';

ReactChartkick.addAdapter(Chart)

const moment = require('moment');

const columns = [
  {
    title: 'Day',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Hour',
    dataIndex: 'hour',
    key: 'hour',
  },
  {
    title: 'Forcast',
    dataIndex: 'shape_full',
    key: 'shape_full',
  },
  {
    title: 'Surf',
    dataIndex: 'size',
    key: 'size',
  },
  {
    title: 'Wind',
    dataIndex: 'wind',
    key: 'wind',
  },
];

class ForcastTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      forcast: [],
      tide:[],
      temp: '',
      wetsuit: '',
      pagination: {
        size: 'small',
        pageSize: 5,
      }
    }
  }

  componentDidMount() {
    this.getSpotForcast(this.props.id)
  }

  getCountyForcast = (county) => {
    return new Promise( async (resolve,reject) => {
      try {
        let c = county.toLowerCase().replace(/ /g,'-')
        let wind = await apiCall(`http://api.spitcast.com/api/county/wind/${c}/`)
        let temp = await apiCall(`http://api.spitcast.com/api/county/water-temperature/${c}/`)
        let tide = await apiCall(`http://api.spitcast.com/api/county/tide/${c}/`)
        resolve({
          wind,
          temp,
          tide,
        })
      }catch(err) {
        console.log('err',err)
        reject(err)
      }
    })
  }

  getSpotForcast = (id) => {
    let hour = moment(new Date()).hours()
    apiCall(`http://api.spitcast.com/api/spot/forecast/${id}/`)
    .then(async forcast => {
      let countyForcast = await this.getCountyForcast(this.props.county)
      let tide = {}
      for (let t of countyForcast.tide) {
        tide = {
          ...tide,
          [t.hour]: t.tide.toFixed(1),
        }
      }
      console.log(tide)
      this.setState({
        temp: countyForcast.temp.fahrenheit,
        wetsuit: countyForcast.temp.wetsuit,
        tide,
      })
      forcast = forcast.map(f=>{
        let windDir = countyForcast.wind.find(h=>h.hour === f.hour)
        return ({
          ...f,
          wind: countyForcast.wind.find(h=>h.hour === f.hour).direction_text,
          windSpeed: countyForcast.wind.find(h=>h.hour === f.hour).speed_kts,
        })
      }).map(f=>{
        if(f.hour.includes('PM')){
          return({
            ...f,
            momentHr: parseInt(f.hour.split('PM')[0])+12
          })
        } else {
          return ({
            ...f,
            momentHr: parseInt(f.hour.split('AM')[0])
          })
        }
      }).filter(f=>f.momentHr >= hour - 1).sort((a,b)=>a.momentHr-b.momentHr)
      this.setState({
        forcast,
        loading: false,
      })
    })
    .catch(err => {
      console.log(err)
      this.setState({
        error: 'Forcast Unavailable',
        loading: false,
      })
    })
  }

  render(){
    let data = this.state.forcast.map(f => ({
      key: f.spot_id + f.day + f.hour,
      date: moment(new Date(f.date)).format('M/D'),
      shape_full: <Alert style={{padding: 0}} message={f.shape_full} type={f.shape.includes('p') ? 'info' : f.shape.includes('g') ? 'warning' : 'success'} />,
      size: f.size + " ft",
      hour: f.hour,
      wind: f.wind + " " + f.windSpeed + " kts",
    }))
    return(
      <div>
        <h3>Tide Chart</h3>
        <div className="tide-container">
          <AreaChart
            data={this.state.tide}
            height={"150px"}
            min={parseInt(Object.values(this.state.tide).sort((a,b)=>a-b)[0])- 1}
            max={parseInt(Object.values(this.state.tide).sort((a,b)=>b-a)[0])+ 1}
            colors={['#1890ff']}
          />
        </div>
        <h3>Hourly Forcast</h3>
        <div className="temp-container">
          <h4>Temperature: <span>{this.state.temp} °F</span></h4>
          <h4>Recommended: <span>{this.state.wetsuit}</span></h4>
        </div>
        <Table
          loading={this.state.loading}
          size="small"
          columns={columns}
          dataSource={data}
          pagination={this.state.pagination}
          total={this.state.forcast.length}
          locale={{emptyText: this.state.error}}
        />
      </div>
    )
  }
}

export default ForcastTable;

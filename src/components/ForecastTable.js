import React, {Component} from 'react'
import { Table, Spin, Alert } from 'antd';
import ReactChartkick, { AreaChart } from 'react-chartkick'
import Chart from 'chart.js'
import { apiCall } from '../services';

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
    title: 'Forecast',
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

class ForecastTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      forecast: [],
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
    this.getSpotforecast(this.props.id)
  }

  handleDataFetch = (county,id) => {
    return new Promise( async (resolve,reject) => {
      let c = county.toLowerCase().replace(/ /g,'-')
      let forecast = await apiCall(`http://api.spitcast.com/api/spot/forecast/${id}/?dcat=week`)
      let wind = await apiCall(`http://api.spitcast.com/api/county/wind/${c}/`)
      let temp = await apiCall(`http://api.spitcast.com/api/county/water-temperature/${c}/`)
      let tide = await apiCall(`http://api.spitcast.com/api/county/tide/${c}/`)
      // if the response failed we set an empty array or 'n/a'
      resolve({
        forecast: forecast || [],
        wind: wind || [],
        temp: temp || {fahrenheit:'n/a',wetsuit:'n/a'},
        tide: tide || [],
      })
    })
  }

  getSpotforecast = async (id) => {
    let spotforecast = await this.handleDataFetch(this.props.county,id)
    let tide = {}
    let hour = moment(new Date()).hours()
    //loop tides array to create object of tides for tide chart
    for (let t of spotforecast.tide) {
      tide = {
        ...tide,
        [t.hour]: t.tide.toFixed(1),
      }
    }
    //map over the forecast to add wind data
    let forecast = spotforecast.forecast.map(f=>{
      return ({
        ...f,
        wind: spotforecast.wind.find(h=>h.hour === f.hour).direction_text,
        windSpeed: spotforecast.wind.find(h=>h.hour === f.hour).speed_kts,
      })
    })
    //remove hours that passed already in the current day. get current hour using momentjs above and convert 12 hr format in api response to 24 hour
    .map(f=>{
      if(f.hour.includes('PM')){
        let momentHr = parseInt(f.hour.split('PM')[0])
        //add 12 to the hour if its a PM hour, unless its 12PM then set it 12
        momentHr = momentHr === 12 ? 12 : momentHr + 12
        return({
          ...f,
          momentHr,
        })
      } else {
        let momentHr = parseInt(f.hour.split('AM')[0])
        // if the hour is 12AM set it to 1
        momentHr = momentHr === 12 ? 1 : momentHr
        return ({
          ...f,
          momentHr,
        })
      }
    })
    // if the moment hour - 1 passed, filter out those results unless the date is not from today
    .filter(f => ((f.momentHr >= hour - 1 || f.date.toLowerCase() !== moment(new Date()).format('dddd MMM DD YYYY').toLowerCase())))
    this.setState({
      forecast,
      tide,
      temp: spotforecast.temp.fahrenheit,
      wetsuit: spotforecast.temp.wetsuit,
      loading: false,
    })
  }


  render(){
    let data = this.state.forecast.map(f => ({
      key: f.spot_id + f.day + f.hour,
      date: moment(new Date(f.date)).format('M/D'),
      shape_full: (
          <Alert
            style={{padding: 0}}
            message={f.shape_full}
            //p is poor(show blue/info), g is good(show yellow/warning), last condition is f for fair(show success/green)
            type={f.shape.includes('p') ? 'info' : f.shape.includes('g') ? 'warning' : 'success'}
          />
      ),
      size: f.size + " ft",
      hour: f.hour,
      wind: f.wind + " " + f.windSpeed + " kts",
    }))
    return(
      <Spin spinning={this.state.loading}>
        <div>
          <h3>Tide Chart (ft)</h3>
          <div className="tide-container">
            {Object.values(this.state.tide).length === 0 && !this.state.loading && (<span className="no-data">Tide Data Unavailable</span>)}
            <AreaChart
              data={this.state.tide}
              height={"150px"}
              min={parseInt(Object.values(this.state.tide).sort((a,b)=>a-b)[0])- 1}
              max={parseInt(Object.values(this.state.tide).sort((a,b)=>b-a)[0])+ 1}
              colors={['#1890ff']}
            />
          </div>
          <h3>Hourly Forecast</h3>
          <div className="temp-container">
            <h5>Temperature: <span>{this.state.temp} °F</span></h5>
            <h5>Recommended: <span>{this.state.wetsuit}</span></h5>
          </div>
          <Table
            loading={this.state.loading}
            size="small"
            columns={columns}
            dataSource={data}
            pagination={this.state.pagination}
            total={this.state.forecast.length}
            locale={{emptyText: 'Forecast Data Unavailable'}}
            footer={() => (
              <div className="forecast-credit">
                <span>
                  Data Provided by <a href="http://www.spitcast.com/api/docs/">Spit Cast</a>
                </span>
              </div>
            )}
          />
        </div>
      </Spin>
    )
  }
}

export default ForecastTable;

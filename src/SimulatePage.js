import React from 'react';
import qs from 'qs';
// import { withRouter } from "react-router-dom";

import './SimulatePage.css';
import Plane from './models/Plane';

class SimulatePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: 60,
      columns: 6,
      averageRowHeightInches: 31,
      averageWalkSpeedMph: 2.8,
      timeCurrent: null,
      timeFuture: null,
      avgSecSavedPerPassenger: 0,
      passengerFlightsPerYear: 853000000, //https://www.bts.gov/newsroom/full-year-2022-us-airline-traffic-data#:~:text=For%20the%20full%20year%202022,(928M)%20reached%20in%202019.
      wakingSecInHumanLife: 1660000000,
      totalLivesSaved: null,
      seed: 'defaultSeed',
    };
  }
  
  componentDidMount(props) {
    const params = qs.parse(window.location.search);

    this.setState({
      rows: params.rows ? parseInt(params.rows, 10) : this.state.rows,
      columns: params.columns ? parseInt(params.columns, 10) : this.state.columns,
      averageRowHeightInches: params.averageRowHeightInches ? parseFloat(params.averageRowHeightInches) : this.state.averageRowHeightInches,
      averageWalkSpeedMph: params.averageWalkSpeedMph ? parseFloat(params.averageWalkSpeedMph) : this.state.averageWalkSpeedMph,
      passengerFlightsPerYear: params.passengerFlightsPerYear ? parseInt(params.passengerFlightsPerYear, 10) : this.state.passengerFlightsPerYear,
      wakingSecInHumanLife: params.wakingSecInHumanLife ? parseInt(params.wakingSecInHumanLife, 10) : this.state.wakingSecInHumanLife,
      seed: params.seed || this.state.seed,
    });
  }

  runSimulation = () => {
    const plane = new Plane(
      parseInt(this.state.rows), 
      parseInt(this.state.columns), 
      parseFloat(this.state.averageRowHeightInches), 
      parseFloat(this.state.averageWalkSpeedMph),
      this.state.seed,
    );
    plane.embark();

    const timeCurrent = plane.disembarkCurrent();
    const timeFuture = plane.disembarkFuture();
    
    const avgSecSaved = (timeCurrent - timeFuture) / 2;

    this.setState({
      timeCurrent: timeCurrent,
      timeFuture: timeFuture,
      avgSecSavedPerPassenger: avgSecSaved,
      totalLivesSaved: (avgSecSaved * this.state.passengerFlightsPerYear) / this.state.wakingSecInHumanLife
    }, () => {
      const stateForUrl = {
        rows: this.state.rows,
        columns: this.state.columns,
        averageRowHeightInches: this.state.averageRowHeightInches,
        averageWalkSpeedMph: this.state.averageWalkSpeedMph,
        passengerFlightsPerYear: this.state.passengerFlightsPerYear,
        wakingSecInHumanLife: this.state.wakingSecInHumanLife,
        seed: this.state.seed,
      };
      const newQueryString = qs.stringify(stateForUrl);
      window.history.pushState({}, '', `?${newQueryString}`);
    });
  }
  
  formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.round(timeInSeconds % 60);
    return `${minutes} minutes ${seconds} seconds`;
  }

  render() {
    return (
      <div className="App">
        <h1>Fill and Flush Deplaning Simulator</h1>
        <table className="input-table">
          <tbody>
            <tr>
              <td><label>Rows:</label></td>
              <td><input type="number" value={this.state.rows} onChange={e => this.setState({ rows: e.target.value })} /></td>
            </tr>
            <tr>
              <td><label>Columns:</label></td>
              <td><input type="number" value={this.state.columns} onChange={e => this.setState({ columns: e.target.value })} /></td>
            </tr>
            <tr>
              <td><label>Average Walk Speed (mph):</label></td>
              <td><input type="number" value={this.state.averageWalkSpeedMph} onChange={e => this.setState({ averageWalkSpeedMph: e.target.value })} /></td>
            </tr>
            <tr>
              <td><label>Average Row Height (in):</label></td>
              <td><input type="number" value={this.state.averageRowHeightInches} onChange={e => this.setState({ averageRowHeightInches: e.target.value })} /></td>
            </tr>
          </tbody>
        </table>
        <button onClick={this.runSimulation}>Run Simulation</button>
      
        <p>Time to deplane status quo: {this.formatTime(this.state.timeCurrent)}</p>
        <p>Time to deplane using FILL AND FLUSH method: {this.formatTime(this.state.timeFuture)}</p>
      
        <h2>Impact of Efficiency Improvement</h2>
        <table className="input-table">
          <tbody>
            <tr>
              <td><label>Avg. Seconds Saved per Passenger:</label></td>
              <td><input type="number" value={Math.round(this.state.avgSecSavedPerPassenger)} onChange={e => this.setState({ avgSecSavedPerPassenger: e.target.value })} /></td>
            </tr>
            <tr>
              <td><label>Passenger Flights per Year (USA):</label></td>
              <td><input type="number" value={this.state.passengerFlightsPerYear} onChange={e => this.setState({ passengerFlightsPerYear: e.target.value })} /></td>
            </tr>
            <tr>
              <td><label>Waking Seconds in a Human Life (~79 Years):</label></td>
              <td><input type="number" value={this.state.wakingSecInHumanLife} onChange={e => this.setState({ wakingSecInHumanLife: e.target.value })} /></td>
            </tr>
          </tbody>
        </table>
        <p>Total lives saved per year (assuming savings on each passenger flight): <strong>{Math.round(this.state.totalLivesSaved)}</strong></p>
      </div>
    );
  }
}

export default SimulatePage;


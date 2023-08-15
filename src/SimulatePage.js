import React from 'react';
import qs from 'qs';
// import { withRouter } from "react-router-dom";

import './stylesheets/SimulatePage.css';
import Plane from './models/Plane';
import CurrentAnimation from './CurrentAnimation';
import FutureAnimation from './FutureAnimation';

class SimulatePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: 15,
      columns: 6,
      averageRowHeightInches: 31,
      averageWalkSpeedMph: 3.1,
      timeCurrent: null,
      timeFuture: null,
      avgSecSavedPerPassenger: 0,
      passengerFlightsPerYear: 853000000, //https://www.bts.gov/newsroom/full-year-2022-us-airline-traffic-data#:~:text=For%20the%20full%20year%202022,(928M)%20reached%20in%202019.
      wakingSecInHumanLife: 1660000000,
      totalLivesSaved: null,
      animationSecond: 0,
      seed: 12345,
    };
  }
  
  componentDidMount(props) {    
    const queryString = window.location.search.substring(1); // Remove the leading '?'
    const params = qs.parse(queryString);

    this.setState({
      rows: params.rows ? parseInt(params.rows, 10) : this.state.rows,
      columns: params.columns ? parseInt(params.columns, 10) : this.state.columns,
      averageRowHeightInches: params.averageRowHeightInches ? parseFloat(params.averageRowHeightInches) : this.state.averageRowHeightInches,
      averageWalkSpeedMph: params.averageWalkSpeedMph ? parseFloat(params.averageWalkSpeedMph) : this.state.averageWalkSpeedMph,
      passengerFlightsPerYear: params.passengerFlightsPerYear ? parseInt(params.passengerFlightsPerYear, 10) : this.state.passengerFlightsPerYear,
      wakingSecInHumanLife: params.wakingSecInHumanLife ? parseInt(params.wakingSecInHumanLife, 10) : this.state.wakingSecInHumanLife,
      seed: parseInt(params.seed) || this.state.seed,
      animationSecond: 0,
      isAnimating: false,
    });
  }
  
  componentWillUnmount() {
    clearInterval(this.animationInterval);
  }
  
  toggleAnimation = () => {
    this.setState(prevState => {
      if (prevState.isAnimating) {
        // If the animation was running, pause it
        clearInterval(this.animationInterval);
        return { isAnimating: false };
      } else {
        // If the animation was paused, start it
        clearInterval(this.animationInterval);
        this.animationInterval = setInterval(this.updateAnimation, 250);
        return { isAnimating: true };
      }
    });
  };

  runSimulation = () => {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
    
    const plane = new Plane(
      parseInt(this.state.rows), 
      parseInt(this.state.columns), 
      parseFloat(this.state.averageWalkSpeedMph),
      parseFloat(this.state.averageRowHeightInches), 
      this.state.seed,
    );
    plane.embark();

    const timeCurrent = plane.disembarkCurrent();
    const timeFuture = plane.disembarkFuture();
    
    const avgSecSaved = (timeCurrent - timeFuture) / 2;

    this.setState({
      plane: plane,
      animationSecond: 0,
      timeCurrent: timeCurrent,
      timeFuture: timeFuture,
      avgSecSavedPerPassenger: avgSecSaved,
      totalLivesSaved: (avgSecSaved * this.state.passengerFlightsPerYear) / this.state.wakingSecInHumanLife,
      isAnimating: true,
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
      
      if (this.state.isAnimating) {
        this.animationInterval = setInterval(this.updateAnimation, 250);
      }

      window.history.pushState({}, '', `?${newQueryString}`);
    });
  }

  updateAnimation = () => {
    const { animationSecond, timeCurrent, timeFuture } = this.state;
    if (animationSecond >= Math.max(timeCurrent, timeFuture)) {
      // Stop the animation if surpassing the max time
      clearInterval(this.animationInterval);
      this.setState({ isAnimating: false });
    } else {
      // Otherwise, continue the animation
      this.setState(prevState => ({ animationSecond: prevState.animationSecond + 1 }));
    }
  }
  
  formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.round(timeInSeconds % 60);
    return `${minutes} minutes ${seconds} seconds`;
  }

  render() {
    return (
      <div className="App">
        <h1><em>Fill and Flush</em> Deplaning Simulator</h1>
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
        <button className="simulate-button" onClick={this.runSimulation}>Run Simulation</button>
        {(this.state.totalLivesSaved !== null) && <div>
            <div id="simulation-statistics">
              <p>Time to deplane status quo: {this.formatTime(this.state.timeCurrent)}</p>
              <p>Time to deplane using <em>Fill and Flush</em> method: {this.formatTime(this.state.timeFuture)}</p>
            </div>
          
            <div id="simulation-player-controls">
              <div>Simulation at {this.state.animationSecond} Seconds</div>
              <div className='player-disclaimer'>Playing at 4x real-time</div>

              <button className="animation-button" onClick={this.toggleAnimation}>
                {this.state.isAnimating ? 'Pause' : 'Start'} Animation
              </button>
            </div>

            <div className='planes-container'>
              <CurrentAnimation 
                plane={this.state.plane} 
                animationSecond={this.state.animationSecond}
              />
              <FutureAnimation 
                plane={this.state.plane}
                animationSecond={this.state.animationSecond}
              />
            </div>
      
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
        </div>}
      </div>
    );
  }
}

export default SimulatePage;


import './App.css';
import React from 'react';
import Plane from './models/Plane';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: 60,
      columns: 6,
      averageRowHeightInches: 31,
      averageWalkSpeedMph: 2.8,
      timeCurrent: null,
      timeFuture: null
    };
  }

  runSimulation = () => {
    const plane = new Plane(
      parseInt(this.state.rows), 
      parseInt(this.state.columns), 
      parseFloat(this.state.averageRowHeightInches), 
      parseFloat(this.state.averageWalkSpeedMph)
    );
    plane.embark();

    const timeCurrent = plane.disembarkCurrent();
    const timeFuture = plane.disembarkFuture();

    this.setState({
      timeCurrent: timeCurrent,
      timeFuture: timeFuture
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
      </div>
    );
  }
}

export default App;

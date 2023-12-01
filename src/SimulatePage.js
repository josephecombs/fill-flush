import React from 'react';
import Modal from 'react-modal';
import qs from 'qs';

import './stylesheets/SimulatePage.css';
import Plane from './models/Plane';
import CurrentAnimation from './CurrentAnimation';
import FutureAnimation from './FutureAnimation';

import facebookIcon from './images/facebook-share-icon.png';
import twitterIcon from './images/twitter-share-icon.png';
import linkedinIcon from './images/linkedin-share-icon.png';

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
      showModal: false,
    };
  }
  
  componentDidMount(props) {    
    Modal.setAppElement('.App'); // assuming '.App' is the parent of your modal

    const queryString = window.location.search.substring(1); // Remove the leading '?'
    const params = qs.parse(queryString);

    try {
      if (window.gtag) {
        window.gtag('event', 'conversion', {
          'send_to': 'AW-960244908/as5qCLDXmPoYEKzZ8MkD', // Conversion tracking ID and label
          'event_name': 'conversion'
        });
      }
    } catch (error) {
      console.error('Error sending conversion event to GA:', error);
    }

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

    let totalSecSaved = 0;
    plane.seats.forEach(row => {
      row.forEach(passenger => {
        const timeSaved = passenger.fillAndFlushBenefit();
        totalSecSaved += timeSaved;
      });  
    });

    const avgSecSaved = totalSecSaved / (plane.rows * plane.columns);

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

      if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') { 
        // Fire a custom Google Analytics event with the parameters
        window.gtag('event', 'run_simulation', {
          'event_category': 'Simulation',
          'event_label': 'Run Simulation',
          'rows': this.state.rows,
          'columns': this.state.columns,
          'averageWalkSpeedMph': this.state.averageWalkSpeedMph,
          'averageRowHeightInches': this.state.averageRowHeightInches,
          'seed': this.state.seed
        });
      }
      
      if (this.state.isAnimating) {
        this.animationInterval = setInterval(this.updateAnimation, 250);
      }

      const hasSeenModal = window.localStorage.getItem('hasSeenModal') === 'true';

      if (!hasSeenModal) {
        setTimeout(() => {
          this.setState({ showModal: true });
          window.localStorage.setItem('hasSeenModal', 'true');
        }, 5000);
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
        <h1><em>Fill & Flush</em> Deplaning Simulator</h1>
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
              <p>Time to deplane using <em>Fill & Flush</em> method: {this.formatTime(this.state.timeFuture)}</p>
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
                  <td>{Math.round(this.state.avgSecSavedPerPassenger)}</td>
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
        <Modal
          isOpen={this.state.showModal}
          onRequestClose={() => this.setState({ showModal: false })}
          contentLabel="My dialog"
        >
          <h2>Help us make a difference!</h2>
          <p>This simulation can save lives. If you can help us get the attention of anyone in the airline industry, please<br/>
            <a href="mailto:joseph.e.combs@gmail.com">reach out to me via email</a>
          </p>

          <p><strong>Share a link to this site with anyone you feel can help:</strong></p>
          <div className="social-share-buttons">
            <a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.fillandflush.com" target="_blank" rel="noopener noreferrer">
              <img src={facebookIcon} alt="Share on Facebook" />
            </a>
            <a href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fwww.fillandflush.com" target="_blank" rel="noopener noreferrer">
              <img src={twitterIcon} alt="Share on Twitter" />
            </a>
            <a href="https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fwww.fillandflush.com" target="_blank" rel="noopener noreferrer">
              <img src={linkedinIcon} alt="Share on LinkedIn" />
            </a>
          </div>
          <button onClick={() => this.setState({ showModal: false })}><b>Return to Simulation</b></button>
        </Modal>
      </div>
    );
  }
}

export default SimulatePage;


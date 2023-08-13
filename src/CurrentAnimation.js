import React, { Component } from 'react';
import Passenger from './components/Passenger'; // Import the Passenger component

import './stylesheets/plane.css';

class CurrentAnimation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // initial state
    };

    // this.drawSeats = this.drawSeats.bind(this);
  }

  componentDidMount() {
    
  }

  getSeatArrangement = (numColumns) => {
    switch (numColumns) {
      case 1: return ['C', '||'];
      case 2: return ['C', '||', 'D'];
      case 3: return ['A', 'C', '||', 'D'];
      case 4: return ['A', 'C', '||', 'D', 'F'];
      case 5: return ['A', 'B', 'C', '||', 'D', 'F'];
      case 6: return ['A', 'B', 'C', '||', 'D', 'E', 'F'];
      default: return [];
    }
  }

  render() {
    const { plane, animationSecond } = this.props;
    const seatArrangement = this.getSeatArrangement(plane.columns);
    const columnLabels = seatArrangement.map((seatLabel, seatIndex) => (
      <div key={seatIndex} className={`column-label seat ${seatLabel === '||' ? 'aisle' : ''}`}>
        {seatLabel !== '||' ? seatLabel : ''}
      </div>
    ));

    const rows = plane.seats.map((row, rowIndex) => (
      <div key={rowIndex} className="row">
        <div className="row-label">{rowIndex + 1}</div>
        {seatArrangement.map((seatLabel, seatIndex) => {

          let displayedSeatKey = '';

          if (seatLabel !== '||') {
            const seatKey = `${seatLabel}${rowIndex + 1}`;
            displayedSeatKey = <Passenger passenger={plane.seatsHash[seatKey]}/>; // Use the Passenger component

            if (plane.seatsHash[seatKey].waitTimeSecondsCurrent < animationSecond) {
              displayedSeatKey = seatKey;
            }
          }

          return (
            <div key={`${rowIndex}-${seatIndex}`} className={`seat ${seatLabel === '||' ? 'aisle' : ''}`}>
              {seatLabel !== '||' ? displayedSeatKey : ''}
            </div>
          );
        })}
      </div>
    ));

    return (
      <div className="plane" id="current-animation">
        <div>Current Animation Placeholder - {this.props.animationSecond}</div>
        <div className="row column-labels">
          <div className="row-label top-left">Z</div>
          {columnLabels}
        </div>
        {rows}
      </div>
    );
  }
}

export default CurrentAnimation;

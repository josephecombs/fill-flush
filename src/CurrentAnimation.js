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

    // construct some aisle object by iterating through the passengers and their attributes

    // figure out which passengers are in the aisle here. for now, just put the passengers in states of:
    // gatheringBelongings, standingStopped, standingWaiting into the constructedAisle in the correct position. 
    // if there's nobody in the aisle in that position, leave the element blank. 
    // the constructedAisle should have as many entries as the rows of the plane itself

    let constructedAisle = new Array(plane.rows).fill(null);

    plane.seats.forEach((row, rowIndex) => {
      row.forEach((passenger) => {
        const deplaningPhase = passenger.statusQuoDeplaningPhase(animationSecond);
    
        // Check if the passenger is in one of the phases corresponding to being in the aisle
        if (['gatheringBelongings', 'standingStopped', 'standingWaiting'].includes(deplaningPhase)) {
          constructedAisle[rowIndex] = passenger; // Place the passenger in the aisle at the corresponding row position
        }

        if (['walking'].includes(deplaningPhase)) {
          let approximateAislePosition = rowIndex;

          let secondsSinceWalkStart = animationSecond - passenger.statusQuoTracker.walkingStart;
          let timeWalking = passenger.statusQuoTracker.walkingEnd - passenger.statusQuoTracker.walkingStart;

          let proportionComplete = secondsSinceWalkStart / timeWalking;
          let proportionRemaining = 1 - proportionComplete;

          approximateAislePosition = Math.round(rowIndex * proportionRemaining)

          constructedAisle[approximateAislePosition] = passenger; // Place the passenger in the aisle at the corresponding row position
        }
      });
    });                

    const rows = plane.seats.map((row, rowIndex) => (
      <div key={rowIndex} className="row">
        <div className="row-label">{rowIndex + 1}</div>
        {seatArrangement.map((seatLabel, seatIndex) => {

          let displayedSeatKey = '';
          let aisleTile = 'A';

          if (seatLabel !== '||') {
            const seatKey = `${rowIndex + 1}${seatLabel}`;
            displayedSeatKey = <Passenger passenger={plane.seatsHash[seatKey]} deplaningPhase={'seated'}/>;

            if (plane.seatsHash[seatKey].statusQuoDeplaningPhase(animationSecond) !== 'seated') {
              displayedSeatKey = seatKey;
            }
          } else {
            if (constructedAisle[rowIndex]) {
              aisleTile = <Passenger passenger={constructedAisle[rowIndex]} deplaningPhase={constructedAisle[rowIndex].statusQuoDeplaningPhase(animationSecond)}/>;
            } else {
              aisleTile = '↑';
            }
          }

          return (
            <div key={`${rowIndex}-${seatIndex}`} className={`seat ${seatLabel === '||' ? 'aisle' : ''}`}>
              {seatLabel !== '||' ? displayedSeatKey : aisleTile}
            </div>
          );
        })}
      </div>
    ));

    // Collect passengers who are off the plane
    const offPlanePassengers = Object.values(plane.seatsHash)
      .filter(passenger => passenger.waitTimeSecondsCurrent < animationSecond)
      .sort((a, b) => a.waitTimeSecondsCurrent - b.waitTimeSecondsCurrent); // Sort by waitTimeSecondsCurrent

    return (
      <div className="plane-container">
        <div className="simulation-heading">Status Quo:</div>
        <div className="plane" id="current-animation">
          <div className="row column-labels">
            <div className="row-label top-left">Z</div>
            {columnLabels}
          </div>
          {rows}
          <div className="gutter">
            <div className="gutter-label">Off Plane:</div>
            <div className="exited-passengers">
              {offPlanePassengers.map((passenger, index) => (
                <Passenger 
                  key={index} 
                  passenger={passenger} 
                  deplaningPhase={'exited'}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CurrentAnimation;

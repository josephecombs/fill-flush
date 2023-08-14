import React from 'react';

const Passenger = ({ deplaningPhase }) => {
  switch (deplaningPhase) {
    case 'seated': return <span>🧘</span>;
    case 'gatheringBelongings': return <span>🧍🧳</span>;
    case 'standingStopped': return <span>🧍</span>;
    case 'standingWaiting': return <span>🧍🕐</span>;
    case 'walking': return <span>🚶</span>;
    case 'exited': return <span>😃</span>;
    default: return <span>🧑</span>;
  }
};

export default Passenger;
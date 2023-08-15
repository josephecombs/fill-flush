import React from 'react';

const Passenger = ({ passenger, deplaningPhase }) => {
  const benefitValue = passenger.fillAndFlushBenefit();
  const benefitLabel = benefitValue < 0 ? 'Penalty' : 'Benefit';
  const absoluteBenefitValue = Math.abs(benefitValue);

  const minutes = Math.floor(absoluteBenefitValue / 60);
  const seconds = absoluteBenefitValue % 60;

  const timeDisplay = minutes > 0 ? `${minutes} minutes, ${seconds} seconds` : `${seconds} seconds`;

  const tooltipContent = (
    <div className='tooltip-content'>
      <div>Seat: {passenger.seat}</div>
      <div>Fill and Flush {benefitLabel}: {timeDisplay}</div>
    </div>
  );
  
  let emoji;
  switch (deplaningPhase) {
    case 'seated': emoji = '🧘'; break;
    case 'gatheringBelongings': emoji = '🧳'; break;
    case 'standingStopped': emoji = '🧍'; break;
    case 'standingWaiting': emoji = '🕐'; break;
    case 'walking': emoji = '🚶'; break;
    case 'exited': emoji = '😃'; break;
    default: emoji = '🧑';
  }

  return (
    <div className="passenger-container">
      <span>{emoji}</span>
      <div className="passenger-tooltip">{tooltipContent}</div>
    </div>
  );
};

export default Passenger;

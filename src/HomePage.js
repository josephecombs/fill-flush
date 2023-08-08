import React from 'react';
import './stylesheets/HomePage.css';

function HomePage() {
  return (
    <div className="homepage-container">
      <h1>Welcome to the "Fill and Flush" De-Planing Simulator!</h1>
      <p>This tool simulates the process of passengers deplaning an aircraft. It allows you to compare the time taken to deplane using the current method and a proposed 'Fill and Flush' method. By adjusting different parameters, you can optimize the deplaning process and save precious time.</p>
      <p>Click <a href="/simulate">here</a> to start simulating.</p>
    </div>
  );
}

export default HomePage;
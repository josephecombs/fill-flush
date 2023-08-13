import React from 'react';
import './stylesheets/HomePage.css';
import { Link } from 'react-router-dom'; // Import Link to create a navigable button

function HomePage() {
  return (
    <div className="homepage-container">
      <h1>Welcome to the "Fill and Flush" De-Planing Simulator!</h1>
      <div>
        <h2>Fill and Flush Deplaning Method</h2>
        <p>The Fill and Flush deplaning method is a strategy used to disembark passengers from an aircraft. It's designed to optimize the process by reducing the time taken and enhancing the overall efficiency.</p>

        <h3>1. Fill Phase:</h3>
        <ul>
          <li>Occupying the Aisle: Passengers fill the aisle, starting from the front and moving towards the back.</li>
          <li>Aisle Dynamics: Passengers in the aisle move towards the exit as space becomes available.</li>
        </ul>

        <h3>2. Flush Phase:</h3>
        <ul>
          <li>Emptying the Aisle: The aisle is cleared of passengers, allowing for the next wave to fill the aisle.</li>
          <li>Sequential Movement: Passengers move towards the exit in a sequential manner.</li>
        </ul>

        <h3>3. Wave System:</h3>
        <ul>
          <li>Waves of Passengers: The process is carried out in waves, with each wave consisting of a group of passengers.</li>
          <li>Wave Synchronization: The waves are coordinated to ensure systematic filling and flushing of the aisle.</li>
        </ul>

        <h3>4. Optimization:</h3>
        <ul>
          <li>Time Efficiency: The method minimizes total deplaning time.</li>
          <li>Space Utilization: It takes advantage of the aisle space, improving the flow of passengers towards the exit.</li>
          <li>Orderly Process: The fill and flush method promotes an orderly deplaning process.</li>
        </ul>

        <p>Conclusion: The Fill and Flush deplaning method represents an innovative approach to aircraft disembarkation, using a systematic fill-and-flush process to streamline the flow of passengers. It aims to enhance efficiency, reduce deplaning time, and improve the overall passenger experience.</p>

        <p>Contribute: this website is a github page. Please contribute to it <a href="https://github.com/josephecombs/fill-flush/">here</a>.</p>
      </div>
      <Link to="/simulate" className="simulate-button">Start Simulating</Link>
    </div>
  );
}

export default HomePage;

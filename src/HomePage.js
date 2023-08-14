import React from 'react';
import './stylesheets/HomePage.css';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="homepage-container">
      <h1>Welcome to the "Fill and Flush" De-Planing Simulator!</h1>

      <section className="intro">
        <h2>Introduction</h2>
        <p>The Fill and Flush deplaning method was developed to revolutionize the way passengers disembark from aircraft. This method minimizes deplaning time by maximizing aisle space utilization. <Link to="/simulate">Explore the simulator</Link> to see how it works.</p>
      </section>

      <section className="status-quo">
        <h2>Status Quo</h2>
        <p>The traditional deplaning method, based on exiting row by row, has proven to be inefficient and time-consuming. The fundamental issue with the status quo is that the entire plane waits for each passenger to gather belongings, dramatically reducing the flow of passengers relative to potential flow.</p>
      </section>

      <section className="fill-and-flush">
        <h2>Fill and Flush Method</h2>
        <p>The Fill and Flush method represents a meticulously coordinated approach to deplaning, involving distinct phases of filling the aisle, gathering belongings, and columnar exit. Here's how it works:</p>

        <h3>1. Fill Phase:</h3>
        <ul>
          <li><strong>Column-by-Column Direction:</strong> A flight attendant directs the most aisle-adjacent column of passengers to stand and fill the aisle. This is done one column at a time, in a middle-out pattern.</li>
          <li><strong>Gathering Belongings:</strong> Passengers in the aisle gather their belongings from overhead compartments or under seats. Meanwhile, those not in the called column wait for their wave.</li>
          <li><strong>Waiting:</strong> Once all passengers in the current column have gathered their belongings, they wait until the entire column is ready. If a passenger is not ready, they must stay in their seat and exit in a subsequent flush.</li>
        </ul>

        <h3>2. Flush Phase:</h3>
        <ul>
          <li><strong>Sequential Exit:</strong> Passengers currently standing in the aisle exit the plane all at once, walking off with as little congestion as possible.</li>
          <li><strong>Next Column Direction:</strong> Only after the final person standing has exited does the flight attendant direct the next column to stand and fill the aisle.</li>
        </ul>

        <h3>3. Wave System:</h3>
        <ul>
          <li><strong>Waves of Passengers:</strong> The process repeats until all columns have exited. Passengers wishing to deplane as a group skip earlier flushes and make trades if available with passengers not in groups.</li>
        </ul>

        <p>The Fill and Flush method's structured approach ensures that the aisle space is maximally utilized.</p>
      </section>

      <section className="superiority">
        <h2>Why Fill and Flush is Superior</h2>
        <p><strong>In simulation, Fill and Flush reduces deplaning time by approximately 50%</strong></p>
        <p>Fill and Flush reduces deplaning time by making better use of the aisle space and coordinating passenger movement. Unlike the traditional method, where passengers gather belongings one at a time, causing a slow, continuous line, the Fill and Flush method allows passengers to prepare to exit in groups. This is like having multiple checkout lanes at a grocery store instead of just one, allowing more people to be served at the same time. It leads to a quicker and more efficient deplaning process.</p>
      </section>

      <section className="discussion">
        <h2>Discussion Points</h2>
        <ul>
          <li>How to educate passengers</li>
          <li>How to accommodate the elderly, people with children, and groups.</li>
          <li>Challenges in modeling randomness in gathering belongings and walking behavior.</li>
          <li>Considerations for large international flights, first-class passengers, and potential inter-passenger conflict.</li>
        </ul>
      </section>

      <section className="conclusion">
        <h2>Conclusion</h2>
        <p>The Fill and Flush deplaning method is a groundbreaking approach to aircraft disembarkation. By employing a systematic fill-and-flush process, it streamlines passenger flow, enhances efficiency, and represents a significant advancement in the field of commercial aviation.</p>
      </section>

      <p>Contribute: This website is a GitHub page. Please contribute to it <a href="https://github.com/josephecombs/fill-flush/">here</a>.</p>

      <Link to="/simulate" className="simulate-button">Start Simulating</Link>
    </div>
  );
}

export default HomePage;

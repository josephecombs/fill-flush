import React from 'react';
import './stylesheets/HomePage.css';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="homepage-container">
      <h1>Welcome to the <em>Fill & Flush</em> Deplaning Simulator!</h1>

      <section className="intro">
        <h2>Introduction</h2>
        <p>The <em>Fill & Flush</em> deplaning method was developed to revolutionize the way passengers exit aircraft. This method minimizes total deplaning time by maximizing aisle space utilization. <Link to="/simulate">Explore the simulator</Link> to see how it works.</p>
      </section>

      <section className="status-quo">
        <h2>Status Quo</h2>
        <p>The traditional deplaning method, based on exiting row by row, has proven to be inefficient and time-consuming. <strong>The fundamental issue with the status quo is that the entire plane waits for each passenger</strong> to gather belongings, <strong><em>dramatically reducing</em></strong> the flow of passengers relative to potential flow.</p>
      </section>

      <section className="fill-and-flush">
        <h2><em>Fill & Flush</em> Method</h2>
        <p>The <em>Fill & Flush</em> method represents a breakthrough in deplaning, involving distinct phases of <em>Fill</em>ing the aisle, gathering belongings, and columnar exit (<em>Flush</em>). Here's how it works:</p>

        <h3>1. <em>Fill</em> Phase:</h3>
        <ul>
          <li><strong>Column-by-Column Process:</strong> A flight attendant, via in-flight announcements, directs the most aisle-adjacent column of passengers to stand and <em>Fill</em> the aisle. This is done one column at a time, in a middle-out pattern.</li>
          <li><strong>Gathering Belongings:</strong> Passengers in the aisle gather their belongings from overhead compartments or under seats. Meanwhile, those not in the called column wait for their wave.</li>
          <li><strong>Waiting:</strong> Once all passengers in the current column have gathered their belongings, they wait until the entire column is ready. If a passenger is not ready, they must stay in their seat and exit in a subsequent flush.</li>
        </ul>

        <h3>2. <em>Flush</em> Phase:</h3>
        <ul>
          <li><strong>Sequential Exit:</strong> Passengers currently standing in the aisle exit the plane all at once, walking off with as little congestion as possible.</li>
          <li><strong>Next Column Direction:</strong> Only after the final person standing has exited does the flight attendant direct the next column to stand and <em>Fill</em> the aisle.</li>
        </ul>

        <h3>3. Wave System:</h3>
        <ul>
          <li><strong>Waves of Passengers:</strong> The process repeats until all columns have exited. Passengers wishing to deplane as a group skip earlier <em>Flushes</em> and make trades if available with passengers not in groups.</li>
        </ul>

        <p>The <em>Fill & Flush</em> method's structured approach ensures that the aisle space is maximally utilized.</p>
      </section>

      <section className="superiority">
        <h2>Why <em>Fill & Flush</em> is Superior</h2>
        <p><strong>In simulation, <em>Fill & Flush</em> reduces deplaning time by approximately 50%</strong></p>
        <p><em>Fill & Flush</em> reduces deplaning time by making better use of the aisle space and coordinating passenger movement. Unlike the traditional method, where passengers gather belongings one at a time, causing a slow, continuous line, the <em>Fill & Flush</em> method allows passengers to prepare to exit in groups. This is like having multiple checkout lanes at a grocery store instead of just one, allowing more people to be served at the same time. It leads to a quicker and more efficient deplaning process.</p>
      </section>

      <section className="discussion">
        <h2>Discussion Topics / Unresolved Issues:</h2>
        <ul>
          <li>How to educate passengers</li>
          <li>How to accommodate the elderly, people with children, and groups.</li>
          <li>Challenges in modeling randomness in gathering belongings and walking behavior.</li>
          <li>Considerations for 2-aisle large international flights, first-class passengers, and potential inter-passenger conflict.</li>
          <li>How First Class is handled.</li>
          <li>Political Economy questions - who wins and who loses? Potential inter-passenger conflict.</li>
          <li>How to train the flight attendant who will be the orchestrator of this process.</li>
        </ul>
      </section>

      <section className="conclusion">
        <h2>Conclusion</h2>
        <p>The <em>Fill & Flush</em> deplaning method is a groundbreaking approach to aircraft deplaning. If you are an airline executive or otherwise in a position to trial this system in real-world situations, please reach out.</p>
      </section>

      <p>Contribute: This website is deployed as a GitHub page. Please contribute to it by opening issues and making pull requests <a href="https://github.com/josephecombs/fill-flush/">here</a>.</p>

      <Link to="/simulate" className="simulate-button">Start Simulating</Link>
    </div>
  );
}

export default HomePage;

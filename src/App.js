import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import Footer from './components/Footer';
import SimulatePage from './SimulatePage';

class App extends Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/simulate" element={<SimulatePage />} />
        </Routes>
        <Footer />
      </Router>
    );
  }
}

export default App;

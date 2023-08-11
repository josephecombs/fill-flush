import React, { Component } from 'react';
import p5 from 'p5';

class CurrentAnimation extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      // initial state
    };

    this.drawSeats = this.drawSeats.bind(this);
  }

  componentDidMount() {
    this.myP5 = new p5(this.Sketch, this.myRef.current);
  }

  getSeatHeight = () => {
    // Define logic to calculate seat height here
    // For example, you can return a fixed value or base it on other properties
    return 20;
  };

  Sketch = (p) => {
    p.setup = () => {
      const canvasHeight = (this.props.plane.rows + 2) * this.getSeatHeight();
      p.createCanvas(300, canvasHeight);
      // Additional setup code
    };

    p.draw = () => {
      p.background(250);
      this.drawSeats(p);
      // Draw seats and passengers
      // Update animation state
    };

    // Additional functions to handle drawing and animation
  };

  drawSeats = (p) => {
    const { plane } = this.props;
    const { seats, columns } = plane;
    const seatWidth = 30;
    const seatHeight = this.getSeatHeight();
    const gap = 30; // Gap for the aisle

    const seatLabels = this.getSeatArrangement(columns);
    const leftLabelWidth = 16;

    seatLabels.forEach((label, colIndex) => {
      let x = colIndex * seatWidth + seatWidth / 2 + leftLabelWidth;
      p.text(label, x, 15);
    });

    // Draw seats and row labels
    seats.forEach((row, rowIndex) => {
      p.text(rowIndex + 1, 5, seatHeight * (rowIndex + 1) + seatHeight / 1.5); // Row label

      seatLabels.forEach((seatLabel, colIndex) => {
        if (seatLabel !== '||') {
          let x = colIndex * seatWidth + 22; // Offset for row labels
          const y = rowIndex * seatHeight + 20; // Offset for column labels
          p.rect(x, y, seatWidth, seatHeight);
        } else {
          let x = colIndex * seatWidth + 22; // Offset for row labels
          const y = rowIndex * seatHeight + 20; // Offset for column labels
          p.rect(x, y, seatWidth, seatHeight);
        }
      });
    });
  };

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
    const { plane } = this.props;
    const seatArrangement = this.getSeatArrangement(plane.columns);
    const rows = plane.seats.map((row, rowIndex) => (
      <tr key={rowIndex}>
        {seatArrangement.map((seatPosition, seatIndex) => {
          if (seatPosition === 'AISLE') {
            return <td key={`${rowIndex}-${seatIndex}-aisle`} className="aisle">A</td>;
          }
          const seat = row.find(seat => seat.position === seatPosition);
          return <td key={`${rowIndex}-${seatIndex}`}>{seat ? seat.seat : ''}Z</td>;
        })}
      </tr>
    ));

    return (
      <div>
        Current Animation Placeholder - {this.props.animationSecond}
        <div ref={this.myRef}></div>
      </div>
    );
  }
}

export default CurrentAnimation;

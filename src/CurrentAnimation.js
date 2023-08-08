import React, { Component } from 'react';

class CurrentAnimation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // initial state
    };
  }

  // lifecycle methods, event handlers, etc.

  render() {
    return (
      <div>
        Current Animation Placeholder - {this.props.animationSecond}
      </div>
    );
  }
}

export default CurrentAnimation;
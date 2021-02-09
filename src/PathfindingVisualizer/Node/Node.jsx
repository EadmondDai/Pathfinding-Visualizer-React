import React, {Component} from 'react';

import './Node.css';

export default class Node extends Component {
  render() {
    const {
      col,
      isFinish,
      isStart,
      isWall,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      row,
    } = this.props;
    let extraClassName;
    if (isFinish) {
      extraClassName = 'node-finish';
    } else if (isStart) {
      extraClassName = 'node-start';
    } else if (isWall) {
      extraClassName = 'node-wall';
    } else {
      extraClassName = '';
    }

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}></div>
    );
  }
}

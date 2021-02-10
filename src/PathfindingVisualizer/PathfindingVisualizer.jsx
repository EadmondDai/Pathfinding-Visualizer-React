import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra} from '../algorithms/dijkstra';
import {DFS} from '../algorithms/DFS';
import {getNodesInShortestPathOrder} from '../util/util';

import './PathfindingVisualizer.css';

const ROW_COUNT = 20;
const COL_COUNT = 50;

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

const ANIMATION_SPEED_MS = 10;

const curAlgorithm = ['DFS', 'BFS', 'Dijkstra Algorithm', 'A*'];

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grids: [],
      mouseIsPressed: false,
      algorithmId: 1, // 1. DFS 2. BFS 3.Dijkstra 4 A*
    };
  }

  componentDidMount() {
    this.resetGrid();
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grids, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grids, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  onDropDownChange(evt) {
    let targetId = evt.target.value;
    this.setState({algorithmId: parseInt(targetId)});
  }

  animatePath(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          // DFS don't gurrantee shortest path.
          this.animateShortestPath(nodesInShortestPathOrder);
        }, ANIMATION_SPEED_MS * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, ANIMATION_SPEED_MS * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeAlgorithem(algorithmId) {
    if (algorithmId === 1) {
      this.visualizeDFS();
    } else if (algorithmId === 2) {
    } else if (algorithmId === 3) {
      this.visualizeDijkstra();
    } else {
    }
  }

  resetGrid() {
    const grids = getNewGrid();
    this.setState({grids: grids});
  }

  visualizeDFS() {
    const {grids} = this.state;
    const startNode = grids[START_NODE_ROW][START_NODE_COL];
    const finishNode = grids[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = DFS(grids, startNode, finishNode);
    // DFS don't gurrantee shortest pass.
    // Using DFS finding shortest pass will be very time consuming.
    const firstPath = getNodesInShortestPathOrder(finishNode);
    this.animatePath(visitedNodesInOrder, firstPath);
  }

  visualizeBFS() {}

  visualizeAStar() {}

  visualizeDijkstra() {
    const {grids} = this.state;
    const startNode = grids[START_NODE_ROW][START_NODE_COL];
    const finishNode = grids[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grids, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animatePath(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render() {
    const {grids, mouseIsPressed, algorithmId} = this.state;

    return (
      <>
        <select
          name="Algorithm"
          onChange={evt => this.onDropDownChange(evt)}
          class="AlgorithmDropDownMenu">
          <option id="1" value="1">
            Depth First Search
          </option>
          <option id="2" value="2">
            Breadth First Search
          </option>
          <option id="3" value="3">
            Dijkstra's Alotithm
          </option>
          <option id="4" value="4">
            A*
          </option>
        </select>
        <button onClick={() => this.visualizeAlgorithem(algorithmId)}>
          Visualize {curAlgorithm[algorithmId - 1]}
        </button>
        <button
          onClick={() => {
            this.resetGrid();
          }}>
          Rest Grid
        </button>
        <div className="grid">
          {grids.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getNewGrid = () => {
  const grid = [];
  for (let row = 0; row < ROW_COUNT; row++) {
    const currentRow = [];
    for (let col = 0; col < COL_COUNT; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

import {getUnvisitedNeighbors} from '../util/util';

export function DFS(grids, startNode, endNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  DFSHelper(grids, startNode, endNode, visitedNodesInOrder);
  return visitedNodesInOrder;
}

function DFSHelper(grids, curNode, endNode, visitedNodesInOrder) {
  if (visitedNodesInOrder[visitedNodesInOrder.length - 1] === endNode) return;
  if (curNode === endNode) {
    visitedNodesInOrder.push(curNode);
    return;
  }
  if (curNode.distance === Infinity) return;
  if (curNode.isWall) return;
  if (curNode.isVisited) return;

  curNode.isVisited = true;
  visitedNodesInOrder.push(curNode);
  let neighbors = getUnvisitedNeighbors(curNode, grids);

  for (const neighborNode of neighbors) {
    if (neighborNode.distance > curNode.distance + 1) {
      neighborNode.previousNode = curNode;
      neighborNode.distance = curNode.distance + 1;
    }
    DFSHelper(grids, neighborNode, endNode, visitedNodesInOrder);
  }
}

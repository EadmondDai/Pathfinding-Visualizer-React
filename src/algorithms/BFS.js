import {getUnvisitedNeighbors} from '../util/util';

export function BFS(grids, startNode, endNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  BFSHelper(grids, startNode, endNode, visitedNodesInOrder);
  return visitedNodesInOrder;
}

function BFSHelper(grids, startNode, endNode, visitedNodesInOrder) {
  if (startNode === endNode) {
    visitedNodesInOrder.push(startNode);
    return;
  }

  let visiteQueue = [];
  visiteQueue.push(startNode);
  while (visiteQueue.length > 0) {
    let curNode = visiteQueue.shift();
    if (curNode.isVisited) continue;

    curNode.isVisited = true;
    visitedNodesInOrder.push(curNode);
    if (curNode === endNode) {
      return;
    }

    let neighbors = getUnvisitedNeighbors(curNode, grids);
    for (const neighborNode of neighbors) {
      if (neighborNode.isWall) continue;

      if (neighborNode.distance > curNode.distance + 1) {
        neighborNode.previousNode = curNode;
        neighborNode.distance = curNode.distance + 1;
      }
      visiteQueue.push(neighborNode);
    }
  }
}

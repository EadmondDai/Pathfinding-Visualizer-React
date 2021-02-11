import {getUnvisitedNeighbors, swap} from '../util/util';

export function AStar(grids, startNode, endNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  AStarHelper(grids, startNode, endNode, visitedNodesInOrder);
  return visitedNodesInOrder;
}

function AStarHelper(grids, startNode, endNode, visitedNodesInOrder) {
  if (startNode === endNode) {
    visitedNodesInOrder.push(startNode);
    return;
  }

  let toVisit = [];
  startNode.distanceToStart = 0;
  startNode.estimatedDistance = getNodeDistance(startNode, endNode);
  toVisit.push(startNode);

  while (toVisit.length > 0) {
    let curNode = toVisit.shift();
    if (curNode.isVisited) continue;

    curNode.isVisited = true;
    visitedNodesInOrder.push(curNode);
    if (curNode === endNode) return;

    let neighbors = getUnvisitedNeighbors(curNode, grids);
    for (let neighborNode of neighbors) {
      if (neighborNode.isWall) continue;

      if (
        isNaN(neighborNode.distanceToStart) ||
        neighborNode.distanceToStart > curNode.distanceToStart + 1
      ) {
        neighborNode.distanceToStart = curNode.distanceToStart + 1;
        const dist = getNodeDistance(neighborNode, endNode);
        console.log(dist);
        neighborNode.estimatedDistance = neighborNode.distanceToStart + dist;
        neighborNode.previousNode = curNode;
      }
      toVisit.push(neighborNode);
    }
    forwardMinNode(toVisit);
  }
}

function getNodeDistance(node1, node2) {
  return Math.abs(node1.row - node2.row) + Math.abs(node1.col - node2.col);
}

function forwardMinNode(toVisit) {
  let minValue = Number.MAX_VALUE;
  let minIdx;
  for (let i = 0; i < toVisit.length; ++i) {
    const node = toVisit[i];
    if (node.estimatedDistance < minValue) {
      minValue = node.estimatedDistance;
      minIdx = i;
    }
  }
  swap(toVisit, 0, minIdx);
}

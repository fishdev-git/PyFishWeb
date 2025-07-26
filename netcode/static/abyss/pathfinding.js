//this file is responsible for the pathfinding

class node {
  constructor(pos, spent_cost, total_cost, prev_pos) {
    this.pos = pos;
    this.spent_cost = spent_cost;
    this.total_cost = total_cost;
    this.prev_pos = prev_pos;
  }
}

class vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function isSameVector(v1, v2) {
  return v1.x === v2.x && v1.y === v2.y;
}

function hashVector(v) {
  return v.x.toString() + "," + v.y.toString();
}

/////////////////////////////////////////////////////////////////////////////

function estimatePathCost(start_pos, end_pos) {
  let cost_x = Math.abs(start_pos.x - end_pos.x);
  let cost_y = Math.abs(start_pos.y - end_pos.y);

  return cost_x + cost_y; //Math.max(cost_x, cost_y); // Use if diagonals allowed
}

function hasLowerCostPath(node_map, pos, total_cost) {
  if (!node_map.has(hashVector(pos))) return false;

  let node = node_map.get(hashVector(pos));
  return node.total_cost <= total_cost;
}

function findBestPath(map, start_pos, end_pos) {
  // Create search nodes map
  let search_nodes = new Map();

  let spent_cost = 0;
  let total_cost = spent_cost + estimatePathCost(start_pos, end_pos);
  let start_node = new node(start_pos, spent_cost, total_cost, null);

  search_nodes.set(hashVector(start_pos), start_node);

  // Create visited nodes map
  let visited_nodes = new Map();

  return _findBestPath(map, start_pos, end_pos, search_nodes, visited_nodes);
}

function _findBestPath(map, start_pos, end_pos, search_nodes, visited_nodes) {
  // If we run out of search nodes, then there is no path
  if (search_nodes.size == 0) return [];

  // Remove lowest cost node from search nodes
  let min_node = null;

  for (let node of search_nodes.values()) {
    if (min_node == null) min_node = node;
    else if (node.total_cost < min_node.total_cost) min_node = node;
  }

  search_nodes.delete(hashVector(min_node.pos));

  // Update visited nodes keeping lowest cost path
  if (!hasLowerCostPath(visited_nodes, min_node.pos, min_node.total_cost))
    visited_nodes.set(hashVector(min_node.pos), min_node);

  // Return path if lowest cost node is the end node
  if (isSameVector(min_node.pos, end_pos)) {
    let path = [];

    while (!isSameVector(min_node.pos, start_pos)) {
      path.push(min_node.pos);
      min_node = visited_nodes.get(hashVector(min_node.prev_pos));
    }
    path.push(start_pos);
    path.reverse();

    return path;
  }

  // Add all legal moves to the list of search nodes
  let moves = [
    new vector(0, -1),
    new vector(0, 1),
    new vector(-1, 0),
    new vector(1, 0),
  ];

  for (var i = 0; i < moves.length; i++) {
    let new_pos = new vector(
      min_node.pos.x + moves[i].x,
      min_node.pos.y + moves[i].y
    );

    // Don't search positions off the map
    if (
      new_pos.x < 0 ||
      new_pos.x >= map[0].length ||
      new_pos.y < 0 ||
      new_pos.y >= map.length
    )
      continue;

    // Don't search positions that are not walkable
    if (map[new_pos.y][new_pos.x] != 0) continue;

    // Don't search new positions that have already been visited
    if (visited_nodes.has(hashVector(new_pos))) continue;

    // Only add new nodes if they have a lower cost than ones already in search nodes
    let new_spent_cost = min_node.spent_cost + 1;
    let new_total_cost = new_spent_cost + estimatePathCost(new_pos, end_pos);

    if (!hasLowerCostPath(search_nodes, new_pos, new_total_cost)) {
      let new_node = new node(
        new_pos,
        new_spent_cost,
        new_total_cost,
        min_node.pos
      );
      search_nodes.set(hashVector(new_pos), new_node);
    }
  }

  // Repeat until the end node is found
  return _findBestPath(map, start_pos, end_pos, search_nodes, visited_nodes);
}

export default class D3Node {
  static ID_PREFIX = "node";

  static getId(id) {
    return this.ID_PREFIX + id;
  }

  constructor(id, seq, x, y, width, height, isVisited, isObstacle) {
    this.id = id;
    this.seq = seq;
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.isVisited = isVisited;
    this.isObstacle = isObstacle;
    this.cost = 0;
    this.className = this.isObstacle
      ? "obstacle"
      : this.isVisited
      ? "visited"
      : "unvisited";
  }
}

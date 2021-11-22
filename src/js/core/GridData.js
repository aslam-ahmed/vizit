export default class GridData {
  constructor(obstacleVal) {
    this.obstacleVal = obstacleVal;
    this.data = new Array();
  }

  addRow(row) {
    if (Array.isArray(row)) {
      if (this.data.length === 0) {
        this.columnLength = row.length;
      } else if (row.length !== this.columnLength) {
        throw new Error(`Invalid length, should be ${this.columnLength}`);
      }
    } else {
      throw new Error(`Invalid object, should be an Array`);
    }

    this.data.push(row);
  }

  rows() {
    return this.data ? this.data.length : 0;
  }

  columns() {
    return this.columnLength ? this.columnLength : 0;
  }

  getNeighbours(index) {
    const DIR = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];

    const neighbours = [];
    for (const dir of DIR) {
      const neighbour = { x: dir.x + index.x, y: dir.y + index.y };
      if (this.isValidNeighbour(neighbour)) {
        neighbours.push(neighbour);
      }
    }

    return neighbours;
  }

  isValidNeighbour(point) {
    return (
      point.x > -1 &&
      point.x < this.rows() &&
      point.y > -1 &&
      point.y < this.columns() &&
      !this.isObstacle(point)
    );
  }

  isObstacle(point) {
    if (
      this.data[point.x][point.y] &&
      (!this.obstacleVal ||
        this.data[point.x][point.y].toUpperCase() !==
          this.obstacleVal.toUpperCase())
    ) {
      return false;
    } else {
      return true;
    }
  }

  static parse(data, obstacleVal) {
    const gridData = new GridData(obstacleVal);
    if (typeof data === "string") {
      const rows = data.trim().split(/\r?\n/);
      for (const row of rows) {
        const columns = row.trim().split("");
        gridData.addRow(columns);
      }
    } else {
      throw new Error("Data must be of type string");
    }

    return gridData;
  }
}

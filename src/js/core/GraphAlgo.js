import { PriorityQueue } from "@datastructures-js/priority-queue";

export class GraphAlgo {
  constructor(data, neighbourFunc, comparator) {
    this.data = data;
    this.neighbourFunc = neighbourFunc
      ? neighbourFunc
      : this.data.getNeighbours;
    this.comparator = comparator;
    this.cameFrom = new Map();
    this.costSoFar = new Map();
  }

  getShortestPath(start, end, visualize) {
    this.cameFrom.set(JSON.stringify(start), undefined);
    this.costSoFar.set(JSON.stringify(start), 0);

    visualize(1);
    visualize(2, `start : ${JSON.stringify(start)}`);
    const pq = this.comparator
      ? new PriorityQueue(this.comparator)
      : new PriorityQueue();

    visualize(3);
    pq.enqueue({ point: start, priority: 0, seq: 0 });

    let pathFound = false;
    let counter = 0;
    let cost = -1;

    main: while (!pq.isEmpty()) {
      visualize(4, "true");
      const current = pq.dequeue();
      visualize(5, `v : ${JSON.stringify(current.point)}`, current);

      const neighbours = this.neighbourFunc.call(this, current.point);
      let neighbourCount = neighbours.length;

      for (let next of this.neighbourFunc.call(this, current.point)) {
        visualize(6, `${neighbourCount--} Edges`);
        const newCost = this.costSoFar.get(JSON.stringify(current.point)) + 1;
        const nextPointStr = JSON.stringify(next.point);

        if (this.isJsonEqual(next.point, end)) {
          pathFound = true;
          cost = newCost;
          this.cameFrom.set(nextPointStr, current.point);
          visualize(7, "true");
          visualize(8, `end : ${nextPointStr}`);
          break main;
        } else {
          visualize(7, `end: ${JSON.stringify(end)} = false`);
        }

        if (
          !this.costSoFar.has(nextPointStr) ||
          newCost < this.costSoFar.get(nextPointStr)
        ) {
          visualize(9, `w : ${nextPointStr} = true`, next);
          visualize(10, `w : ${nextPointStr} = visited`, {
            id: `${next.point.x}-${next.point.y}`,
            cost: newCost,
            symbol: next.symbol,
          });
          this.costSoFar.set(nextPointStr, newCost);
          this.cameFrom.set(nextPointStr, current.point);
          next.priority = newCost;
          next.seq = counter++;
          pq.enqueue(next);
          visualize(11);
        } else {
          visualize(9, `w : ${nextPointStr} = false`, next);
        }
      }
    }

    let path = new Array();
    if (pathFound) {
      while (!this.isJsonEqual(start, end)) {
        path.unshift(end);
        end = this.cameFrom.get(JSON.stringify(end));
      }
      path.unshift(start);
    }

    return { path: path, cost: cost };
  }

  isJsonEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }
}

import GD from "../js/GridData.js";
import { GraphAlgo } from "../js/GraphAlgo.js";

const dataStr = `. . . X . . . . . . X X . X . . . . . . . . . . . X X . . . . X . X X . . . . . 
. X . . . . . . . . . . . . . . X . . . X X . . X . . . X . . . . . . . . X . X 
. . . . . . X . . . . X . . . . X . . . . . . . . . X . . . . . . . . . . . X . 
. X . X . X . . X . . . . . . . . X . . . . . X . X . . . X . . . . . X . . X . 
. . . . X . X . X . . . X . . . . . . . . . . X . . . . . . . . . . X . . . . . 
. . X . . . . . . X . . . . X . . . . X . . . X . . . . X . X . X . . . . X X . 
. . . X . . . . X . . . . . . . X . . X X X . . . . . . . X . X . . . . . X . . 
. . . X . X . . . . . . . . . X . X . . . . X . . . X . . . . . . . . . X . . . 
X X X X . . X . . . . . . X . X X . . . . . . X . X . . . . . . X X . X . . X X 
. X . . . . . . . . X . . . . X . X . . . . . . X . . X . . . . X X . . . . X . 
. . . X . X . . X . X . . . . . X . . . X . . . . X . . X . . . . X . . . . . . 
. . . . X X . X . . . . . X . X X . X . . . X . X . . . . . X . X . . . . . . . 
. X . X . X . . . . . . . . . . . . . . X . . . . . X X . . X . . . . . . . . . 
. . X . . . . . . . . . . . . . . . X . . . . . . X . . . . . . . . X X . . . X 
. X . . . . . . X . . . X . X X X X . . . . . X X . . . . . . . . . . . X . . X 
. . . X . . . . X X . . . . X . . . X X . X . . X . . X . . X . . . . . X . . X 
. . . X . . . X . X . . . . . X . . . . . X . . . . . X X X X . . . . . . . . . 
X . . . . . X X . . X . . . . . . . . . . . . . X . X X . X . X X X . . . . . . 
. . . . . X . X . . X . . . . . . . . . . X . X . . X . . . X . X . . . . . . X 
. . . X . . . . . X . . X . . . . . . . . . . . . . X . . . . . . X . . X . . X 
. . . . . . . . X . . . . . . . . . . . . . . . . . . . . . X . . . . X . X . . 
. . . . . . . . . . X . . . . . X X X . . . X X . X . . . . . . . . . . . . . . 
. . . . . . . . X . . X . . . . . . . . . . X . X X X X . . X . . . . . . . . . 
. . X . . X . . . X . . . . . . . X X . . . X . . . . . X . . . X X X . . X . . 
. X . . . . . . . X . . . . . . . . . . . . . . X . . . . X . . . X . . . . X . 
. . . . . . . . . . . . . . . . . X . . . . . X . . . . . . X . . . . . X . . . 
. . . . . . . X . X . X X . . X . X X X . X . . . . . X . . . . . . . . . . X . 
X . . X . . . . . . X . . . . . . . . . . . . . . X . . X . X . . . . . . . X . 
X . . . . . . . . X . . . . . X . . . . . X . . . . X X . . . . . . . X X . . . 
X . . . . . X . . . . . . . . . . . . . . . . . X . . . . . X . . X . . . X X X 
X X X . . X . . X . X . X X . . X . . . . X . . . . . X X X . . X . . . . . . X 
. . . . . . . . . . X . . . . . X . . . . . X X . . . . . . . . . . . . . . . . 
. . X . . . . . . . . . X . . X . . . . . . . . . X . . . X . . . . . X . . . . 
. X . X . . . . X . . . X X . . . . X . . . . . . . . . . . . . . . X . . . . . 
. X . . . . X . . . . X X . X X . . . . . . . . X . . X . . . . . . . . . . . . 
X . . . X . X . . . . . . . . . . . . . . . . X X . . . . . . X . . X . . . . . 
. . X . X . . . . . . . X . X . . X . . . . . X X . . . . . . . . . X . . X . . 
. . . . . . . . . . . . . . . . . . . . . . . . X . . X . X X . . X . . . . . . 
. . . . . . . . X . . X . X . . . . . X . . . . . X . . . . . . X . . . . . . . 
. X . . X . . . . X . X . . . . . . X X . . . . . . . . . . . . . . . . . . . .`;

let data = GD.parse(dataStr, "X");
console.log(this);
const neighbourFun = function (index) {
  const DIR = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  const neighbours = [];
  for (const dir of DIR) {
    let neighbour = { x: dir.x + index.x, y: dir.y + index.y };
    // console.log(this);
    while (this.data.isValidNeighbour(neighbour)) {
      neighbours.push({ data: neighbour, priority: 0 });
      neighbour = { x: neighbour.x + dir.x, y: neighbour.y + dir.y };
    }
  }

  return neighbours;
};

let ga = new GraphAlgo(data, neighbourFun, {
  compare: (o1, o2) => {
    if (o1.priority > o2.priority) return 1;
    else if (o1.priority < o2.priority) return -1;
    else return 0;
  },
});

const path = ga.getShortestPath({ x: 16, y: 8 }, { x: 34, y: 28 });
console.log(`Path Length: ${path.length}`);
// expect(path.length).toBeGreaterThanOrEqual(1);

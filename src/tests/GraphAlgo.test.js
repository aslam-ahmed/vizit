import GD from "../js/GridData";
import { GraphAlgo } from "../js/GraphAlgo";

test("check shortest path when valid", () => {
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

  const neighbourFun = (index) => {
    const DIR = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];

    const isValid = (neighbour, gd) => {
      if (
        neighbour.x > -1 &&
        neighbour.x < gd.columns() &&
        neighbour.y > -1 &&
        neighbour.y < gd.rows() &&
        gd.isObstacle({ x: neighbour.x, y: neighbour.y })
      ) {
        return false;
      } else {
        return true;
      }
    };

    const neighbours = [];
    for (const dir of DIR) {
      const x = dir.x + index.x;
      const y = dir.y + index.y;
      let neighbour = { x: x, y: y };
      while (isValid(neighbour, data)) {
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

  const path = ga.getShortestPath({ x: 8, y: 16 }, { x: 28, y: 34 });
  expect(path.length).toBeGreaterThanOrEqual(1);
});

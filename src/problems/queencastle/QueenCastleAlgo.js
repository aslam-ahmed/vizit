import { D3Grid, D3GridConfig } from "../../js/drawing/D3Grid";
import { GraphAlgo } from "../../js/core/GraphAlgo";
import GridData from "../../js/core/GridData";
import QCATestData from "./QueenCastleTestData.json";
import QueenCastleAlgoDesc from "./QueenCastleAlgoDesc.json";
import AlgoVisualizer from "../../js/core/AlgoVisualizer";

export default class QueenCastleAlgo {
  constructor() {
    this.av = new AlgoVisualizer(this.getAlgoDesc());
  }

  execute() {
    let data = GridData.parse(this.data, "X");

    let grid = new D3Grid(
      data,
      "#grid",
      document.body.offsetHeight * 0.95,
      document.body.offsetHeight * 0.95,
      new D3GridConfig(1, 1, 1, 1)
    );

    this.grid = grid;
    this.av.stopAnimation();
    grid.init();

    const startPoint = this.getGridPoint(this.start);
    const endPoint = this.getGridPoint(this.end);
    const startNodeId = `${startPoint.x}-${startPoint.y}`;
    const endNodeId = `${endPoint.x}-${endPoint.y}`;

    grid.addImage(startNodeId, "./img/start.svg");

    grid.update({
      id: startNodeId,
      cost: 0,
      className: "start",
    });

    grid.addImage(endNodeId, "./img/target.svg");
    grid.update({
      id: endNodeId,
      cost: 0,
      className: "end",
    });

    const neighbourFun = function (index) {
      const DIR = [
        { x: 1, y: 0, symbol: "↓" },
        { x: -1, y: 0, symbol: "↑" },
        { x: 0, y: 1, symbol: "→" },
        { x: 0, y: -1, symbol: "←" },
      ];

      const neighbours = [];
      for (const dir of DIR) {
        let neighbour = {
          x: dir.x + index.x,
          y: dir.y + index.y,
        };
        while (this.data.isValidNeighbour(neighbour)) {
          neighbours.push({
            point: neighbour,
            priority: 0,
            symbol: dir.symbol,
          });
          neighbour = {
            x: neighbour.x + dir.x,
            y: neighbour.y + dir.y,
          };
        }
      }

      return neighbours;
    };

    let ga = new GraphAlgo(data, neighbourFun, {
      compare: (o1, o2) => {
        if (o1.priority > o2.priority) return 1;
        else if (o1.priority < o2.priority) return -1;
        else if (o1.seq > o2.seq) return 1;
        else return -1;
      },
    });

    const result = ga.getShortestPath(
      startPoint,
      endPoint,
      this.visualize.bind(this)
    );
    const path = this.getPathSequence(result.path);

    path.reverse().forEach((element) => {
      this.visualize(0, "", {
        id: element,
        cost: 0,
        className: "path",
      });
    });

    this.visualize(-1, "", result.cost);
  }

  getGridPoint(gridPointStr) {
    const strArray = gridPointStr.trim().split(/\s/);
    if (strArray.length === 2) {
      return { x: +strArray[0], y: +strArray[1] };
    } else {
      throw new Error(
        "Invalid point string must be in form of 2 numbers space separated"
      );
    }
  }

  loadTest(testId) {
    const test = QCATestData[testId];
    this.data = test.data;
    this.start = test.start;
    this.end = test.end;
  }

  getPathSequence(pathPoints) {
    const path = [];
    path.push(pathPoints[0].x + "-" + pathPoints[0].y);
    for (let i = 1; i < pathPoints.length; i++) {
      let last = pathPoints[i - 1];
      let current = pathPoints[i];
      const xVal = current.x - last.x;
      const yVal = current.y - last.y;
      for (let j = 1; j <= Math.abs(xVal + yVal); j++) {
        let nextId;

        if (xVal === 0) {
          nextId = last.x + "-" + (last.y + j * Math.sign(yVal));
        } else {
          nextId = last.x + j * Math.sign(xVal) + "-" + last.y;
        }
        path.push(nextId);
      }
    }

    return path;
  }

  updateSpeed(duration) {
    if (this.av) this.av.speed = duration;
  }

  updateAlgoRun(isDetailed) {
    if (isDetailed) {
      this.av.stepsToShow = [];
    } else {
      this.av.stepsToShow = [10];
    }
  }
  getAlgoDesc() {
    return QueenCastleAlgoDesc.algo;
  }

  visualize(step, desc, data) {
    switch (step) {
      case -1:
        this.av.activateStep(
          step,
          desc,
          function () {
            this.av.updateResult(data);
          }.bind(this)
        );
        break;
      case 0:
        this.av.activateStep(
          step,
          desc,
          function () {
            this.grid.update(data);
          }.bind(this)
        );
        break;

      case 9:
        {
          this.av.activateStep(
            step,
            desc,
            function () {
              const currentNode = document.querySelector(".edge");
              if (currentNode) {
                this.grid.updateClass({ node: currentNode, reset: true });
              }

              const nodeData = this.grid.getNodeData(
                `${data.point.x}-${data.point.y}`
              );
              if (
                nodeData.className !== "start" &&
                nodeData.className !== "end"
              ) {
                this.grid.updateClass({
                  id: `${data.point.x}-${data.point.y}`,
                  className: "edge",
                  isTemp: true,
                });
              }
            }.bind(this)
          );
        }
        break;
      case 5:
        {
          this.av.activateStep(
            step,
            desc,
            function () {
              const currentNode = document.querySelector(".current");
              if (currentNode) {
                this.grid.updateClass({
                  node: currentNode,
                  className: "dequeued",
                });
              }

              const nodeData = this.grid.getNodeData(
                `${data.point.x}-${data.point.y}`
              );
              if (
                nodeData.className !== "start" &&
                nodeData.className !== "end"
              ) {
                this.grid.updateClass({
                  id: `${data.point.x}-${data.point.y}`,
                  className: "current",
                });
              }
            }.bind(this)
          );
        }
        break;
      case 10:
        {
          this.av.activateStep(
            step,
            desc,
            this.grid.update.bind(this.grid),
            data
          );
        }
        break;
      default:
        this.av.activateStep(step, desc);
        break;
    }
  }
}

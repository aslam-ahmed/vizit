import D3Node from "./D3Node";
import { d3 } from "./d3-compact";

export class D3Grid {
  constructor(data, parentId, width, height, config) {
    this.data = data;
    this.parentId = parentId;
    this.width = width;
    this.height = height;
    this.config = config ? config : new D3GridConfig();
    this.prom = Promise.resolve();
  }

  init() {
    const grid = document.getElementById("svg");
    if (grid) grid.remove();

    let xPos = this.config.marginLeft;
    let yPos = this.config.marginTop;
    let seq = 1;

    let nodeWidth = Math.floor(this.width / this.data.columns());
    let nodeHeight = Math.floor(this.height / this.data.rows());

    for (let i = 0; i < this.data.rows(); i++) {
      const rowElement = this.addRow();
      for (let j = 0; j < this.data.columns(); j++) {
        const node = new D3Node(
          `${i}-${j}`,
          seq++,
          xPos,
          yPos,
          nodeWidth,
          nodeHeight,
          false,
          this.data.isObstacle({ x: i, y: j })
        );

        this.addColumn(rowElement, node);

        xPos += nodeWidth;
      }
      yPos += nodeHeight;
      xPos = this.config.marginLeft;
    }
  }

  getTooltip() {
    let grid = document.getElementById("tooltip");
    return grid
      ? d3.select("#tooltip")
      : d3
          .select(this.parentId)
          .append("div")
          .attr("id", "tooltip")
          .attr("class", "tooltip");
  }

  getGrid() {
    let grid = document.getElementById("svg");
    return grid
      ? d3.select("#svg")
      : d3
          .select(this.parentId)
          .append("svg")
          // .attr("viewbox", `0 0 ${this.height} ${this.height}`)
          .attr("width", this.height)
          .attr("height", this.height)
          // .attr("preserveAspectRatio", "none")
          .attr("id", "svg");
    // viewbox= "0 0 600 600" width="100%" height="100%" preserveAspectRatio="xMinYMin meet"
  }

  addRow() {
    return this.getGrid().append("g").attr("class", "row");
  }

  addColumn(rowElement, nodeData) {
    const group = rowElement
      .append("g")
      .datum(nodeData)
      .attr("id", (d) => D3Node.getId(d.id));

    const tt = this.getTooltip();

    group
      .append("rect")
      .attr("class", (d) => d.className)
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("width", (d) => d.width)
      .attr("height", (d) => d.height)
      .style("stroke-width", "0.5")
      .on("mousemove", this.mousemove(tt))
      .on("mouseout", this.mouseout(tt));

    group
      .append("text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("dominant-baseline", "hanging")
      .attr("font-size", (d) => d.height)
      .attr("fill", "white")
      .attr("textLength", (d) => d.width)
      .attr("lengthAdjust", "spacingAndGlyphs")
      .on("mousemove", this.mousemove(tt))
      .on("mouseout", this.mouseout(tt));
  }

  addImage(nodeId, url) {
    d3.select(`#${D3Node.getId(nodeId)}`)
      .append("image")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("width", (d) => d.width)
      .attr("height", (d) => d.height)
      .attr("xlink:href", url)
      .on("mousemove", this.mousemove(this.getTooltip()))
      .on("mouseout", this.mouseout(this.getTooltip()));
  }

  getNodeData(id) {
    const node = d3.select(`#${D3Node.getId(id)}`);
    if (!node.empty()) {
      return node.datum();
    }
  }

  updateClass(event) {
    const element = event.id
      ? d3.select(`#${D3Node.getId(event.id)}`).select("rect")
      : d3.select(event.node);

    element.attr("class", (d) => {
      if (event.isTemp) {
        return event.className;
      } else if (event.reset) {
        return d.className;
      } else {
        return (d.className = event.className);
      }
    });
  }

  updateCurrent(event) {
    const current = d3.select(`.${event.className}`);
    const node = d3.select(`#${D3Node.getId(event.id)}`);
    const element = node.select("rect");

    if (current.node()) {
      current.attr("class", element.attr("class"));
    }

    element.attr("class", (d) => {
      if (d.className === "start" || d.className === "end") {
        return d.className;
      } else {
        return event.className;
      }
    });
  }

  update(event) {
    const node = d3.select(`#${D3Node.getId(event.id)}`);
    const element = node.select("rect");
    const text = node.select("text");
    const cameFromNode = event.cameFromId
      ? d3.select(`#${D3Node.getId(event.cameFromId)}`).select("rect")
      : undefined;

    // this.prom = this.prom
    //   .then(
    //     function () {
    if (cameFromNode) {
      const prev = d3.select(".current");
      if (
        prev.node() &&
        D3Node.getId(prev.node().parentNode.id) !== event.cameFromId
      ) {
        prev.attr("class", "visited");
      }
      cameFromNode.attr("class", "current");
    }

    text.text(function (d) {
      if (event.cost === 0) {
        return this.innerHTML;
      } else {
        d.cost = event.cost;
        return event.className === "start" || event.className === "end"
          ? ""
          : `${d.cost}${event.symbol}`;
      }
    });

    element
      // .transition()
      // .duration(0)
      // .ease(d3.easeLinear)
      // .delay(0)
      .attr("class", (d) => {
        if (event.className) {
          return (d.className = event.className);
        } else if (d.className === "start" || d.className === "path") {
          return d.className;
        } else {
          return (d.className = d.className === "visited" ? "cost" : "visited");
        }
      });
    //       .end();
    //   }.bind(this)
    // )
    // .catch((err) => console.log(err));
  }

  mousemove(tt) {
    return function (event, d) {
      tt.style("left", event.pageX - 50 + "px")
        .style("top", event.pageY - 50 + "px")
        .style("display", "inline-block")
        .html(d.id);
    };
  }

  mouseout(tt) {
    return function (event, d) {
      tt.style("display", "none").html(d.id);
    };
  }
}

export class D3GridConfig {
  constructor(marginLeft = 0, marginTop = 0, delay = 0, duration = 0) {
    this.marginLeft = marginLeft;
    this.marginTop = marginTop;
    this.delay = delay;
    this.duration = duration;
  }
}

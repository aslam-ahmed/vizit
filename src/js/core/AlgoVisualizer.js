export default class AlgoVisualizer {
  constructor(steps, stepsToShow) {
    this.steps = steps;
    this.lastActiveNode = null;
    this.prom = Promise.resolve();
    this.speed = 250;
    this.stepsToShow = stepsToShow;
    this.stepStack = [];
    this.proceed = undefined;
    this.isParkingActive = false;
    this.cancelAnimation = false;
    this.isActive = false;
  }

  generate() {
    this.stepStack = [];
    if (this.steps) {
      const algoDiv = document.getElementById("algo");
      if (algoDiv.hasChildNodes()) {
        algoDiv.firstChild.remove();
      }

      const table = algoDiv.appendChild(document.createElement("table"));
      table.id = "algoTable";
      table.className = "min-w-full border border-gray-400";

      const tBody = table.appendChild(document.createElement("tbody"));
      tBody.className = "bg-gray-200 border-gray-200";

      this.steps.forEach(function (item, index) {
        const tRow = tBody.appendChild(document.createElement("tr"));
        tRow.className = "border border-gray-400 h-6 text-sm";

        const tCell = tRow.appendChild(document.createElement("td"));
        tCell.id = AlgoVisualizer.getStepId(index + 1);

        const span = tCell.appendChild(document.createElement("span"));
        span.innerHTML = item.replaceAll("\t", "&emsp;");

        const desc = tCell.appendChild(document.createElement("span"));
        desc.className = "algoDesc";
        desc.innerHTML = `&emsp;[]`;
      });
    }
  }

  static getStepId(index) {
    return `algoStep-${index}`;
  }

  activateStep(stepNumber, desc, draw, obj) {
    if (this.checkStepEnable(stepNumber)) {
      this.prom = this.prom
        .then(
          function () {
            return new Promise((done) => {
              setTimeout(
                function () {
                  try {
                    this.triggerAnimationState(stepNumber);
                    if (stepNumber > 0) {
                      if (this.lastActiveNode) {
                        this.lastActiveNode.className = "";
                      }

                      this.clearSteps(stepNumber);

                      const stepId = AlgoVisualizer.getStepId(stepNumber);
                      const stepNode = document.getElementById(stepId);
                      if (desc) {
                        stepNode.lastElementChild.innerHTML = `&emsp;[${desc}]`;
                      }

                      stepNode.className = "algoActive";
                      this.lastActiveNode = stepNode;
                      this.stepStack.unshift([stepNumber, stepId]);
                    }

                    if (draw) {
                      draw(obj);
                    }
                  } catch (error) {
                    console.log(error);
                  } finally {
                    if (this.isParkingActive) {
                      this.proceed = done;
                    } else {
                      if (this.cancelAnimation) {
                        this.cancelAnimation = false;
                        throw new Error("animation stopped by user action");
                      } else {
                        done();
                      }
                    }
                  }
                }.bind(this),
                this.speed
              );
            });
          }.bind(this)
        )
        .catch(() => Promise.reject());
    }
  }

  checkStepEnable(id) {
    return (
      id <= 0 ||
      !this.stepsToShow ||
      this.stepsToShow.length === 0 ||
      this.stepsToShow.indexOf(id) !== -1
    );
  }

  play(frameOnly) {
    if (!frameOnly) {
      this.isParkingActive = false;
    }
    if (this.proceed) {
      this.proceed();
    }
  }

  stop() {
    this.isParkingActive = true;
  }

  stopAnimation() {
    if (this.isActive) {
      this.cancelAnimation = !this.isParkingActive;
      this.isParkingActive = false;
      this.prom = Promise.resolve();
    }

    this.clearSteps(1);
    this.Active = false;
  }

  triggerAnimationState(stepNumber) {
    if (
      !this.isActive &&
      (stepNumber == 1 || stepNumber === this.stepsToShow[0])
    ) {
      this.isActive = true;
      this.updateResult();
      window.postMessage("animationStarted");
    } else if (stepNumber === -1) {
      this.isActive = false;
      this.isParkingActive = false;
      window.postMessage("animationStopped");
    }
  }

  clearSteps(stepNumber) {
    while (
      this.stepStack[0] !== undefined &&
      this.stepStack[0][0] > stepNumber
    ) {
      const clearStep = this.stepStack.shift();
      const clearStepNode = document.getElementById(clearStep[1]);
      clearStepNode.lastElementChild.innerHTML = `&emsp;[]`;
    }
  }

  updateResult(result) {
    const resultElement = document.getElementById("result");
    resultElement.innerHTML = result ? result : "";
  }
}

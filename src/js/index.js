import QueenCastleAlgo from "../problems/queencastle/QueenCastleAlgo";

const qca = new QueenCastleAlgo();

window.addEventListener("DOMContentLoaded", function () {
  const tdataInput = document.getElementById("tdata");
  const startInput = document.getElementById("start");
  const endInput = document.getElementById("end");
  const speedInput = document.getElementById("speed");
  const isDetailInput = document.getElementById("isDetailRun");
  const runBtn = document.getElementById("runBtn");
  const error = document.getElementById("error");
  const playBtn = document.getElementById("play");
  const stepBtn = document.getElementById("step");
  qca.av.generate();

  function isEmpty(str) {
    return str.trim().length === 0;
  }

  function showError(val) {
    if (val) {
      error.style = "display : block";
    } else {
      error.style = "display : none";
    }
  }

  function changeControlsAppearance(state) {
    if (state === "play") {
      playBtn.className = "play";
      playBtn.value = "Resume";
      stepBtn.disabled = false;
    } else {
      playBtn.value = "Stop";
      playBtn.className = "stop";
      stepBtn.disabled = true;
    }
  }

  tdataInput.addEventListener("input", () => showError(false));
  startInput.addEventListener("input", () => showError(false));
  endInput.addEventListener("input", () => showError(false));

  speedInput.addEventListener("input", function (e) {
    qca.updateSpeed(e.target.max - e.target.value);
  });

  isDetailInput.addEventListener("change", function (e) {
    qca.updateAlgoRun(e.target.checked);
  });

  runBtn.addEventListener("click", function () {
    if (
      isEmpty(tdataInput.value) ||
      isEmpty(startInput.value) ||
      isEmpty(endInput.value)
    ) {
      showError(true);
    } else {
      showError(false);

      qca.data = tdataInput.value;
      qca.start = startInput.value;
      qca.end = endInput.value;
      qca.updateSpeed(speedInput.max - speedInput.value);
      qca.updateAlgoRun(isDetailInput.checked);
      qca.execute();
      changeControlsAppearance("stop");
    }
  });

  playBtn.addEventListener("click", function () {
    if (playBtn.className === "play") {
      changeControlsAppearance("stop");
      qca.av.play();
    } else {
      changeControlsAppearance("play");
      qca.av.stop();
    }
  });

  stepBtn.addEventListener("click", function () {
    qca.av.play(true);
  });

  document.querySelectorAll(".test-data").forEach(function (node) {
    node.addEventListener("click", (event) => {
      showError(false);
      qca.loadTest(event.currentTarget.value);
      tdataInput.value = qca.data;
      startInput.value = qca.start;
      endInput.value = qca.end;
    });
  });

  window.addEventListener("message", function (event) {
    if (event.data === "animationStarted") {
      playBtn.disabled = false;
    } else if (event.data === "animationStopped") {
      playBtn.disabled = true;
      stepBtn.disabled = true;
    }
  });

  // window.addEventListener("resize", function () {
  //   console.log(window.innerWidth + " " + window.innerHeight);
  //   const svg = document.getElementById("svg");
  //   // if (svg) {
  //   //   svg.setAttribute(
  //   //     "viewbox",
  //   //     `0 0 ${window.innerHeight} ${window.innerHeight}`
  //   //   );
  //   // }
  // });

  let modal = document.getElementById("info-modal");
  let openModalBtn = document.getElementById("open-info");
  let closeModalBtn = document.getElementById("info-modal-close");

  openModalBtn.onclick = function () {
    modal.style.display = "block";
  };

  closeModalBtn.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});

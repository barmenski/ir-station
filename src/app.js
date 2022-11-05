import { Station } from './components/station.js';
import { Graph } from './components/graph.js';

window.station = new Station();

const START_BTN = document.querySelector('.form-control-start_btn');
const CANCEL_BTN = document.querySelector('.form-control-cancel_btn');

const TOP_POWER = document.querySelector('.top-heater-power');
const BOTTOM_POWER = document.querySelector('.bottom-heater-power');
const CHIP_TEMP = document.querySelector('.chip-temp');
const BOARD_TEMP = document.querySelector('.board-temp');

const TEMP_CANVAS = document.querySelector('.temp-canvas');
const POWER_TOP_CANVAS = document.querySelector('.power-top-canvas');
const POWER_BOTTOM_CANVAS = document.querySelector('.power-bottom-canvas');
const INPUT_RANGE = document.querySelector("input[name='manual-set-temp']");
const OUTPUT_RANGE = document.querySelector("output[name='manual-set-temp']");
const INPUT_SPEED_RANGE = document.querySelector(
  "input[name='manual-set-speed']"
);
const OUTPUT_SPEED_RANGE = document.querySelector(
  "OUTput[name='manual-set-speed']"
);

window.temp_graph = new Graph(TEMP_CANVAS, 'Chip temp.');
window.power_top_graph = new Graph(POWER_TOP_CANVAS, 'delta');
window.power_bottom_graph = new Graph(POWER_BOTTOM_CANVAS, 'Power bottom');

START_BTN.addEventListener('click', (event) => {
  event.preventDefault();
  window.station.start();
});
CANCEL_BTN.addEventListener('click', (event) => {
  event.preventDefault();
  window.station.timerStopped = true;
});

INPUT_RANGE.addEventListener('input', (event) => {
  event.preventDefault();
  OUTPUT_RANGE.innerHTML = `${INPUT_RANGE.value} °C`;
});

INPUT_SPEED_RANGE.addEventListener('input', (event) => {
  event.preventDefault();
  OUTPUT_SPEED_RANGE.innerHTML = `${INPUT_SPEED_RANGE.value}`;
  window.station.speed = Number(INPUT_SPEED_RANGE.value);
});

window.refresh = () => {
  TOP_POWER.innerHTML = `${window.station.powerTop}`;
  BOTTOM_POWER.innerHTML = `${window.station.powerBottom}`;
  CHIP_TEMP.innerHTML = `${window.station.tempChip}`;
  BOARD_TEMP.innerHTML = `${window.station.tempBoard}`;
  window.temp_graph.drawGraph(
    window.station.currTime * 0.5,
    -0.25 * window.station.tempChip
  );
  window.power_top_graph.drawGraph(
    window.station.currTime * 0.5,
    -30 * window.station.delta
  );
  window.power_bottom_graph.drawGraph(
    window.station.currTime * 0.5,
    -0.1 * window.station.powerBottom
  );
};

import { Station } from './components/station.js';
import { Graph } from './components/graph.js';

window.onload = () => {
  const START_BTN = document.querySelector('.form-control-start_btn');
  const CANCEL_BTN = document.querySelector('.form-control-cancel_btn');

  const TOP_POWER = document.querySelector('.top-heater-power');
  const BOTTOM_POWER = document.querySelector('.bottom-heater-power');
  const CHIP_TEMP = document.querySelector('.chip-temp');
  const BOARD_TEMP = document.querySelector('.board-temp');
  window.station = new Station();
  const TEMP_CANVAS = document.querySelector('.temp-canvas');
  const POWER_TOP_CANVAS = document.querySelector('.power-top-canvas');
  const POWER_BOTTOM_CANVAS = document.querySelector('.power-bottom-canvas');
  window.temp_graph = new Graph(TEMP_CANVAS, 'Chip temp.');
  window.power_top_graph = new Graph(POWER_TOP_CANVAS, 'delta');
  window.power_bottom_graph = new Graph(POWER_BOTTOM_CANVAS, 'Power bottom');

  START_BTN.addEventListener('click', (event) => {
    event.preventDefault();
    window.station.start();
  });
  CANCEL_BTN.addEventListener('click', (event) => {
    event.preventDefault();
    window.station.stop();
  });

  setInterval(() => {
    TOP_POWER.innerHTML = `${window.station.powerTop}`;
    BOTTOM_POWER.innerHTML = `${window.station.powerBottom}`;
    CHIP_TEMP.innerHTML = `${window.station.tempChip}`;
    BOARD_TEMP.innerHTML = `${window.station.tempBoard}`;
    window.temp_graph.drawGraph(
      window.station.currTime,
      -0.5 * window.station.tempChip
    );
    window.power_top_graph.drawGraph(
      window.station.currTime,
      -20 * window.station.delta
    );
    window.power_bottom_graph.drawGraph(
      window.station.currTime,
      -0.01 * window.station.powerBottom
    );
  });
};

import { Station } from './components/station.js';

window.onload = () => {
  const START_BTN = document.querySelector('.form-control-start_btn');
  const CANCEL_BTN = document.querySelector('.form-control-cancel_btn');

  const TOP_POWER = document.querySelector('.top-heater-power');
  const BOTTOM_POWER = document.querySelector('.bottom-heater-power');
  const CHIP_TEMP = document.querySelector('.chip-temp');
  const BOARD_TEMP = document.querySelector('.board-temp');
  window.station = new Station();

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
  });
};

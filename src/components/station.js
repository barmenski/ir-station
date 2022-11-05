import { Temperature } from './temp.js';
import { Input_panel } from './input_panel.js';

export class Station {
  constructor() {
    this.temperature = new Temperature();
    this.input_panel = new Input_panel();
    // this.mode = 'pb-';
    // this.constTemp = 0;
    this.powerTop = 0;
    this.powerBottom = 0;
    this.tempChip = 25;
    this.tempBoard = 25;
    // this.boardWidth = 150;
    // this.boardLength = 200;
    // this.profilePb = [
    //   [120, 150],
    //   [210, 183],
    //   [270, 183],
    // ];
    // this.profilePbFree = [
    //   [120, 150],
    //   [210, 219],
    //   [270, 219],
    // ];
    this.currTime = 0;
    this.speed = 1;
    this.stepPower = 100;
    this.delta = 0;
    this.timerStopped = true;
  }

  init = () => {
    // if (document.getElementById('pb-').checked) {
    //   this.mode = document.getElementById('pb-').value;
    // } else if (document.getElementById('pb+').checked) {
    //   this.mode = document.getElementById('pb+').value;
    // } else if (document.getElementById('const-temp').checked) {
    //   this.mode = document.getElementById('const-temp').value;
    // }

    // if (this.mode === 'const-temp') {
    //   this.constTemp = document.getElementById('const-temp-set').value;
    // }

    // if (document.querySelector('.width-board').value) {
    //   this.boardWidth = document.querySelector('.width-board').value;
    // } else this.boardWidth = 200;

    // if (document.querySelector('.length-board').value) {
    //   this.boardLength = document.querySelector('.length-board').value;
    // } else this.boardLength = 200;
    this.timer = document.querySelector('.timer');
    this.speed = 1;
    // this.manualSetTemp = document.querySelector("intput[name='manual-set-temp']");
  };

  heat = () => {
    window.refresh();

    if (this.input_panel.mode === 'pb+') {
      var preHeatTime = this.input_panel.profilePb[0][0];
      var preHeatTemp = this.input_panel.profilePb[0][1];
      var waitTime = this.input_panel.profilePb[1][0];
      var waitTemp = this.input_panel.profilePb[1][1];
      var reflowTime = this.input_panel.profilePb[2][0];
      var reflowTemp = this.input_panel.profilePb[2][1];
    } else if (this.input_panel.mode === 'pb-') {
      var preHeatTime = this.input_panel.profilePbFree[0][0];
      var preHeatTemp = this.input_panel.profilePbFree[0][1];
      var waitTime = this.input_panel.profilePbFree[1][0];
      var waitTemp = this.input_panel.profilePbFree[1][1];
      var reflowTime = this.input_panel.profilePbFree[2][0];
      var reflowTemp = this.input_panel.profilePbFree[2][1];
    }

    this.timer.innerHTML = `${this.currTime} s`;
    this.currTime++;

    if (this.tempChip < preHeatTemp) {
      let rise = Math.round((preHeatTemp - 25) / (preHeatTime - 0));
      let prevTemp = this.tempChip;

      this.tempBoard = this.temperature.getTempBoard(
        this.powerTop,
        this.powerBottom,
        this.input_panel.boardWidth,
        this.input_panel.boardLength
      );
      this.tempChip = this.temperature.getTempChip(
        this.powerTop,
        this.powerBottom,
        this.input_panel.boardWidth,
        this.input_panel.boardLength
      );

      this.delta = Math.abs(Number((this.tempChip - prevTemp).toFixed(1)));

      if (this.delta != 0 && this.powerBottom != 0) {
        let powerBottom = Math.round(this.powerBottom * (rise / this.delta));
        powerBottom <= 3420
          ? (this.powerBottom = powerBottom)
          : (this.powerBottom = 3420);
      } else {
        this.powerBottom = this.powerBottom + this.stepPower;
      }
    } else if (this.tempChip >= preHeatTemp && this.tempChip <= waitTemp) {
      //console.log(`if ${this.tempChip} ${waitTemp}`);
      let rise = Math.round(
        (waitTemp - preHeatTemp) / (waitTime - preHeatTime)
      );
      let prevTemp = this.tempChip;

      this.tempBoard = this.temperature.getTempBoard(
        this.powerTop,
        this.powerBottom,
        this.input_panel.boardWidth,
        this.input_panel.boardLength
      );
      this.tempChip = this.temperature.getTempChip(
        this.powerTop,
        this.powerBottom,
        this.input_panel.boardWidth,
        this.input_panel.boardLength
      );

      this.delta = Math.abs(Number((this.tempChip - prevTemp).toFixed(1)));
      let powerBottom = Math.round(this.powerBottom * (rise / this.delta));

      powerBottom <= 3420
        ? (this.powerBottom = powerBottom)
        : (this.powerBottom = 3420);
    } else if (this.currTime > waitTime && this.currTime < reflowTime) {
      let rise = Math.round((reflowTemp - waitTemp) / (reflowTime - waitTime));
      let prevTemp = this.tempChip;

      this.tempBoard = this.temperature.getTempBoard(
        this.powerTop,
        this.powerBottom,
        this.input_panel.boardWidth,
        this.input_panel.boardLength
      );
      this.tempChip = this.temperature.getTempChip(
        this.powerTop,
        this.powerBottom,
        this.input_panel.boardWidth,
        this.input_panel.boardLength
      );

      this.delta = Math.abs(Number((this.tempChip - prevTemp).toFixed(1)));
      let powerBottom = Math.round(this.powerBottom * (rise / this.delta));

      powerBottom <= 3420
        ? (this.powerBottom = powerBottom)
        : (this.powerBottom = 3420);
    } else {
      this.stop();
      alert('Stop heating.');
    }
    /*
    if (this.currTime > reflowTime && this.currTime < 330) {
      this.currTime++;
      let riseTemp = -1;
      let prevTemp = this.tempChip;

      this.tempChip = this.temperature.getTempChip(
        this.powerTop,
        this.powerBottom
      );
      let this.delta = this.tempChip - prevTemp;

      if (this.delta > riseTemp && this.delta != 0) {
        this.powerBottom = this.powerBottom - this.stepPower * this.delta * 0.1;
      }
    }
    */
  };

  start = () => {
    this.init();
    this.input_panel.init();

    //   this.timerId = setInterval(() => {
    //     this.heat();

    //     console.log(
    //       `this.speed: ${this.speed}, qs speed= ${
    //         document.querySelector("input[name='manual-set-speed']").value
    //       }`
    //     );
    //   }, this.speed * 1000);
    this.timerStopped = false;
    this.timerFunc = () => {
      setTimeout(() => {
        this.heat();
        this.timerStopped
          ? console.log('Timer is stopped.')
          : this.timerFunc2();
      }, 1000 / this.speed);
    };

    this.timerFunc2 = () => {
      setTimeout(() => {
        this.heat();
        this.timerStopped ? console.log('Timer is stopped.') : this.timerFunc();
      }, 1000 / this.speed);
    };

    this.timerFunc();
  };

  stop = () => {
    this.timerStopped = true;
  };
}

import { Temperature } from './temp.js';

export class Station {
  constructor() {
    this.temperature = new Temperature();
    this.mode = 'pb-';
    this.constTemp = 0;
    this.powerTop = 0;
    this.powerBottom = 0;
    this.tempChip = 25;
    this.tempBoard = 25;
    this.boardWidth = 150;
    this.boardLength = 200;
    this.profilePb = [
      [120, 150],
      [210, 183],
      [270, 183],
    ];
    this.profilePbFree = [
      [120, 150],
      [210, 219],
      [270, 219],
    ];
    this.timerId = null;
    this.currTime = 0;
    this.stepPower = 100;
    this.delta = 0;
    this.timer = 0;
  }

  init = () => {
    if (document.getElementById('pb-').checked) {
      this.mode = document.getElementById('pb-').value;
    } else if (document.getElementById('pb+').checked) {
      this.mode = document.getElementById('pb+').value;
    } else if (document.getElementById('const-temp').checked) {
      this.mode = document.getElementById('const-temp').value;
    }

    if (this.mode === 'const-temp') {
      this.constTemp = document.getElementById('const-temp-set').value;
    }

    if (document.querySelector('.width-board').value) {
      this.boardWidth = document.querySelector('.width-board').value;
    } else this.boardWidth = 200;

    if (document.querySelector('.length-board').value) {
      this.boardLength = document.querySelector('.length-board').value;
    } else this.boardLength = 200;
    this.timer = document.querySelector('.timer');
  };

  start = () => {
    this.init();
    this.timerId = setInterval(this.heat, 1000);
  };

  stop = () => {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  };

  heat = () => {
    window.refresh();

    if (this.mode === 'pb+') {
      var preHeatTime = this.profilePbFree[0][0];
      var preHeatTemp = this.profilePbFree[0][1];
      var waitTime = this.profilePbFree[1][0];
      var waitTemp = this.profilePbFree[1][1];
      var reflowTime = this.profilePbFree[2][0];
      var reflowTemp = this.profilePbFree[2][1];
    } else if (this.mode === 'pb-') {
      var preHeatTime = this.profilePb[0][0];
      var preHeatTemp = this.profilePb[0][1];
      var waitTime = this.profilePb[1][0];
      var waitTemp = this.profilePb[1][1];
      var reflowTime = this.profilePb[2][0];
      var reflowTemp = this.profilePb[2][1];
    }

    if (this.tempChip < preHeatTemp) {
      this.timer.innerHTML = `${this.currTime} s`;
      this.currTime++;
      let rise = Math.round((preHeatTemp - 25) / (preHeatTime - 0));

      let prevTemp = this.tempChip;

      this.tempBoard = this.temperature.getTempBoard(
        this.powerTop,
        this.powerBottom,
        this.boardWidth,
        this.boardLength
      );
      this.tempChip = this.temperature.getTempChip(
        this.powerTop,
        this.powerBottom,
        this.boardWidth,
        this.boardLength
      );

      this.delta = Math.abs(Number((this.tempChip - prevTemp).toFixed(1)));

      console.log('rise: ' + rise, ' this.delta: ' + this.delta);
      if (this.delta != 0 && this.powerBottom != 0) {
        let powerBottom = Math.round(this.powerBottom * (rise / this.delta));

        if (powerBottom <= 3420) {
          this.powerBottom = powerBottom;
          console.log(rise / this.delta);
        } else this.powerBottom = 3420;
      } else {
        this.powerBottom = this.powerBottom + this.stepPower;
      }
    } else {
      alert('Stop heating.');
      this.stop();
    }
    /*
    if (this.currTime > preHeatTime && this.currTime < waitTime) {
      this.currTime++;
      let riseTemp = (waitTemp - preHeatTemp) / (waitTime - preHeatTime);
      let prevTemp = this.tempChip;

      this.tempChip = this.temperature.getTempChip(
        this.powerTop,
        this.powerBottom
      );
      let this.delta = this.tempChip - prevTemp;

      if (this.delta < riseTemp && this.delta != 0) {
        this.powerBottom =
          this.powerBottom + this.stepPower * (this.delta / riseTemp);
      } else if (this.delta > riseTemp && this.delta != 0) {
        this.powerBottom =
          this.powerBottom - this.stepPower * (this.delta / riseTemp);
      }
    }

    if (this.currTime > waitTime && this.currTime < reflowTime) {
      this.currTime++;
      let riseTemp = (reflowTemp - waitTemp) / (reflowTime - waitTime);
      let prevTemp = this.tempChip;

      this.tempChip = this.temperature.getTempChip(
        this.powerTop,
        this.powerBottom
      );
      let this.delta = this.tempChip - prevTemp;

      if (this.delta < riseTemp && this.delta != 0) {
        this.powerBottom =
          this.powerBottom + this.stepPower * (this.delta / riseTemp);
      } else if (this.delta > riseTemp && this.delta != 0) {
        this.powerBottom =
          this.powerBottom - this.stepPower * (this.delta / riseTemp);
      }
    }

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
}

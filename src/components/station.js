import { Temperature } from './temp.js';

export class Station {
  constructor() {
    this.temperature = new Temperature();
    this.isPbFree = true;
    this.powerTop = 0;
    this.powerBottom = 0;
    this.tempChip = this.temperature.getTempChip(
      this.powerTop,
      this.powerBottom
    );
    this.tempBoard = this.temperature.getTempBoard(
      this.powerTop,
      this.powerBottom
    );
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
    this.stepPower = 50;
  }

  start() {
    this.timerId = setInterval(1000, this.heat);
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  heat() {
    console.log(
      'time: ' +
        this.currTime +
        'tempChip: ' +
        this.tempChip +
        'powerTop: ' +
        this.powerTop
    );

    if (this.isPbFree) {
      var preHeatTime = this.profilePbFree[0][0];
      var preHeatTemp = this.profilePbFree[0][1];
      var waitTime = this.profilePbFree[1][0];
      var waitTemp = this.profilePbFree[1][1];
      var reflowTime = this.profilePbFree[2][0];
      var reflowTemp = this.profilePbFree[2][1];
    } else {
      var preHeatTime = this.profilePb[0][0];
      var preHeatTemp = this.profilePb[0][1];
      var waitTime = this.profilePb[1][0];
      var waitTemp = this.profilePb[1][1];
      var reflowTime = this.profilePb[2][0];
      var reflowTemp = this.profilePb[2][1];
    }
    while (this.currTime < preHeatTime) {
      this.currTime++;
      let riseTemp = (preHeatTemp - 0) / (preHeatTime - 0);
      let prevTemp = this.tempChip;

      this.tempChip = this.temperature.getTempChip(
        this.powerTop,
        this.powerBottom
      );
      let delta = this.tempChip - prevTemp;

      if (delta < riseTemp && delta != 0) {
        this.powerBottom =
          this.powerBottom + this.stepPower * (delta / riseTemp);
      } else if (delta > riseTemp && delta != 0) {
        this.powerBottom =
          this.powerBottom - this.stepPower * (delta / riseTemp);
      }
    }

    while (this.currTime > preHeatTime && this.currTime < waitTime) {
      this.currTime++;
      let riseTemp = (waitTemp - preHeatTemp) / (waitTime - preHeatTime);
      let prevTemp = this.tempChip;

      this.tempChip = this.temperature.getTempChip(
        this.powerTop,
        this.powerBottom
      );
      let delta = this.tempChip - prevTemp;

      if (delta < riseTemp && delta != 0) {
        this.powerBottom =
          this.powerBottom + this.stepPower * (delta / riseTemp);
      } else if (delta > riseTemp && delta != 0) {
        this.powerBottom =
          this.powerBottom - this.stepPower * (delta / riseTemp);
      }
    }

    while (this.currTime > waitTime && this.currTime < reflowTime) {
      this.currTime++;
      let riseTemp = (reflowTemp - waitTemp) / (reflowTime - waitTime);
      let prevTemp = this.tempChip;

      this.tempChip = this.temperature.getTempChip(
        this.powerTop,
        this.powerBottom
      );
      let delta = this.tempChip - prevTemp;

      if (delta < riseTemp && delta != 0) {
        this.powerBottom =
          this.powerBottom + this.stepPower * (delta / riseTemp);
      } else if (delta > riseTemp && delta != 0) {
        this.powerBottom =
          this.powerBottom - this.stepPower * (delta / riseTemp);
      }
    }

    while (this.currTime > reflowTime && this.currTime < 330) {
      this.currTime++;
      let riseTemp = -1;
      let prevTemp = this.tempChip;

      this.tempChip = this.temperature.getTempChip(
        this.powerTop,
        this.powerBottom
      );
      let delta = this.tempChip - prevTemp;

      if (delta > riseTemp && delta != 0) {
        this.powerBottom = this.powerBottom - this.stepPower * delta * 0.1;
      }
    }
  }
}

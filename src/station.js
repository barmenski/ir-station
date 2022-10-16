import { Temperature } from './temp';

class Station {
  constructor() {
    this.temperature = new Temperature();
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
    this.profikePbFree = [
      [120, 150],
      [210, 219],
      [270, 219],
    ];
    this.currTime = 0;
  }

  start() {
    let workPeriod = setInterval(1000);
  }
}

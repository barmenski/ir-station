let maxPower = 3460; // W
let maxTempRise = 5; // C/sec
let oneCelSecTempRise = maxPower / maxTempRise; // power for 1 C/sec
export class Temperature {
  constructor(tempEnv = 25, tempChip = 25, tempBoard = 25) {
    this.tempEnv = tempEnv;
    this.tempChip = tempChip;
    this.tempBoard = tempBoard;
  }

  getTempChip(powerTop, powerBottom) {
    let deltaTemp = this.tempEnv - this.tempChip;
    if (powerTop === 0 && powerBottom != 0) {
      this.tempBoard = getTempBoard(powerTop, powerBottom);
      if (this.tempBoard < this.tempEnv + 20) {
        this.tempChip = this.tempEnv;
      } else {
        this.tempChip = this.tempBoard - 20;
      }
    } else if (powerTop != 0 && powerBottom != 0) {
      this.tempChip =
        this.tempChip +
        (powerTop + powerBottom) / oneCelSecTempRise -
        deltaTemp / 100;
    }

    return this.tempChip;
  }

  getTempBoard(powerTop, powerBottom) {
    let deltaTemp = this.tempEnv - this.tempBoard;
    this.tempBoard =
      this.tempBoard +
      (powerTop * 0.1 + powerBottom) / oneCelSecTempRise -
      deltaTemp / 100;
    return this.tempChip;
  }
}

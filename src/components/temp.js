let maxPower = 3460; // W
let maxTempRise = 5; // C/sec
let oneCelSecTempRise = maxPower / maxTempRise; //692W -  power for 1 C/sec
export class Temperature {
  constructor(tempEnv = 25, tempChip = 25, tempBoard = 25) {
    this.tempEnv = tempEnv;
    this.tempChip = tempChip;
    this.tempBoard = tempBoard;
  }

  getTempBoard = (powerTop, powerBottom) => {
    let deltaTemp = this.tempEnv - this.tempBoard;
    this.tempBoard = Number(
      (
        this.tempBoard +
        (powerTop + powerBottom) / oneCelSecTempRise -
        deltaTemp / 100
      ).toFixed(1)
    );

    return this.tempBoard;
  };

  getTempChip = (powerTop, powerBottom) => {
    let deltaTemp = this.tempEnv - this.tempChip;
    if (powerTop === 0 && powerBottom != 0) {
      this.tempChip = this.getTempBoard(powerTop, powerBottom);
      console.log(
        'this.tempChip: ' + this.tempChip,
        'this.tempBoard: ' + this.tempBoard
      );
      if (this.tempBoard < this.tempEnv + 20) {
        this.tempChip = this.tempEnv;
      } else {
        this.tempChip = this.tempBoard - 20;
      }
    } else if (powerTop != 0 && powerBottom != 0) {
      this.tempChip = Number(
        (
          this.tempChip +
          (powerTop + powerBottom) / oneCelSecTempRise -
          deltaTemp / 100
        ).toFixed(1)
      );
    }

    return this.tempChip;
  };
}

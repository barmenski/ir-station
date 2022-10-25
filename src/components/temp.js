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
    let deltaTemp = Math.abs(Number((this.tempChip - this.tempEnv).toFixed(1)));

    this.tempBoard = Number(
      (
        this.tempBoard -
        deltaTemp * 0.05 +
        (powerTop + powerBottom) / oneCelSecTempRise
      ).toFixed(1)
    );

    return this.tempBoard;
  };

  getTempChip = (powerTop, powerBottom) => {
    this.tempChip = this.tempBoard;
    return this.tempChip;
  };
}

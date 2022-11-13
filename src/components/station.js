import { Temperature } from './temp.js';
import { Input_panel } from './input_panel.js';
import { Controller } from './pid_controller.js';

export class Station {
  constructor() {
    this.temperature = new Temperature();
    this.input_panel = new Input_panel();
    this.powerTop = 0;
    this.powerBottom = 100;
    this.tempChip = 25;
    this.idealTemp = 25;
    this.tempBoard = 25;
    this.ctr = new Controller({
      k_p: this.input_panel.k_p,
      k_p: this.input_panel.k_i,
      k_p: this.input_panel.k_d,
      dt: 1,
    });
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
    this.stepPower = 10;
    this.delta = 0;
    this.rise = 0;
    this.timerStopped = true;
  }

  init = () => {
    this.timer = document.querySelector('.timer');
  };

  getTemperature = () => {
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
  };

  heat = () => {
    window.refresh();
    this.timer.innerHTML = `${this.currTime} s`;
    this.currTime++;
    switch (this.input_panel.mode) {
      case 'pb+':
      case 'pb-':
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

        if (this.tempChip < preHeatTemp) {
          //--------------------1
          this.rise = Number(
            ((preHeatTemp - 25) / (preHeatTime - 0)).toFixed(2)
          );
          let prevTemp = this.tempChip;
          this.getTemperature();
          this.delta = Number((this.tempChip - prevTemp).toFixed(2));
          this.ctr.setTarget(this.idealTemp);
          this.idealTemp = this.idealTemp + this.rise;
          this.powerBottom = Number(this.ctr.update(this.tempChip)).toFixed(2);
        } else if (this.tempChip >= preHeatTemp && this.tempChip <= waitTemp) {
          //-------------------------------------------------------------------2
          this.rise = Number(
            ((waitTemp - preHeatTemp) / (waitTime - preHeatTime)).toFixed(2)
          );
          let prevTemp = this.tempChip;
          this.getTemperature();
          this.delta = Number((this.tempChip - prevTemp).toFixed(2));
          this.ctr.setTarget(this.idealTemp);
          this.idealTemp = this.idealTemp + this.rise;
          this.powerBottom = Number(this.ctr.update(this.tempChip)).toFixed(2);
          // } else if (this.tempChip >= waitTemp && this.tempChip <= reflowTemp) {
          //   //-----------3
          //   this.rise = Number(
          //     ((reflowTemp - waitTemp) / (reflowTime - waitTime)).toFixed(1)
          //   );
          //   let prevTemp = this.tempChip;
          //   this.getTemperature();

          //   this.delta = Number((this.tempChip - prevTemp).toFixed(1));
          //   this.analize();
        } else {
          this.stop();
          alert('Stop heating.');
        }
        break;
      case 'const-pow':
        this.powerBottom = this.this.input_panel.constPow;
        this.getTemperature();
        break;
      case 'const-temp':
        this.ctr.setTarget(this.input_panel.constTemp);
        console.log(this.input_panel.constTemp);
        this.getTemperature();
        this.powerBottom = Number(this.ctr.update(this.tempChip)).toFixed(2);
        break;
    }
  };

  start = () => {
    this.init();
    this.input_panel.init();

    this.timerStopped = false;
    this.timerFunc = () => {
      setTimeout(() => {
        this.heat();
        this.timerStopped
          ? console.log('Timer is stopped.')
          : this.timerFunc2();
      }, 1000 / this.input_panel.speed);
    };

    this.timerFunc2 = () => {
      setTimeout(() => {
        this.heat();
        this.timerStopped ? console.log('Timer is stopped.') : this.timerFunc();
      }, 1000 / this.input_panel.speed);
    };

    this.timerFunc();
  };

  stop = () => {
    this.timerStopped = true;
  };
}

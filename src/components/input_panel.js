export class Input_panel {
  constructor() {
    this.mode = 'pb-';
    this.constTemp = 0;
    this.boardWidth = 150;
    this.boardLength = 200;
    this.profilePb = [
      [120, 150],
      [210, 183],
      [270, 183],
    ];
    this.profilePbFree = [
      [120, 160],
      [210, 219],
      [270, 219],
    ];
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
    } else this.boardWidth = 150;

    if (document.querySelector('.length-board').value) {
      this.boardLength = document.querySelector('.length-board').value;
    } else this.boardLength = 200;
  };
}

import Point from "./point"

export default class Board {
  constructor(i,j) {
    this.state = _(3).times(function(i) {
      return _(3).times(function(j) { return null; });
    })
  }

  getCell(i,j) {
    return new Point(this.state[i][j];
  }

  updateCell(value, i, j) {
    this.state[i][j] = value;
  }
}

export default class Point {
  constructor(i,j) {
    this.i = i;
    this.j = j;
  }

  is_corner() {
    return (this.i == 0 && this.j == 0) ||
      (this.i == 0 && this.j == 2) ||
      (this.i == 2 && this.j == 2) ||
      (this.i == 2 && this.j == 0);
  }

  is_edge() {
    return (this.i == 0 || this.j == 0 || this.i == 2 || this.j == 2)
      && !this.is_corner()
  }

  is_center() {
    return this.i == 1 && this.j == 1;
  }
}

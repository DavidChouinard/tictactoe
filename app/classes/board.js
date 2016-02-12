import _ from 'underscore'

import Point from "./point"

export default class Board {
  constructor(state) {
    this.PLAYER_SYMBOL = "cross";
    this.COMPUTER_SYMBOL = "nought";

    if (typeof state == "undefined") {
      this.state = _(3).times(function(i) {
        return _(3).times(function(j) { return null; });
      })
    } else {
      this.state = state;
    }
  }

  copy() {
    return new Board(this.copyState(this.state));
  }

  copyState() {
    return this.state.map(function(arr) {
      return arr.slice();
    });
  }

  getState() {
    return this.state;
  }

  getCell(i,j) {
    return this.state[i][j];
  }

  updateCell(value, position) {
    this.state[position[0]][position[1]] = value;
  }

  cellIsEmpty(position) {
    return this.state[position[0]][position[1]] == null;
  }

  getContent() {
    return this.state;
  }

  getRowIndexes(index) {
    return _(this.state.length).times(function(n) { return [index, n] });
  }

  getColumnIndexes(index) {
    return _(this.state.length).times(function(n) { return [n, index] });
  }

  getBothDiagonalsIndexes() {
    var length = this.state.length - 1;
    return [
      _(this.state.length).times(function(n) { return [n, n] }),
      _(this.state.length).times(function(n) { return [n, length - n] })
    ]
  }

  countSymbolOccurence(row, search) {
    return row.reduce(function(n, val) {
      return n + (val === search);
    }, 0);
  }

  getAllUnusedCells() {
    var cells = []
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (this.cellIsEmpty([i,j])) {
          cells.push([i, j]);
        }
      }
    }
    return cells;
  }

  getFirstUnusedCorner() {
    var edges = [[0,0], [0,2], [2,0], [2,2]];
    return this.getFirstUnusedCellFromList(edges);
  }

  getFirstUnusedEdge() {
    var edges = [[0,1], [2,1], [1,2], [1,0]];
    return this.getFirstUnusedCellFromList(edges);
  }

  getFirstUnusedCellFromList(cells) {
    for (var i = 0; i < cells.length; i++) {
      if (this.cellIsEmpty(cells[i])) {
        return cells[i];
      }
    }
    return null;
  }

  getFirstUnusedCell() {
    for (var i = 0; i < this.state.length; i++) {
      for (var j = 0; j < this.state.length; j++) {
        if (this.cellIsEmpty([i,j])) {
          return [i, j];
        }
      }
    }
    return null;
  }

  getOpposingCornerIfPlayerIsInCorner(symbol) {
    var cells = [[0,0], [0,2], [2,0], [2,2]];
    for (var i = 0; i < cells.length; i++) {
      if (this.state[cells[i][0]][cells[i][1]] == symbol) {
        var corner = [this.getOpposingCell(cells[i][0]), this.getOpposingCell(cells[i][1])];
        if (this.cellIsEmpty(corner)) return corner;
      }
    }
    return null;
  }

  getOpposingCell(i) {
    switch (i) {
      case 0:
        return 2;
      case 1:
        return 1;
      case 2:
        return 0;
    }
  }

  getAllIntersectingRowsForCell(cell) {
    var result = [];

    result.push(this.getColumnIndexes(cell[0]));
    result.push(this.getRowIndexes(cell[1]));

    this.getBothDiagonalsIndexes().forEach(function(diagonal) {
      if (diagonal.some(function(d) { return d[0] == cell[0] && d[1] == cell[1] })) {
        result.push(diagonal);
      }
    });

    return result;
  }

  findForkCreatingMove(state, symbol) {
    // Currently picks the first fork found. To be optimal, this needs to look at all forks and
    // and considered yet another downstream move to pick the optimal fork blocking move
    var self = this;
    var possible_moves = []
    for (var i = 0; i < state.length; i++) {
      for (var j = 0; j < state.length; j++) {
        if (state[i][j] == null) {
          var forks = this.getAllIntersectingRowsForCell([i,j]).filter(function(intersecting_row) {
            var row_contents = intersecting_row.map(function(d) { return state[d[0]][d[1]]; });
            return self.countSymbolOccurence(row_contents, symbol) == 1
              && self.countSymbolOccurence(row_contents, null) == 2
          });

          if (forks.length >= 2) {
            return [i,j];
          }
        }
      }
    }
    return null
  }

  checkIfCanBlockFork() {
    var cells = this.getAllUnusedCells();

    // check all possible opponent moves
    for (var i = 0; i < cells.length; i++) {
      var state = this.copyState();
      state[cells[i][0]][cells[i][1]] = this.PLAYER_SYMBOL;

      var move = this.findForkCreatingMove(state, this.PLAYER_SYMBOL);
      if (move !== null) return move;
    }

    return null;
  }

  getResultForUserMove(user_move) {
    this.updateCell(this.PLAYER_SYMBOL, user_move);

    if (this.checkBoardForWin(this.PLAYER_SYMBOL)) {
      return "win";
    }

    var computer_move = this.getComputerMove(user_move);

    if (computer_move === null) {
      return "draw";  // no moves left
    } else {
      this.updateCell(this.COMPUTER_SYMBOL, computer_move);
    }

    if (this.checkBoardForWin(this.COMPUTER_SYMBOL)) {
      return "loss";
    }

    return null;
  }

  getComputerMove(user_move) {
    var computer_winning_move = this.checkIfWinningMoveExists(this.COMPUTER_SYMBOL);
    if (computer_winning_move !== null) return computer_winning_move;;

    var player_winning_move = this.checkIfWinningMoveExists(this.PLAYER_SYMBOL);
    if (player_winning_move !== null) return player_winning_move;

    // TODO: this logic isn't quite optimal
    //var fork_blocking_move = this.checkIfCanBlockFork();
    //if (fork_blocking_move !== null) return fork_blocking_move;

     //the center is good
    if (this.cellIsEmpty([1, 1])) {
      return [1,1];
    }

    var opposing_corner = this.getOpposingCornerIfPlayerIsInCorner(this.PLAYER_SYMBOL);
    if (opposing_corner !== null) return opposing_corner;

    var corner = this.getFirstUnusedCorner();
    if (corner !== null) return corner;

    var edge = this.getFirstUnusedEdge();
    if (edge !== null) return edge;

    return this.getFirstUnusedCell();
  }

  checkIfWinningMoveExists(symbol) {
    var self = this;

    // check rows and columns
    for (var index = 0; index < 3; index++) {
      var row = this.getRowIndexes(index);
      var i = this.getIndexOfWinningMove(row, symbol);
      if (i !== null) return row[i];

      var column = this.getColumnIndexes(index);
      var i = this.getIndexOfWinningMove(column, symbol);
      if (i !== null) return column[i];
    }

    this.getBothDiagonalsIndexes().forEach(function(diagonal) {
      var i = self.getIndexOfWinningMove(diagonal, symbol);
      if (i !== null) return diagonal[i];
    });

    return null;
  }

  getIndexOfWinningMove(row, symbol) {
    var self = this;

    var row_contents = row.map(function(d) { return self.state[d[0]][d[1]]; });
    if (this.countSymbolOccurence(row_contents, symbol) == 2 && row_contents.indexOf(null) != -1) {
      return row_contents.indexOf(null);
    } else {
      return null;
    }
  }

  checkBoardForWin(symbol) {
    var self = this;

    for (var index = 0; index < 3; index++) {
      if (this.checkRowForWin(this.state[index], symbol)) return true;

      var column = this.getRowContentsFromIndexes(this.getColumnIndexes(index));
      if (this.checkRowForWin(column, symbol)) return true;
    }

    var diagonals = this.getBothDiagonalsIndexes();
    for (var i = 0; i < diagonals.length; i++) {
      var diagonal = this.getRowContentsFromIndexes(diagonals[i]);
      if (self.checkRowForWin(diagonal, symbol)) return true;
    }

    return false;
  }

  checkRowForWin(row, symbol) {
    return this.countSymbolOccurence(row, symbol) == 3;
  }

  getRowContentsFromIndexes(row) {
    var self = this;
    return row.map(function(d) { return self.state[d[0]][d[1]]; });
  }
}

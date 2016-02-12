import Board from "../app/classes/board"

function tryAllMoves(board, moves) {
  var cells = board.getAllUnusedCells();

  if (typeof moves == "undefined") {
    moves = [];
  }

  if (cells.length == 0) {
    return;
  } else {
    for (var i = 0; i < cells.length; i++) {
      var board_clone = board.copy();
      var result = board_clone.getResultForUserMove(cells[i]);
      var moves_current = moves.concat([cells[i]]);

      if (result !== null) {
        if (result == "win") {
          console.log(movesToString(moves_current) + result);
        }

        continue
      }

      tryAllMoves(board_clone, moves_current);
    }
  }
}

function movesToString(moves) {
  var result = ""

  for (var i = 0; i < moves.length; i++) {
    result += '(' + moves[i][0] + ',' + moves[i][1] + ') -> ';
  }

  return result
}

tryAllMoves(new Board());

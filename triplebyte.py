import sys
import copy

SIZE = 3
PLAYER_SYMBOL = 'O'
COMPUTER_SYMBOL = 'X'

state = [[None for _ in range(SIZE)] for _ in range(SIZE)]

def main():

    while True:
        print_board()
        i,j = prompt_user_move()
        update_cell(i,j, PLAYER_SYMBOL)

        win_status = determine_win_status_for_player()

        if (win_status is not None):
            break

        i,j = determine_computer_move()
        update_cell(i,j, COMPUTER_SYMBOL)
        win_status = determine_win_status_for_player()

        if (win_status is not None):
            break

    print "Game over. It's a " + win_status

def print_board():
    for row in state:
        for cell in row:
            content = ' '
            if cell is not None:
                content = cell

            sys.stdout.write(content + '|')

        print

def cell_is_empty(i,j):
    return state[i][j] == None

def update_cell(i,j,symbol):
    state[i][j] = PLAYER_SYMBOL

def prompt_user_move():
    row = int(raw_input("Your turn. What row? "))
    column = int(raw_input("What column? "))

    if not cell_is_empty(row,column):
        print("Cell is already taken.")
        return prompt_user_move()

    return row, column

def determine_computer_move():

    for i, row in enumerate(state):
        for j, _ in enumerate(row):
        mocked_state = copy.deepcopy(state)
        if mocked_state[i][j] == None:
            mocked_state[i][j] = COMPUTER_SYMBOL

            if determine_win_status_for_player(COMPUTER_SYMBOL, mocked_state) == "lose":
                for k, row in enumerate(state):
                    for l, _ in enumerate(row):
                        if k != i and l != j and state[k][l] is None:
                            return k, l

    pass

def determine_win_status_for_player(symbol, mocked_state):
    if table_is_full():
        return "draw"

    win_state = "win" if symbol == PLAYER_SYMBOL else "lose"

    for n in range(SIZE):
        if all(map(lambda row: row == symbol, mocked_state[n])):
            return win_state

        column = map(lambda row: row[n], mocked_state)
        if all(map(lambda row: row == symbol, column)):
            return win_state

    diagonals = [[0,0],[1,1],[2,2], [0,2],[1,1],[2,0]]
    for diagonal in diagonals:
        if all(map(lambda row: row == symbol, diagonal)):
            return win_state

    return None

def table_is_full():
    for row in state:
        for cell in row:
            if cell is not None:
                return False

    return True


if __name__ == "__main__":
    main()


import sys


def main():
    with open('day3_input.txt') as f:
        moves1 = [x for x in f.readline().rstrip().split(',')]
        moves2 = [x for x in f.readline().rstrip().split(',')]

    board = {}

    draw(board, moves1, 1)
    draw(board, moves2, 4)

    min_dist = sys.maxsize
    for x, row in board.items():
        for y, state in row.items():
            if state == 5:
                min_dist = min(min_dist, abs(x) + abs(y))

    print(min_dist)

    intersections1 = get_intersections(board, moves1)
    intersections2 = get_intersections(board, moves2)

    min_dist = sys.maxsize
    for pos in intersections1.keys():
        min_dist = min(min_dist, intersections1[pos] + intersections2[pos])

    print(min_dist)

def get_intersections(board, moves):
    pos_x = 0
    pos_y = 0
    dist = 0
    intersections = {}
    for move in moves:
        direction = move[0]
        steps = int(move[1:])
        if direction == 'L':
            new_pos_x = pos_x - steps
            for i in range(pos_x - 1, new_pos_x - 1, -1):
                dist += 1
                update_intersections(board, intersections, i, pos_y, dist)
            pos_x = new_pos_x
        elif direction == 'U':
            new_pos_y = pos_y + steps
            for i in range(pos_y + 1, new_pos_y + 1):
                dist += 1
                update_intersections(board, intersections, pos_x, i, dist)
            pos_y = new_pos_y
        elif direction == 'R':
            new_pos_x = pos_x + steps
            for i in range(pos_x + 1, new_pos_x + 1):
                dist += 1
                update_intersections(board, intersections, i, pos_y, dist)
            pos_x = new_pos_x
        elif direction == 'D':
            new_pos_y = pos_y - steps
            for i in range(pos_y - 1, new_pos_y - 1, -1):
                dist += 1
                update_intersections(board, intersections, pos_x, i, dist)
            pos_y = new_pos_y
        else:
            raise Exception
    return intersections


def update_intersections(board, intersections, x, y, dist):
    if board[x][y] == 5:
        intersections[(x, y)] = dist


def draw(board, moves, marker):
    pos_x = 0
    pos_y = 0
    for move in moves:
        direction = move[0]
        steps = int(move[1:])
        if direction == 'L':
            new_pos_x = pos_x - steps
            for i in range(pos_x - 1, new_pos_x - 1, -1):
                update(board, i, pos_y, marker)
            pos_x = new_pos_x
        elif direction == 'U':
            new_pos_y = pos_y + steps
            for i in range(pos_y + 1, new_pos_y + 1):
                update(board, pos_x, i, marker)
            pos_y = new_pos_y
        elif direction == 'R':
            new_pos_x = pos_x + steps
            for i in range(pos_x + 1, new_pos_x + 1):
                update(board, i, pos_y, marker)
            pos_x = new_pos_x
        elif direction == 'D':
            new_pos_y = pos_y - steps
            for i in range(pos_y - 1, new_pos_y - 1, -1):
                update(board, pos_x, i, marker)
            pos_y = new_pos_y
        else:
            raise Exception


def update(board, x, y, marker):
    if x not in board:
        board[x] = {}
    board[x][y] = board[x].get(y, 0) + marker

def print_board(board):
    min_x, max_x = 0, 0
    min_y, max_y = 0, 0
    for x, row in board.items():
        min_x = min(min_x, x)
        max_x = max(max_x, x)
        for y, _ in row.items():
            min_y = min(min_y, y)
            max_y = max(max_y, y)
    print(min_x, max_x)
    print(min_y, max_y)
    arr = [['.'] * (abs(min_x) + abs(max_x) + 1) for _ in range(abs(min_y) + abs(max_y) + 1)]

    for x, row in board.items():
        for y, state in row.items():
            arr[y + abs(min_y)][x + abs(min_x)] = state
    arr[abs(min_y)][abs(min_x)] = '*'

    i = min_y
    for row in arr:
        print('{}\t'.format(i), ''.join(map(str, row)))
        i += 1


if __name__ == '__main__':
    main()

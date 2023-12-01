from collections import defaultdict, deque


def main():
    with open('day11_input.txt') as f:
        ops = [int(x) for x in f.readline().rstrip().split(',')]

    panels = paint(ops, 0)
    print(len(panels.values()))

    panels = paint(ops, 1)
    print_panels(panels)


def paint(ops, start):
    inputs = deque([start])
    comp = Intcode(ops)
    program = comp.run(inputs)
    panels = defaultdict(lambda: 0)
    i, j = 0, 0
    directions = [(-1, 0), (0, -1), (1, 0), (0, 1)]
    dir_i = 0
    try:
        while True:
            color = next(program)
            turn = next(program)

            panels[(i, j)] = color

            if turn == 0:
                dir_i = (dir_i + 1) % len(directions)
            elif turn == 1:
                dir_i = (dir_i - 1) % len(directions)
            else:
                raise Exception

            i, j = i - directions[dir_i][0], j - directions[dir_i][1]

            inputs.appendleft(panels[(i, j)])
    except StopIteration:
        return panels


def print_panels(panels):
    i_sorted = sorted(i for i, _ in panels.keys())
    min_i, max_i = i_sorted[0], i_sorted[-1]
    j_sorted = sorted(j for _, j in panels.keys())
    min_j, max_j = j_sorted[0], j_sorted[-1]

    for i in range(max_i, min_i - 1, -1):
        line = []
        for j in range(max_j, min_j - 1, -1):
            line.append(' ' if panels[(i, j)] == 0 else '#')
        print(''.join(line))


class Intcode:
    POSITION = 0
    IMMEDIATE = 1
    RELATIVE = 2

    def __init__(self, ops):
        self.ops = defaultdict(lambda: 0)
        for i, op in enumerate(ops):
            self.ops[i] = op

        self.relative_base = 0

    def run(self, inputs):
        i = 0
        while True:
            c = self.ops[i] % 100
            m = self.ops[i] // 100
            if c == 1:
                a, b = self._read_2_params(i, m)
                self._write_nth_param(i, m, 3, a + b)
                i += 4
            elif c == 2:
                a, b = self._read_2_params(i, m)
                self._write_nth_param(i, m, 3, a * b)
                i += 4
            elif c == 3:
                n = inputs.pop()
                self._write_nth_param(i, m, 1, n)
                i += 2
            elif c == 4:
                a = self._read_1_param(i, m)
                yield a
                i += 2
            elif c == 5:
                a, b = self._read_2_params(i, m)
                if a != 0:
                    i = b
                else:
                    i += 3
            elif c == 6:
                a, b = self._read_2_params(i, m)
                if a == 0:
                    i = b
                else:
                    i += 3
            elif c == 7:
                a, b = self._read_2_params(i, m)
                if a < b:
                    self._write_nth_param(i, m, 3, 1)
                else:
                    self._write_nth_param(i, m, 3, 0)
                i += 4
            elif c == 8:
                a, b = self._read_2_params(i, m)
                if a == b:
                    self._write_nth_param(i, m, 3, 1)
                else:
                    self._write_nth_param(i, m, 3, 0)
                i += 4
            elif c == 9:
                a = self._read_1_param(i, m)
                self.relative_base += a
                i += 2
            elif c == 99:
                return self.ops[0]
            else:
                raise Exception

    def _read_nth_param(self, i, m, n):
        mode = self._get_mode(m, n)
        if mode == Intcode.POSITION:
            return self.ops[self.ops[i + n]]
        elif mode == Intcode.IMMEDIATE:
            return self.ops[i + n]
        elif mode == Intcode.RELATIVE:
            return self.ops[self.relative_base + self.ops[i + n]]
        else:
            raise Exception

    def _read_1_param(self, i, m):
        return self._read_nth_param(i, m, 1)

    def _read_2_params(self, i, m):
        return self._read_nth_param(i, m, 1), self._read_nth_param(i, m, 2)

    def _write_nth_param(self, i, m, n, value):
        mode = self._get_mode(m, n)
        if mode == Intcode.POSITION:
            self.ops[self.ops[i + n]] = value
        elif mode == Intcode.IMMEDIATE:
            raise Exception
        elif mode == Intcode.RELATIVE:
            self.ops[self.relative_base + self.ops[i + n]] = value
        else:
            raise Exception

    @staticmethod
    def _get_mode(m, n):
        return (m // 10 ** (n - 1)) % 10


if __name__ == '__main__':
    main()

import itertools
from collections import deque


def main():
    with open('day7_input.txt') as f:
        ops = [int(x) for x in f.readline().rstrip().split(',')]

    print(find_max_output(ops, [0, 1, 2, 3, 4]))
    print(find_max_output(ops, [5, 6, 7, 8, 9]))


def find_max_output(ops, phases):
    ops = list(ops)

    max_output = 0

    for config in itertools.permutations(phases):
        amp_ops = [list(ops) for _ in range(len(config))]
        amp_inputs = [deque([phase]) for phase in config]
        amp_inputs[0].appendleft(0)

        amps = [run(amp_ops[i], amp_inputs[i]) for i in range(len(config))]

        i = 0
        while True:
            next_i = (i + 1) % len(config)
            try:
                output = next(amps[i])
                amp_inputs[next_i].appendleft(output)
            except StopIteration:
                if i == len(config) - 1:
                    break
            i = next_i

        max_output = max(max_output, output)

    return max_output


class EndOfExecution(Exception):
    pass


def run(ops, inputs):
    input_i = 0

    i = 0
    while True:
        c = ops[i] % 100
        m = ops[i] // 100
        if c == 1:
            a, b = read_2_params(ops, i, m)
            ops[ops[i + 3]] = a + b
            i += 4
        elif c == 2:
            a, b = read_2_params(ops, i, m)
            ops[ops[i + 3]] = a * b
            i += 4
        elif c == 3:
            n = inputs.pop()
            input_i += 1
            ops[ops[i + 1]] = n
            i += 2
        elif c == 4:
            a = read_1_param(ops, i, m)
            yield a
            i += 2
        elif c == 5:
            a, b = read_2_params(ops, i, m)
            if a != 0:
                i = b
            else:
                i += 3
        elif c == 6:
            a, b = read_2_params(ops, i, m)
            if a == 0:
                i = b
            else:
                i += 3
        elif c == 7:
            a, b = read_2_params(ops, i, m)
            if a < b:
                ops[ops[i + 3]] = 1
            else:
                ops[ops[i + 3]] = 0
            i += 4
        elif c == 8:
            a, b = read_2_params(ops, i, m)
            if a == b:
                ops[ops[i + 3]] = 1
            else:
                ops[ops[i + 3]] = 0
            i += 4
        elif c == 99:
            return
        else:
            raise Exception


def read_nth_param(ops, i, m, n):
    mode = (m // 10 ** (n - 1)) % 10
    if mode == 0:
        return ops[ops[i + n]]
    elif mode == 1:
        return ops[i + n]
    else:
        raise Exception


def read_1_param(ops, i, m):
    return read_nth_param(ops, i, m, 1)


def read_2_params(ops, i, m):
    return read_nth_param(ops, i, m, 1), read_nth_param(ops, i, m, 2)


if __name__ == '__main__':
    main()

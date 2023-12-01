with open('day2_input.txt') as f:
    ops = [int(x) for x in f.readline().rstrip().split(',')]


def run(ops, n, v):
    ops = list(ops)
    ops[1] = n
    ops[2] = v
    i = 0
    while True:
        c = ops[i]
        if c == 1:
            ops[ops[i + 3]] = ops[ops[i + 1]] + ops[ops[i + 2]]
            i += 4
        elif c == 2:
            ops[ops[i + 3]] = ops[ops[i + 1]] * ops[ops[i + 2]]
            i += 4
        elif c == 99:
            return ops[0]
        else:
            raise Exception()


print(run(ops, 12, 2))

answer = None
for n in range(100):
    for v in range(100):
        if run(ops, n, v) == 19690720:
            answer = 100 * n + v
            break
    if answer is not None:
        break

print(answer)

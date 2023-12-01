with open('day1_input.txt') as f:
    ints = [int(line) for line in f.readlines()]


def fuel(modules):
    s = 0
    for i in modules:
        s += i // 3 - 2
    return s


print(fuel(ints))  # 3372695


def fuel0(modules):
    s0 = 0
    for i in modules:
        sx = 0
        f0 = i // 3 - 2
        while f0 > 0:
            sx += f0
            f0 = f0 // 3 - 2

        s0 += sx
    return s0


print(fuel0(ints))

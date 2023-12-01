from fractions import Fraction


def main():
    with open('day10_input.txt') as f:
        m = [list(line.rstrip()) for line in f.readlines()]

    part1(m)

    part2(m, 25, 22)


def part1(m):
    max_count = 0
    pos = None
    for i in range(len(m)):
        for j in range(len(m[i])):
            if m[i][j] == '#':
                c = count(m, i, j)
                if c > max_count:
                    max_count = c
                    pos = (i, j)
    print(max_count, pos)


def part2(m, pos_i, pos_j):
    top = []
    right = []
    bot = []
    left = []
    asteroids = 0
    for i in range(len(m)):
        for j in range(len(m[i])):
            if not (pos_i == i and pos_j == j) and m[i][j] == '#':
                asteroids += 1
                ri, rj = i - pos_i, j - pos_j
                if rj == 0:
                    t = (0, abs(ri), (i, j))
                    if ri < 0:
                        top.append(t)
                    else:
                        bot.append(t)
                else:
                    t = (Fraction(ri, rj), abs(ri), abs(rj), (i, j))
                    if rj > 0:
                        right.append(t)
                    else:
                        left.append(t)

    top = sorted(top)
    right = sorted(right)
    bot = sorted(bot)
    left = sorted(left)

    destroyed = []
    i = 0
    while i < asteroids:
        i = destroy(top, i, destroyed)
        i = destroy(right, i, destroyed)
        i = destroy(bot, i, destroyed)
        i = destroy(left, i, destroyed)

    result = destroyed[199]
    print(result[1] * 100 + result[0])


def destroy(queue, i, destroyed):
    prev = None
    for j in range(len(queue)):
        if queue[j] is not None and queue[j][0] != prev:
            destroyed.append(queue[j][-1])
            prev = queue[j][0]
            queue[j] = None
            i += 1
    return i


def count(m, i, j):
    visible = set()
    for ii in range(len(m)):
        for jj in range(len(m[i])):
            if not (ii == i and jj == j) and m[ii][jj] == '#':
                relative = (ii - i, jj - j)
                if relative[0] == 0:
                    y = relative[1] // abs(relative[1])
                    visible.add((0, y))
                elif relative[1] == 0:
                    x = relative[0] // abs(relative[0])
                    visible.add((x, 0))
                else:
                    g = gcd(relative[0], relative[1])
                    x, y = relative[0] // g, relative[1] // g
                    visible.add((x, y))
    # print(i, j, visible)
    return len(visible)


def gcd(x, y):
    x, y = abs(x), abs(y)
    while y > 0:
        x, y = y, x % y
    return x


if __name__ == '__main__':
    main()

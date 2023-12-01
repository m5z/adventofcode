import re


def main():
    with open('day12_input.txt') as f:
        r = re.compile(r'^<x=(-?[0-9]+), y=(-?[0-9]+), z=(-?[0-9]+)>')
        pos = []
        for line in f.readlines():
            m = r.match(line)
            pos.append([int(m.group(1)), int(m.group(2)), int(m.group(3))])

    print(simulate(pos, 1000))


def simulate(pos, steps):
    vel = [[0] * 3 for _ in range(len(pos))]
    for _ in range(steps):
        apply_gravity(pos, vel)
        apply_velocity(pos, vel)

    return calculate_energy(pos, vel)


def apply_gravity(pos, vel):
    for i in range(len(pos)):
        for j in range(i + 1, len(pos)):
            for k in range(len(pos[i])):
                if pos[i][k] < pos[j][k]:
                    vel[i][k] += 1
                    vel[j][k] -= 1
                elif pos[i][k] > pos[j][k]:
                    vel[i][k] -= 1
                    vel[j][k] += 1


def apply_velocity(pos, vel):
    for i in range(len(pos)):
        for k in range(len(pos[i])):
            pos[i][k] += vel[i][k]


def calculate_energy(pos, vel):
    total = 0
    for i in range(len(pos)):
        total += sum([abs(x) for x in pos[i]]) * sum([abs(x) for x in vel[i]])
    return total


if __name__ == '__main__':
    main()

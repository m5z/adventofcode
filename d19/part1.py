from copy import copy, deepcopy


def main():
    INPUT_FILE = 'in1'
    
    with open(INPUT_FILE) as f:
        lines = [line.rstrip() for line in f.readlines()]

    blueprints = []
    for line in lines:
        split = [s.split(" ") for s in line.split('.')]
        blueprints.append(
            (
                (int(split[0][6]), 0, 0),
                (int(split[1][5]), 0, 0),
                (int(split[2][5]), int(split[2][8]), 0),
                (int(split[3][5]), 0, int(split[3][8])),
            )
        )
    
    ratings = [rate(blueprint, i + 1) for i, blueprint in enumerate(blueprints)]

    print(sum(ratings))


def rate(blueprint, id):
    max_geodes = 0
    stack = [[[1, 0, 0, 0], [0, 0, 0, 0], 24]]

    max_ore_cost = 0
    for robot in blueprint:
        if robot[0] > max_ore_cost:
            max_ore_cost = robot[0]

    clay_cost = blueprint[2][1]
    obsidian_cost = blueprint[3][2]

    iterations = 0
    while len(stack) > 0:
        iterations += 1
        state = stack.pop()

        if state[1][3] > max_geodes:
            max_geodes = state[1][3]

        potential_max_geodes = state[1][3] + (state[1][3] + state[2]) * state[2] / 2

        if state[2] > 0 and potential_max_geodes > max_geodes:
            if state[0][0] < max_ore_cost and state[1][0] <= max_ore_cost and state[1][0] >= blueprint[0][0]:
                new_state = [copy(state[0]), copy(state[1]), state[2]]
                new_state[1][0] -= blueprint[0][0]
                for i, robots in enumerate(state[0]):
                    new_state[1][i] += robots
                new_state[0][0] += 1
                new_state[2] -= 1
                stack.append(new_state)
            
            if state[0][1] < clay_cost and state[1][1] <= clay_cost and state[1][0] >= blueprint[1][0]:
                new_state = [copy(state[0]), copy(state[1]), state[2]]
                new_state[1][0] -= blueprint[1][0]
                for i, robots in enumerate(state[0]):
                    new_state[1][i] += robots
                new_state[0][1] += 1
                new_state[2] -= 1
                stack.append(new_state)

            if state[0][2] < obsidian_cost and state[1][2] <= obsidian_cost and state[1][0] >= blueprint[2][0] and state[1][1] >= blueprint[2][1]:
                new_state = [copy(state[0]), copy(state[1]), state[2]]
                new_state[1][0] -= blueprint[2][0]
                new_state[1][1] -= blueprint[2][1]
                for i, robots in enumerate(state[0]):
                    new_state[1][i] += robots
                new_state[0][2] += 1
                new_state[2] -= 1
                stack.append(new_state)

            if state[1][0] >= blueprint[3][0] and state[1][2] >= blueprint[3][2]:
                new_state = [copy(state[0]), copy(state[1]), state[2]]
                new_state[1][0] -= blueprint[3][0]
                new_state[1][2] -= blueprint[3][2]
                for i, robots in enumerate(state[0]):
                    new_state[1][i] += robots
                new_state[0][3] += 1
                new_state[2] -= 1
                stack.append(new_state)

            if state[1][0] <= max_ore_cost or state[1][1] <= clay_cost or state[1][2] <= obsidian_cost:
                for i, robots in enumerate(state[0]):
                    state[1][i] += robots
                state[2] -= 1
                stack.append(state)

    print(f'Blueprint {id}: {max_geodes}, iterations: {iterations}')
    return max_geodes * id

if __name__ == '__main__':
    main()
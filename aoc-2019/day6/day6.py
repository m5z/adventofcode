class Node:
    def __init__(self, name):
        self.name = name
        self.neighbors = []
        self.dist = None

    def __eq__(self, other):
        return self.name == other.name

    def __hash__(self):
        return hash(self.name)

    def __str__(self):
        return self.name


def dfs(p, dist):
    p.dist = dist
    for q in p.neighbors:
        if q.dist is None:
            dfs(q, dist + 1)


def count_orbits(nodes, p):
    dfs(p, 0)
    total = 0
    for node in nodes.values():
        total += node.dist
    return total


def shortest_path(p, q):
    dfs(p, 0)
    return q.dist - 2


def reset_dist(nodes):
    for node in nodes.values():
        node.dist = None


def main():
    with open('day6_input.txt') as f:
        edges = [x.rstrip().split(')') for x in f.readlines()]

    nodes = {}
    for edge in edges:
        for i in range(2):
            if edge[i] not in nodes:
                nodes[edge[i]] = Node(edge[i])
        nodes[edge[0]].neighbors.append(nodes[edge[1]])
        nodes[edge[1]].neighbors.append(nodes[edge[0]])

    print(count_orbits(nodes, nodes['COM']))

    reset_dist(nodes)

    print(shortest_path(nodes['YOU'], nodes['SAN']))


if __name__ == '__main__':
    main()

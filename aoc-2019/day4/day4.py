def main():
    lo = 273025
    hi = 767253

    total = 0
    for i in range(lo, hi + 1):
        total += check(i)
    print(total)

    total = 0
    for i in range(lo, hi + 1):
        total += check2(i)
    print(total)


def check(number):
    digits = [int(d) for d in list(str(number))]
    pair = False

    i = 0
    while i < len(digits):
        d = digits[i]
        c = 1
        while i + 1 < len(digits) and digits[i + 1] == d:
            i += 1
            c += 1
        if i + 1 < len(digits) and digits[i + 1] < d:
            return 0
        if c >= 2:
            pair = True
        i += 1

    return 1 if pair else 0

def check2(number):
    digits = [int(d) for d in list(str(number))]
    pair = False

    i = 0
    while i < len(digits):
        d = digits[i]
        c = 1
        while i + 1 < len(digits) and digits[i + 1] == d:
            i += 1
            c += 1
        if i + 1 < len(digits) and digits[i + 1] < d:
            return 0
        if c == 2:
            pair = True
        i += 1

    return 1 if pair else 0


if __name__ == '__main__':
    main()

# Bài toán TSP theo thuật toán nhánh cận
fin = open("input.txt")
n = int(fin.read(2))
m = int(fin.read(2))
maxC = float("inf")
size = n + 1

# Ma trận chi phí
c = [[None] * size for i in range(size)]
# Mảng x để thử các khả năng
x = [None] * (size)

# Mảng BestWay để ghi nhận nghiệm
BestWay = [None] * (size)

# Mảng t để lưu chi phí từ x[1] đến x[i]
t = [None] * size

# Mảng free để đánh dấu đã đi qua thành phố chưa: True = chưa đi qua
free = [True] * size
minSpending = maxC


def Input():
    # Khởi tạo ma trận chi phí ban đầu
    for i in range(1, n + 1):
        for j in range(1, n + 1):
            if i == j:
                c[i][j] = 0
            else:
                c[i][j] = maxC

    # Nhập ma trận chi phí
    for i in range(1, m + 1):
        p = int(fin.read(2))
        q = int(fin.read(2))
        r = int(fin.read(2))
        c[p][q] = r
        c[q][p] = r
    fin.close()


def init():
    # Khởi tạo
    free[1] = False
    x[1] = 1
    t[1] = 0


def writeResult():
    fout = open("output.txt", "w")
    if minSpending == maxC:
        fout.write("No solution!!!")
    else:
        for i in range(1, n + 1):
            fout.write("{} -> ".format(BestWay[i]))
        fout.write("1\n")
        fout.write("cost: {}".format(minSpending))
    fout.close()


def Try(i):
    global minSpending
    for j in range(2, n + 1):
        if free[j]:
            x[i] = j
            t[i] = t[i - 1] + c[x[i - 1]][j]
            if t[i] < minSpending:
                if i < n:
                    free[j] = False
                    Try(i + 1)
                    free[j] = True
                else:
                    if((t[n] + c[x[n]][1]) < minSpending):
                        for k in range(1, n + 1):
                            BestWay[k] = x[k]
                        minSpending = t[n] + c[x[n]][1]


if __name__ == "__main__":
    Input()
    init()
    Try(2)
    writeResult()

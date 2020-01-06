# Phân tích số thành tổng

fin = open("input.txt")
n = int(fin.readline())
fin.close()

x = [None] * (n + 1)
t = [None] * (n + 1)
x[0] = 1
t[0] = 0
fout = open("output.txt", "w")


def writeResult(k):
    for m in range(1, k):
        fout.write("{} + ".format(x[m]))
    fout.write("{}\n".format(x[k]))


def Try(i):
    for j in range(x[i - 1], n - t[i - 1] + 1):
        x[i] = j
        t[i] = t[i - 1] + x[i]
        if t[i] == n:
            writeResult(i)
        else:
            Try(i + 1)


Try(1)
fout.close()

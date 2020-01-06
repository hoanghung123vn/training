# Bài toán xếp hậu theo thuật toán quay lui
import math
fin = open("input.txt")
n = int(fin.readline())
fin.close()
a = [None] * (n + 1)
fout = open("output.txt", "w")

# Kiểm tra vị trí hàng k cột j có phải là UCV không


def ucv(k, j):
    for i in range(1, k):
        if (j == a[i]) or (math.fabs(j - a[i]) == (k - i)):
            return False
    return True


def writeResult():
    for i in range(n):
        fout.write("{} ".format(a[i + 1]))
    fout.write("\n")


def Try(k):
    for j in range(1, n + 1):
        if ucv(k, j):
            a[k] = j
            if k == n:
                writeResult()
            else:
                Try(k + 1)


Try(1)
fout.close()

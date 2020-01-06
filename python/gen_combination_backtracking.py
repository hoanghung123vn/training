# Chương trình liệt kê tổ hợp k phần tử của n
fin = open("input.txt")
n = int(fin.readline())
k = int(fin.readline())
fin.close()
x = [None] * (k + 1)
x[-1] = 0
fout = open("output.txt", "w")


def writeResult():
    for m in range(0, k):
        fout.write("{} ".format(x[m]))
    fout.write("\n")


def Try(i):
    for j in range(x[i - 1] + 1, n - k + i + 2):
        x[i] = j
        if i == k - 1:
            writeResult()
        else:
            Try(i + 1)


Try(0)
fout.close()

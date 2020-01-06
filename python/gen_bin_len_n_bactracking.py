# Chương trình liệt kê chuỗi nhị phân độ dài n bằng thuật toán quay lui


fin = open("input.txt")
n = int(fin.readline())
x = list([None]) * n
fin.close()
# for i in range(n):
#     x.append(0)
fout = open("output.txt", "w")


def writeResult():
    for i in x:
        fout.write("{} ".format(i))
    fout.write("\n")


def Try(i):
    for j in range(0, 2):
        x[i] = j
        if i == n - 1:
            writeResult()
        else:
            Try(i + 1)


Try(0)
fout.close()

# Chương trình liệt kê tổ hợp chập k của n phần tử: liệt kê tập con k phần tử của n
# import os
fin = open("input.txt")
n = int(fin.readline())
k = int(fin.readline())
fin.close()
x = list()
for i in range(k):
    x.append(i + 1)

fout = open("output.txt", "w")


def writeResult():
    # fout.write("{")
    # for i in x:
    #     fout.write("{}, ".format(i))
    # fout.seek(fout.tell() - 2, os.SEEK_SET)
    # fout.write('')
    # fout.write("}\n")
    fout.write(str("{}\n".format(set(x))))


while (True):
    if (n == 0 or k == 0):
        break
    writeResult()
    i = k - 1
    while (i >= 0 and x[i] == n - k + i + 1):
        i -= 1
    if (i >= 0):
        x[i] += 1
        for j in range(i + 1, k):
            x[j] = x[j - 1] + 1
    else:
        break
fout.close()

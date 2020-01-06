# Liệt kê chỉnh hợp không lặp chập k của n phần tử
# Chỉnh hợp không lặp giống như hoán vị - permutaion nhưng với k phần tử

fin = open("input.txt")
n = int(fin.readline())
k = int(fin.readline())
fin.close()

x = [None] * k
c = [None] * n

for m in range(n):
    c[m] = True

fout = open("output.txt", "w")


def writeResult():
    fout.write("{")
    for m in range(k - 1):
        fout.write("{}, ".format(x[m]))
    fout.write("{}".format(x[k - 1]))
    fout.write("}\n")


def Try(i):
    for j in range(1, n + 1):
        if c[j - 1]:
            x[i] = j
            if i == k - 1:
                writeResult()
            else:
                c[j - 1] = False
                Try(i + 1)
                c[j - 1] = True


Try(0)
fout.close()

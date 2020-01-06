# Chương trình sinh hoán vị n phần tử

fin = open("input.txt")
n = int(fin.readline())
x = list()
fin.close()
fout = open("output.txt", "w")
for i in range(n):
    x.append(i + 1)


def writeResult():
    for i in x:
        fout.write("{} ".format(i))
    fout.write("\n")


while True:
    if (n == 0):
        break
    writeResult()
    i = n - 2
    while (i >= 0 and x[i] > x[i + 1]):
        i -= 1
    if (i >= 0):
        j = n - 1
        while (j > i and x[j] < x[i]):
            j -= 1
        x[i], x[j] = x[j], x[i]
        k = n - 1
        i += 1
        while (k > i):
            x[i], x[k] = x[k], x[i]
            i += 1
            k -= 1
    else:
        break
fout.close()

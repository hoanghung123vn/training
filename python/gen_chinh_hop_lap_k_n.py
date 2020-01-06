# Chương trình liệt kê chỉnh hợp lặp chập k của n phần tử
# (giống như sinh chuỗi nhị phân nhưng tổng quát từ 0 đến n - 1 thay vì 0 và 1)

fin = open("input.txt")
n = int(fin.readline())
k = int(fin.readline())
fin.close()
fout = open("output.txt", "w")
x = list()
for i in range(k):
    x.append(0)


def writeResult():
    for i in x:
        fout.write("{} ".format(i))
    fout.write("\n")


while True:
    if k == 0 or n == 0:
        break
    writeResult()
    i = k - 1
    while i >= 0 and x[i] == n - 1:
        i -= 1
    if i >= 0:
        x[i] += 1
        for m in range(i + 1, k):
            x[m] = 0
    else:
        break

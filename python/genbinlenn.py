# Chương trình sinh chuối nhị phân độ dài n

fin = open("input.txt")
n = int(fin.readline())
x = list()
fin.close()
for i in range(n):
    x.append(0)
fout = open("output.txt", "w")


def writeResult():
    for i in x:
        fout.write(str("{} ").format(i))
    fout.write("\n")


# while True:
#     writeResult()
#     i = n - 1
#     while (i >= 0 and x[i] == 1):
#         i -= 1
#     if i >= 0:
#         x[i] = 1
#         for k in range(i + 1, n):
#             x[k] = 0
#     else:
#         break
# fout.close()
while True:
    if (n == 0):
        break
    writeResult()
    i = n - 1
    while (i >= 0):
        if x[i] == 1:
            x[i] = 0
            i -= 1
        else:
            x[i] = 1
            break
    else:
        break
fout.close()

x = [1, -9, 5, 7];
y = x.reduce((total, num) => {
    if (num > 0)
        return total + num;
    return total
}, 0)

console.log(y)

function hello() {
    for (let i = 1; i < 4; i++) {
        setTimeout(function () {
            console.log(i);
        }, 1000)
    }
    //console.log(i);
}
hello();

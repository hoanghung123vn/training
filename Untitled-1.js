
// function countFrom(a, b) {
//     return new Promise(function (resolve, reject) {
//         var count = a;
//         var id = setInterval(function (err, data) {
//             console.log(count);
//             if (count == b) {
//                 clearInterval(id);
//             }
//             count++;
//         }, 1000);
//     });
// }


function countFrom(a, b) {
    var count = a;
    return new Promise(function (resolve, reject) {
        var id = setInterval(function (err, data) {
            
            if (err) {
                reject(err);
            } else {
                console.log(count);
                if (count == b) { clearInterval(id); }
                count++;
                resolve(data);
            }
        }, 1000);
    });
}
console.log(typeof countFrom(1,10));
countFrom(1, 10).then(function () {
    console.log('done');
});

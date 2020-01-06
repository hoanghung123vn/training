var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static('./public'));

app.get('/', function (req, res) {
    res.render('index');
});

var users = ['abc'];
io.on('connection', function (socket) {
    console.log('co nguoi ket noi: ' + socket.id);
    socket.on('login', function (data) {
        if (users.indexOf(data) >= 0) {
            socket.emit('login-fail');
        } else {
            users.push(data);

        }
        users.forEach(function (i) {
            
        })
    });
});
server.listen(3000, () => {
    console.log('Server run on port: ',3000 );
});

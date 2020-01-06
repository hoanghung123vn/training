document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('chat').style.display = 'none';
    var socket = io('http://localhost:3000');
    document.getElementById('btnLogin').addEventListener('click', () => {
        var name = document.getElementById('textField').value;
        if (name) {
            socket.emit('login', name);
        }

    });
    socket.on('login-fail', function () {
        alert('Ten nguoi dung da ton tai');
    })
});

const exress = require('express');
const app = exress();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = 3000;

const clients = [];

io.on('connection', (socket) => {
    console.log('New connection made');

    let currentUser;

    socket.on('USER_CONNECT', () => {
        console.log('New player connected');
        for (let i = 0; i < clients.length; i++) {
            socket.emit('USER_CONNECTED', {
                name: clients[i].name,
                position: clients[i].position
            })
        }
    });

    socket.on('PLAY', (data) => {
        currentUser = {
            name: data.name,
            position: data.position
        };

        clients.push(currentUser);
        socket.emit('PLAY', currentUser);
        socket.broadcast.emit('USER_CONNECTED', currentUser);
    });

    socket.on('MOVE', (data) => {
        currentUser.position = data.position;
        socket.emit('MOVE', currentUser);
        socket.broadast.emit('MOVE', currentUser);
        console.log(currentUser.name, ': ', currentUser.position);

    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('USER_DISCONNECTED', currentUser);
        for (let i = 0; i < clients.length; i++) {
            if (clients[i].name === currentUser.name) {
                clients.splice(i, 1);
            }
        }
    });

});

server.listen(port, () => {
    console.log('**************************************');
    console.log('********** Server Connected **********');
    console.log('**************************************');
});

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/public/index.html');
});


//Tech namespace
const tech = io.of('/tech');
tech.on('connection', socket => {

  socket.on('join', data => {
    socket.join(data.room);
    tech.in(data.room).emit('message', `New user joined ${data.room}`);
  });

  console.log('User has connected.');

  socket.on('message', (data) => {
    console.log('Message: ' + data.msg );
    tech.emit('message',data.msg);
  });
  socket.on('disconnect', () => {
    console.log('User has disconnected.');
    socket.emit('message', 'A user has disconnected.');
  });
});

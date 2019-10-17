module.exports = function(io) {
    io.on('connection', socket => {
      socket.on('join chat', params => {
        socket.join(params.sender);
        socket.join(params.receiver);

        socket.room = params.receiver;
      });

      socket.on('private message', (message) => {
        socket.join(message.sender);
        socket.join(message.receiver);
        io.to(message.sender).to(message.receiver).emit('new chat message', message);
        io.emit('trigger notification', message);
      });

      socket.on('chat list', (message) => {
        io.emit('new chat list', message);
      });
  
      socket.on('start_typing', data => {
        io.to(data.receiver).emit('is_typing', data);
      });
  
      socket.on('stop_typing', data => {
        io.to(data.receiver).emit('has_stopped_typing', data);
      });
    });
};
  
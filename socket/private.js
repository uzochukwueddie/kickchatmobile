module.exports = function(io) {
    io.on('connection', socket => {
      socket.on('join chat', params => {
        socket.join(params.sender);
        socket.join(params.receiver);

        socket.room = params.receiver;
      });

      socket.on('chatList', params => {
        socket.join(params.sender);
        socket.join(params.receiver);

        io.to(params.username).to(params.receiver).emit('chatListPage', {
          sender: params.sender,
          receiver: params.receiver
        });
      });

      socket.on('privatePage', (receiver, message) => {
        if(socket.room === receiver){
          io.to(message.room).emit('refreshChatPage', {receiver});
        }
      });

      // socket.on('privatePage', () => {
      //   io.emit('refreshChatPage', {});
      // });
  
      socket.on('start_typing', data => {
        io.to(data.receiver).emit('is_typing', data);
      });
  
      socket.on('stop_typing', data => {
        io.to(data.receiver).emit('has_stopped_typing', data);
      });
    });
};
  
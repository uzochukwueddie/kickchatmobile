module.exports = function(io) {
    io.on('connection', (socket) => {
        socket.on('join stream', (params) => {
            socket.join(params.room);
        });
        
        socket.on('streamMessage', (message) => {
            io.emit('new stream', {
                post: message.text,
                user: message.sender,
                msg: message.post,
                isUser: true,
                sender: message.sender.username
            });
            // io.emit('refreshPage', {});
        });

        socket.on('postRefresh', () => {
            io.emit('refreshUserPostPage', {});
        });

        socket.on('likeRefresh', () => {
            io.emit('likeRefreshPage', {});
        });
        
        socket.on('post-img', (message) => {
            io.to(message.room).emit('post stream', {
                post: message.text,
                user: message.sender.user,
                image: message.image,
                msg: ''
            });
        });
    });
}

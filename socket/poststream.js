module.exports = function(io) {
    io.on('connection', (socket) => {
        socket.on('join stream', (params) => {
            socket.join(params.room);
        });
        
        socket.on('streamMessage', (message) => {
            io.emit('new stream', message);
        });

        socket.on('edit message', (message) => {
            io.emit('edited stream', message);
        });

        socket.on('post stream', (message) => {
            io.emit('new post stream', message);
        });

        socket.on('postRefresh', () => {
            io.emit('refreshUserPostPage', {});
        });

        socket.on('likeRefresh', (data) => {
            io.emit('likeRefreshPage', data);
        });

        socket.on('deletePost', (data) => {
            io.emit('removeDeletedPost', data);
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

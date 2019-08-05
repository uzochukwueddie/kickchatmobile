module.exports = function(io) {
    io.on('connection', (socket) => {
        socket.on('user image', (params) => {
            socket.join(params.room)
        });
        
        socket.on('profile-img', (profile) => {
            io.to(profile.room).emit('profile image', {
                image: profile.image
            });
        });
    });
}

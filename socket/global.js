module.exports = (io, Global, _) => {
    const global = new Global()
    
    io.on('connection', (socket) => {
        socket.on('online', (params) => {
            if(typeof params.user !== undefined){
                socket.join(params.room);
                global.EnterRoom(socket.id, params.user, params.room)
                io.emit('userOnline', _.uniq(global.GetRoomList(params.room)))
            }
        });
        
        socket.on('tabRefresh', () => {
            io.emit('tabRefreshPage', {}); 
        });

        socket.on('notificationPage', () => {
            socket.emit('notificationRefreshPage', {}); 
        });

        socket.on('notificationRefresh', () => {
            io.emit('notificationPageRefresh', {}); 
        });

        socket.on('pageRefresh', () => {
            io.emit('refreshViewPage', {}); 
        });

        socket.on('imageRefresh', () => {
            io.emit('imageRefreshPage', {}); 
        });

        socket.on('profileRefresh', (data) => {
            io.emit('profileRefreshPage', {
                username: data.username
            }); 
        });

        // ..........
        
        socket.on('myonline', (data) => {
            io.emit('userOnline', _.uniq(global.GetRoomList(data.room)));
        });
        
        socket.on('profile-img', (profile) => {
            io.emit('profile image', {
                image: profile.image
            })
        });
        
        socket.on('disconnect', () => {
            const user = global.RemoveUser(socket.id);
            
            if(user){
                var userData = global.GetRoomList(user.room);
                const arr = _.uniq(userData);
                const removeData = _.remove(arr, function(n) {
                                      return n == user.name
                                    });
                io.to(user.room).emit('userOnline', arr);
            }
        })
    
    });
}

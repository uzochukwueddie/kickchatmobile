const UserModel = require('../models/User');

module.exports = (io, Global, _) => {
    const global = new Global()
    
    io.on('connection', (socket) => {
        socket.on('online', async (params) => {
            if(typeof params.username !== undefined) {
                socket.join(params.room);
                await UserModel.updateOne({
                    username: params.username
                }, {
                    lastVisited: new Date(),
                    socketId: socket.id
                });
                global.EnterRoom(socket.id, params.username, params.room);
                const uniqArray = _.uniq(global.GetRoomList(params.room));
                const withoutUndefined = _.without(uniqArray, undefined);
                io.emit('usersOnline', withoutUndefined);
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

        socket.on('profile image', (data) => {
            io.emit('image show', data); 
        });

        socket.on('favorites', (data) => {
            io.emit('refresh favorites', data); 
        });
        
        socket.on('disconnect', async () => {
            const user = global.RemoveUser(socket.id);
            
            if(user){
                await UserModel.updateOne({
                    username: user.name
                }, {
                    lastVisited: new Date()
                });
                const userData = global.GetRoomList(user.room);
                const arr = _.uniq(userData);
                _.remove(arr, (n) => n == user.name);
                io.to(user.room).emit('usersOnline', arr);
            }
        })
    
    });
}

const UserModel = require('../models/User');

module.exports = function(io, User, _) {
    const userData = new User();
    io.on('connection', socket => {
      // socket.on('online', async (params) => {
      //   socket.join(data.room);
      //   await UserModel.updateOne({
      //     _id: params.id
      //   }, {
          // lastVisited: new Date(),
          // online: true,
          // socketId: socket.id
      //   });
      // });

      // socket.on('check_user', (data) => {
      //   io.emit('refresh_user', data);
      //   // io.emit('refresh_user', {});
      // });
      
      socket.on('refresh', data => {
        io.emit('refreshPage', {});
      });
  
      socket.on('online', async data => {
        socket.join(data.room);
        await UserModel.updateOne({
          username: data.username
        }, {
          lastVisited: new Date(),
          online: true,
          socketId: socket.id
        });
        userData.EnterRoom(socket.id, data.username, data.room);
        const list = userData.GetList(data.room);
        io.emit('usersOnline', _.uniq(list));
      });
  
      socket.on('disconnect', async () => {
        await UserModel.updateOne({
          socketId: socket.id
        }, {
          lastVisited: new Date(),
          online: false
        });
        const user = userData.RemoveUser(socket.id);
        if (user) {
          const userArray = userData.GetList(user.room);
          const arr = _.uniq(userArray);
          _.remove(arr, n => n === user.name);
          io.emit('usersOnline', arr);
        }
      });
    });
};
  
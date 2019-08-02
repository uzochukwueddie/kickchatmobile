class User {
    constructor() {
      this.globalArray = [];
    }
  
    EnterRoom(id, name, room, data) {
      const user = { id, name, room, data };
      this.globalArray.push(user);
      return user;
    }
  
    GetUserId(id) {
      const socketId = this.globalArray.filter(userId => userId.id === id)[0];
      return socketId;
    }
  
    RemoveUser(id) {
      const user = this.GetUserId(id);
      if (user) {
        this.globalArray = this.globalArray.filter(userId => userId.id !== id);
      }
      return user;
    }
  
    GetList(room) {
      const roomName = this.globalArray.filter(user => user.room === room);
      const names = roomName.map(user => user.name);
      return names;
    }

    GetUsersList(room){
      const users = this.globalArray.filter((user) => user.room === room);
      const namesArray = users.map((user) => {
          return {
            name: user.name,
            room: user.room,
            userdata: user.data
          }
      });
      return namesArray;
  }
}
  
module.exports = { User };
  
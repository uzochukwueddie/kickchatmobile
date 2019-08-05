class Global {
    constructor(){
        this.globalRoom = [];
    }
    
    EnterRoom(id, name, room){
        var user = {id, name, room};
        this.globalRoom.push(user);
        return user;
    }
    
    RemoveUser(id){
        var user = this.GetUser(id);
        if(user){
            this.globalRoom = this.globalRoom.filter((user) => user.id !== id);
        }
        return user;
    }
    
    GetUser(id){
        var getUser = this.globalRoom.filter((userId) => {
            return userId.id === id;
        })[0];
        return getUser;
    }
    
    GetRoomList(room){
        var roomName = this.globalRoom.filter((user) => user.room === room);
        
        var namesArray = roomName.map((user) => {
            return user.name
        });
        
        return namesArray;
    }
}

module.exports = {Global};
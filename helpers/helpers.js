const User = require('../models/User');

module.exports = {
  firstUpper: username => {
    const name = username.toLowerCase();
    return name.charAt(0).toUpperCase() + name.slice(1);
  },

  lowerCase: str => {
    return str.toLowerCase();
  },

  randomValue: num =>{
    var string = "0123456789";
    var str = '';
    var i = 0;
    while(i < num){
      str += string.charAt(Math.floor(Math.random() * string.length));
      i++;
    }
    return str;
  },

  updateChatList: async (req, message) => {
    await User.updateOne(
      {
        _id: req.user._id
      },
      {
        $pull: {
          chatList: {
            receiverId: req.params.receiverId
          }
        }
      }
    );

    await User.updateOne(
      {
        _id: req.params.receiverId
      },
      {
        $pull: {
          chatList: {
            receiverId: req.user._id
          }
        }
      }
    );

    await User.updateOne(
      {
        _id: req.user._id
      },
      {
        $push: {
          chatList: {
            $each: [
              {
                receiverId: req.params.receiverId,
                msgId: message._id
              }
            ],
            $position: 0
          }
        }
      }
    );

    await User.updateOne(
      {
        _id: req.params.receiverId
      },
      {
        $push: {
          chatList: {
            $each: [
              {
                receiverId: req.user._id,
                msgId: message._id
              }
            ],
            $position: 0
          }
        }
      }
    );
  }
};

const User = require('../models/User');
const Epl = require('../models/EPL');
const Laliga = require('../models/Laliga');
const Bundesliga = require('../models/Bundesliga');
const Ligue1 = require('../models/Ligue1');
const Seria = require('../models/SeriaA');

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
  },

  updateRoomsArray: async (req, club, country) => {
    if (country === 'England') {
      await Epl.updateOne({
          'name': club,
          'fans.userId': {$ne: req.user._id}
      }, {
        $push: {fans: {
          userId: req.user._id
        }}
      });
    }

    if (country === 'Spain') {
      await Laliga.updateOne({
        'name': club,
        'fans.userId': {$ne: req.user._id}
      }, {
        $push: {fans: {
          userId: req.user._id
        }}
      });
    }

    if (country === 'France') {
      await Ligue1.updateOne({
        'name': club,
        'fans.userId': {$ne: req.user._id}
      }, {
        $push: {fans: {
          userId: req.user._id
        }}
      });
    }

    if (country === 'Germany') {
      await Bundesliga.updateOne({
        'name': club,
        'fans.userId': {$ne: req.user._id}
      }, {
        $push: {fans: {
          userId: req.user._id
        }}
      });
    }

    if (country === 'Italy') {
      await Seria.updateOne({
        'name': club,
        'fans.userId': {$ne: req.user._id}
      }, {
        $push: {fans: {
          userId: req.user._id
        }}
      });
    }
  },

  getVideosUrl: (videos) => {
    const iframeArray = [];
    let i;
    for (i = 0; i < videos.length; i++) {
      const title = videos[i].title.split('-');
      const videosObj = {
        team1: title[0],
        team2: title[1],
        link: videos[i].embed.split('<script>')[0]
      }
      iframeArray.push(videosObj);
    }

    const srcArray = [];
    let j;
    for (j = 0; j < iframeArray.length; j++) {
      const videosObj = {
        team1: iframeArray[j].team1,
        team2: iframeArray[j].team2,
        link: iframeArray[j].link.split("src='")[1]
      }
      srcArray.push(videosObj);
    }

    const frameBorderArray = [];
    let k;
    for (k = 0; k < srcArray.length; k++) {
      const videosObj = {
        team1: srcArray[k].team1,
        team2: srcArray[k].team2,
        link: srcArray[k].link.split('frameborder')[0]
      }
      frameBorderArray.push(videosObj);
    }

    const urlObj = [];
    let kk;
    for (kk = 0; kk < frameBorderArray.length; kk++) {
      const videosObj = {
        team1: frameBorderArray[kk].team1,
        team2: frameBorderArray[kk].team2,
        link: frameBorderArray[kk].link.split("'")[0]
      }
      urlObj.push(videosObj);
    }
    return urlObj;
  }

};

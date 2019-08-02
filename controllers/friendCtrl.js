const HttpStatus = require('http-status-codes');

const Club = require('../models/Club');
const User = require('../models/User');

module.exports = {
    followUser(req, res) {
        const followUser = async () => {
          await User.updateOne(
            {
              _id: req.user._id,
              'following.userFollowed': { $ne: req.body.userFollowed }
            },
            {
              $push: {
                following: {
                  userFollowed: req.body.userFollowed
                }
              }
            }
          );
    
          await User.updateOne(
            {
              _id: req.body.userFollowed,
              'followers.follower': { $ne: req.user._id }
            },
            {
              $push: {
                followers: {
                  follower: req.user._id
                },
                notifications: {
                  senderId: req.user._id,
                  message: `${req.user.username} is now following you.`,
                  created: new Date(),
                  viewProfile: false
                }
              }
            }
          );
        };
    
        followUser()
          .then(() => {
            res.status(HttpStatus.OK).json({ message: 'Following user now' });
          })
          .catch(err => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
          });
    },

    unFollowUser(req, res) {
      const unFollow = async () => {
        await User.updateOne(
          {
            _id: req.user._id
          },
          {
            $pull: {
              following: {
                userFollowed: req.body.userFollowed
              }
            }
          }
        );
  
        await User.updateOne(
          {
            _id: req.body.userFollowed
          },
          {
            $pull: {
              followers: {
                follower: req.user._id
              },
              notifications: {
                senderId: req.user._id
              }
            }
          }
        );
      };
  
      unFollow()
        .then(() => {
          res.status(HttpStatus.OK).json({ message: 'FUnfllowing user now' });
        })
        .catch(err => {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Error occured' });
        });
    },
}
const Joi = require('joi');
const HttpStatus = require('http-status-codes');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const _ = require('lodash');

const User = require('../models/User');

module.exports = {
  async getAllUsers(req, res) {
    await User.find({})
      .populate('posts.postId')
      .populate('following.userFollowed')
      .populate('followers.follower')
      .populate('chatList.receiverId')
      .populate('chatList.msgId')
      .populate('notifications.senderId')
      .populate('blockedUsers.userId')
      .populate('blockedBy.userId')
      .then(results => {
        res.status(HttpStatus.OK).json({ message: 'User by id', results });
      })
      .catch(err => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error occured' });
      });
  },

  async getUserById(req, res) {
    await User.findOne({ _id: req.params.id })
      .populate('posts.postId')
      .populate('following.userFollowed')
      .populate('followers.follower')
      .populate('chatList.receiverId')
      .populate('chatList.msgId')
      .populate('notifications.senderId')
      .populate('blockedUsers.userId')
      .populate('blockedBy.userId')
      .populate({
        path : 'posts.postId',
        populate : {
          path : 'user'
        }
      })
      .then(result => {
        res.status(HttpStatus.OK).json({ message: 'User by id', result });
      })
      .catch(err => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error occured' });
      });
  },

  async getUsersByCountry(req, res) {
    await User.find({country: req.params.country})
      .populate('posts.postId')
      .populate('following.userFollowed')
      .populate('followers.follower')
      .populate('chatList.receiverId')
      .populate('chatList.msgId')
      .populate('notifications.senderId')
      .populate('blockedUsers.userId')
      .populate('blockedBy.userId')
      .then(results => {
        res.status(HttpStatus.OK).json({ message: 'Users by country', results });
      })
      .catch(err => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error occured' });
      });
  },

  async getUserUsername(req, res) {
    const { username } = req.params;
    const user = username.replace(/-/g, ' ');
    await User.findOne({ username: user })
      .populate('posts.postId')
      .populate('following.userFollowed')
      .populate('followers.follower')
      .populate('chatList.receiverId')
      .populate('chatList.msgId')
      .populate('notifications.senderId')
      .populate('blockedUsers.userId')
      .populate('blockedBy.userId')
      .then(result => {
        res.status(HttpStatus.OK).json({ message: 'User by username', result });
      })
      .catch(err => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error occured' });
      });
  },

  async blockUser(req, res) {
    try {
      // Add blocked user to array
      await User.updateOne({
        _id: req.user._id,
        'blockedUsers.userId': {$ne: req.body.blockedUserId},
      }, {
          $push: {
            blockedUsers: {
              userId: req.body.blockedUserId
            }
          }
      });

      // If current user is following the blocked user
      // set the blocked property to true
      await User.updateOne({
        _id: req.user._id,
        'following.userFollowed': req.body.blockedUserId
      }, {
          $set: { 'following.$.blocked': true }
      });

      await User.updateOne({
        _id: req.body.blockedUserId,
        'followers.follower': req.user._id
      }, {
          $set: { 'followers.$.blocked': true }
      });
      
      // Add the blocker to blockedBy array
      // inside the object for the blocked user
      await User.updateOne({
        _id: req.body.blockedUserId,
        'blockedBy.userId': {$ne: req.user._id},
      }, {
          $push: {
            blockedBy: {
              userId: req.user._id
            }
          }
      });
      
      return res.status(HttpStatus.OK).json({message: 'User Blocked'});
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
    }
  },

  async unblockUser(req, res) {
    try {
      await User.updateOne({
        _id: req.user._id,
      }, {
          $pull: {
            blockedUsers: {
              userId: req.body.blockedUserId
            }
          }
      });

      await User.updateOne({
        _id: req.user._id,
        'following.userFollowed': req.body.blockedUserId
      }, {
          $set: { 'following.$.blocked': false }
      });

      await User.updateOne({
        _id: req.body.blockedUserId,
        'followers.follower': req.user._id
      }, {
          $set: { 'followers.$.blocked': false }
      });
      
      await User.updateOne({
        _id: req.body.blockedUserId,
      }, {
          $pull: {
            blockedBy: {
              userId: req.user._id
            }
          }
      });
      
      return res.status(HttpStatus.OK).json({message: 'User Unblocked'});
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
    }
  },

  async changePassword(req, res) {
    const schema = Joi.object().keys({
      cpassword: Joi.string().required(),
      newPassword: Joi.string()
        .min(5)
        .required(),
      confirmPassword: Joi.string()
        .min(5)
        .optional()
    });

    const { error, value } = Joi.validate(req.body, schema);
    if (error && error.details) {
      return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
    }

    if (req.body.newPassword !== req.body.confirmPassword){
      return res.status(HttpStatus.BAD_REQUEST).json({message: 'New password and confirm password must be equal.'});
    }

    const user = await User.findOne({ _id: req.user._id });

    return bcrypt.compare(value.cpassword, user.password).then(async result => {
      if (!result) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Current password is incorrect' });
      }

      const newpassword = await User.encryptPassword(req.body.newPassword);
      await User.updateOne(
        {
          _id: req.user._id
        },
        {
          password: newpassword
        }
      )
        .then(() => {
          res
            .status(HttpStatus.OK)
            .json({ message: 'Password changed successfully' });
        })
        .catch(err => {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Error occured' });
        });
    });
  },

  async setDefaultImage(req, res) {
    const { imgId, imgVersion } = req.params;
    await User.updateOne(
      {
        _id: req.user._id
      },
      {
        userImage: imgId,
        imageVersion: imgVersion
      }
    )
    .then(() =>
      res.status(HttpStatus.OK).json({ message: 'Default image set' })
    )
    .catch(err =>
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Error occured' })
    );
  },

  async profileViewCount(req, res) {
    const dateValue = moment().format('YYYY-MM-DD');
    await User.updateOne(
      {
        _id: req.body.id,
        'notifications.senderId': { $ne: req.user._id }
      },
      {
        $push: {
          notifications: {
            senderId: req.user._id,
            message: `${req.user.username} viewed your profile`,
            created: new Date(),
            date: dateValue,
            viewProfile: true
          }
        },
        $inc: { profileViewCount: 1}
      }
    )
      .then(result => {
        res.status(HttpStatus.OK).json({ message: 'Notification sent' });
      })
      .catch(err => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error occured' });
      });
  },

  async markAllNotifications(req, res) {
    await User.updateOne(
      {
        _id: req.user._id
      },
      { $set: { 'notifications.$[elem].read': true } },
      { arrayFilters: [{ 'elem.read': false }], multi: true }
    )
      .then(() => {
        res.status(HttpStatus.OK).json({ message: 'Marked all successfully' });
      })
      .catch(err => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error occured' });
      });
  },

  async markNotification(req, res) {
    if (!req.body.deleteValue) {
      await User.updateOne(
        {
          _id: req.user._id,
          'notifications._id': req.params.id
        },
        {
          $set: { 'notifications.$.read': true }
        }
      )
        .then(() => {
          res.status(HttpStatus.OK).json({ message: 'Marked as read' });
        })
        .catch(err => {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
        });
    } else {
      await User.updateOne(
        {
          _id: req.user._id,
          'notifications._id': req.params.id
        },
        {
          $pull: {
            notifications: { _id: req.params.id }
          }
        }
      )
        .then(() => {
          res.status(HttpStatus.OK).json({ message: 'Deleted successfully' });
        })
        .catch(err => {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
        });
    }
  },

  async deleteImage(req, res) {
    try {
      const { imgId, imgVersion } = req.params;
      const user = await User.findOne({_id: req.user._id});
      // if deleted image is already set as default,
      // delete and replace default image
      if (user.userImage === imgId && user.imageVersion === imgVersion) {
        await User.updateOne(
          {
            _id: req.user._id,
          },
          {
            $pull: {
              images: { imgId }
            },
            imageVersion: '1521534486',
            userImage: 'defaultPic.png'
          }
        );
      } else {
        await User.updateOne(
          {
            _id: req.user._id,
          },
          {
            $pull: {
              images: { imgId }
            },
          }
        );
      }
      res.status(HttpStatus.OK).json({ message: 'Deleted successfully' });
    } catch (e) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
    }
  },

  async addUserLocation(req, res) {
    try {
      await User.updateOne(
        {
          _id: req.user._id
        },
        {
          city: req.body.city,
          country: req.body.country
        }
      );
      res.status(HttpStatus.OK).json({ message: 'Added' });
    } catch (e) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
    }
  },

  async saveDreamTeam(req, res) {
    try {
      const user = await User.findOne({_id: req.user._id});
      if (user.dreamTeam.length > 0) {
        await User.updateOne({
          _id: req.user._id,
        }, {
          "$set": {dreamTeam: []},
          formation: ''
        });
        await User.updateOne({
          _id: req.user._id,
        }, {
          $push: { dreamTeam: { $each: req.body.players } },
          formation: req.body.formation
        });
      } else {
        await User.updateOne({
          _id: req.user._id,
        }, {
          $push: { dreamTeam: { $each: req.body.players } },
          formation: req.body.formation
        }); 
      }
      return res.status(HttpStatus.OK).json({ message: 'Players Saved' });
    } catch (e) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
    }
  }
}
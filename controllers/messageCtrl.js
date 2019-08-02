const HttpStatus = require('http-status-codes');
const mongoose = require('mongoose');

const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const Helper = require('../helpers/helpers');

module.exports = {
  async getAllMessages(req, res) {
    try {
      const { receiverId } = req.params;
      const senderId = req.user._id;

      const conversation = await Conversation.findOne({
        $or: [
          {
            $and: [
              { 'participants.senderId': senderId },
              { 'participants.receiverId': receiverId }
            ]
          },
          {
            $and: [
              { 'participants.senderId': receiverId },
              { 'participants.receiverId': senderId }
            ]
          }
        ]
      }).select('_id');

      if (conversation) {
        const messages = await Message.findOne({
          conversationId: conversation._id
        })
        .populate('receiverId')
        .populate('senderId')
        .populate('message.senderId')
        .populate('message.receiverId')
  
        res.status(HttpStatus.OK).json({ message: 'Messages returned', messages });
      }
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occurred' });
    }
  },

  sendMessage(req, res) {
      const { receiverId } = req.params;
      const senderId = req.user._id
  
      Conversation.find({
          $or: [
            {
              participants: {
                $elemMatch: { senderId, receiverId }
              }
            },
            {
              participants: {
                $elemMatch: { senderId: receiverId, receiverId: senderId }
              }
            }
          ]
        },
        async (err, result) => {
          if (result.length > 0) {
            const msg = await Message.findOne({ conversationId: result[0]._id });
            Helper.updateChatList(req, msg);
            await Message.updateOne(
              {
                conversationId: result[0]._id
              },
              {
                $push: {
                  message: {
                    senderId,
                    receiverId,
                    body: req.body.message
                  }
                }
              }
            )
              .then(() =>
                res
                  .status(HttpStatus.OK)
                  .json({ message: 'Message sent successfully' })
              )
              .catch(err =>
                res
                  .status(HttpStatus.INTERNAL_SERVER_ERROR)
                  .json({ message: 'Error occured' })
              );
          } else {
            const newConversation = new Conversation();
            newConversation.participants.push({
              senderId,
              receiverId
            });
  
            const saveConversation = await newConversation.save();
  
            const newMessage = new Message();
            newMessage.conversationId = saveConversation._id;
            newMessage.senderId = senderId;
            newMessage.receiverId = receiverId;
            newMessage.message.push({
              senderId,
              receiverId,
              body: req.body.message
            });
  
            await User.updateOne(
              {
                _id: req.user._id
              },
              {
                $push: {
                  chatList: {
                    $each: [
                      {
                        receiverId,
                        msgId: newMessage._id
                      }
                    ],
                    $position: 0
                  }
                }
              }
            );
  
            await User.updateOne(
              {
                _id: receiverId
              },
              {
                $push: {
                  chatList: {
                    $each: [
                      {
                        receiverId: req.user._id,
                        msgId: newMessage._id
                      }
                    ],
                    $position: 0
                  }
                }
              }
            );
  
            await newMessage
              .save()
              .then(() =>
                res.status(HttpStatus.OK).json({ message: 'Message sent' })
              )
              .catch(err =>
                res
                  .status(HttpStatus.INTERNAL_SERVER_ERROR)
                  .json({ message: 'Error occured' })
              );
          }
        }
      );
  },

  async markReceiverMessages(req, res) {
    const { senderId, receiverId } = req.params;
    const sender = mongoose.Types.ObjectId(senderId);
    const receiver = mongoose.Types.ObjectId(receiverId);
    const msg = await Message.aggregate([
      { $unwind: '$message' },
      {
        $match: {
          $and: [
            { 'message.senderId': receiver, 'message.receiverId': sender }
          ]
        }
      }
    ]);

    if (msg.length > 0) {
      try {
        msg.forEach(async value => {
          await Message.updateOne(
            {
              'message._id': value.message._id
            },
            { $set: { 'message.$.isRead': true } }
          );
        });
        res.status(HttpStatus.OK).json({ message: 'Messages maked as read' });
      } catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
      }
    }
  },

  async markAllMessages(req, res) {
    const senderId = mongoose.Types.ObjectId(req.user._id);
    const msg = await Message.aggregate([
      { $match: { 'message.receiverId': senderId } },
      { $unwind: '$message' },
      { $match: { 'message.receiverId': senderId } }
    ]);

    if (msg.length > 0) {
      try {
        msg.forEach(async value => {
          await Message.updateOne(
            {
              'message._id': value.message._id
            },
            { $set: { 'message.$.isRead': true } }
          );
        });
        res.status(HttpStatus.OK).json({ message: 'All messages maked as read' });
      } catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
      }
    }
  },
}
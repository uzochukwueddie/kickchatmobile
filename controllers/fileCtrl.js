const HttpStatus = require('http-status-codes');
const cloudinary = require('cloudinary');

const Group = require('../models/Group');
const User = require('../models/User');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Helper = require('../helpers/helpers');

const EplChat = require('../models/EplChat');
const BundesligaChat = require('../models/BundesligaChat');
const SeriaAChat = require('../models/SeriaAChat');
const LaligaChat = require('../models/LaligaChat');
const Ligue1Chat = require('../models/Ligue1Chat');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});


module.exports = {
    async roomChatFile(req, res) {
        cloudinary.uploader.upload(req.body.image, function (resp) {
            const saveData = async () => {
                if(req.body.room && req.body.image && req.body.country === 'England') {
                    const room = new EplChat();
                    room.sender = req.user._id;
                    room.room = req.body.room;
                    room.imageVersion = resp.version;
                    room.imageId = resp.public_id;
                    room.message = req.body.message;
    
                    await room.save();

                    await User.updateOne(
                        {
                          _id: req.user._id
                        },
                        {
                          $push: {
                            images: {
                              imgId: resp.public_id,
                              imgVersion: resp.version
                            }
                          }
                        }
                    );
                }
                if(req.body.room && req.body.image && req.body.country === 'Germany') {
                    const room = new BundesligaChat();
                    room.sender = req.user._id;
                    room.room = req.body.room;
                    room.imageVersion = resp.version;
                    room.imageId = resp.public_id;
                    room.message = req.body.message;
    
                    await room.save();

                    await User.updateOne(
                        {
                          _id: req.user._id
                        },
                        {
                          $push: {
                            images: {
                              imgId: resp.public_id,
                              imgVersion: resp.version
                            }
                          }
                        }
                    );
                }
                if(req.body.room && req.body.image && req.body.country === 'Italy') {
                    const room = new SeriaAChat();
                    room.sender = req.user._id;
                    room.room = req.body.room;
                    room.imageVersion = resp.version;
                    room.imageId = resp.public_id;
                    room.message = req.body.message;
    
                    await room.save();

                    await User.updateOne(
                        {
                          _id: req.user._id
                        },
                        {
                          $push: {
                            images: {
                              imgId: resp.public_id,
                              imgVersion: resp.version
                            }
                          }
                        }
                    );
                }
                if(req.body.room && req.body.image && req.body.country === 'Spain') {
                    const room = new LaligaChat();
                    room.sender = req.user._id;
                    room.room = req.body.room;
                    room.imageVersion = resp.version;
                    room.imageId = resp.public_id;
                    room.message = req.body.message;
    
                    await room.save();

                    await User.updateOne(
                        {
                          _id: req.user._id
                        },
                        {
                          $push: {
                            images: {
                              imgId: resp.public_id,
                              imgVersion: resp.version
                            }
                          }
                        }
                    );
                }
                if(req.body.room && req.body.image && req.body.country === 'France') {
                    const room = new Ligue1Chat();
                    room.sender = req.user._id;
                    room.room = req.body.room;
                    room.imageVersion = resp.version;
                    room.imageId = resp.public_id;
                    room.message = req.body.message;
    
                    await room.save();

                    await User.updateOne(
                        {
                          _id: req.user._id
                        },
                        {
                          $push: {
                            images: {
                              imgId: resp.public_id,
                              imgVersion: resp.version
                            }
                          }
                        }
                    );
                }
            }
            
            saveData()
                .then(() => {
                    return res.status(HttpStatus.OK).json({message: 'File added successfully'})
                })
                .catch(err => {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occured'});
                });
        });
    },

    async privateChatFile(req, res) {
        cloudinary.uploader.upload(req.body.file, function (resp) {
            const senderId = req.user._id;
            const { receiverId } = req.params;
            Conversation.find(
                {
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
            }, (err, results) => {
                if(results.length > 0){
                    const saveData = async () => {
                        const msg = await Message.findOne({ conversationId: results[0]._id });
                        Helper.updateChatList(req, msg);
                        await Message.updateOne({
                            conversationId: results[0]._id
                        }, {
                            $push: {message: {
                                senderId,
                                receiverId,
                                imageId: resp.public_id,
                                imageVersion: resp.version,
                                body: req.body.message
                            }}
                        })
                    }
    
                    saveData()
                        .then(() => {
                            return res.status(HttpStatus.OK).json({message: 'Image sent successfully'})
                        })
                        .catch(err => {
                            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: err})
                        });
    
                } else {
                    const saveMessage = async () => {
                        const newConversation = new Conversation();
                        newConversation.participants.push({
                            senderId,
                            receiverId
                        });
    
                        const saveConversation = await newConversation.save();
    
                        const newMessage = new Message();
                        newMessage.conversationId = saveConversation._id;
                        newMessage.senderId = senderId,
                        newMessage.receiverId = receiverId, 
                        newMessage.message.push({
                            senderId,
                            receiverId,
                            imageId: resp.public_id,
                            imageVersion: resp.version,
                            body: req.body.message
                        });
                        await newMessage.save();

                        await User.updateOne({_id: req.user._id},
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
                        });
                
                        await User.updateOne({_id: receiverId},
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
                        });
                    }
    
                    saveMessage()
                        .then(() => {
                            return res.status(HttpStatus.OK).json({message: 'Image sent successfully'})
                        })
                        .catch(err => {
                            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: err});
                        });
                }
            });  
            
        });
    },

    async addProfileImage(req, res) {
      cloudinary.uploader.upload(req.body.image, async function (resp) {
          const saveData = async () => {
            const user = await User.findOne({_id: req.user._id});
            if (user.fbImage || user.googleImage) {
              await User.updateOne({
                username: user.username
              }, {
                userImage: resp.public_id,
                imageVersion: resp.version,
                changedSocialImage: true,
                googleImage: '',
                fbImage: '',
                $push: {
                  images: {
                    imgId: resp.public_id,
                    imgVersion: resp.version
                  }
                }
              });
            } else {
              await User.updateOne({
                username: req.user.username
              }, {
                  userImage: resp.public_id,
                  imageVersion: resp.version,
                  googleImage: '',
                  fbImage: '',
                  $push: {
                    images: {
                      imgId: resp.public_id,
                      imgVersion: resp.version
                    }
                  }
              });
            }
          }
          
          saveData()
              .then(() => {
                  return res.status(HttpStatus.OK).json({message: 'Profile picture added.'})
              })
              .catch(err => {
                  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'Error occurred'});
              });
      });
  }
}
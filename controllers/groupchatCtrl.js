const HttpStatus = require('http-status-codes');

const GroupChat = require('../models/Group');

module.exports = {
    async getRoomMessages(req, res) {
        try {
            // const date = new Date();
            // const daysToDeletion = 1;
            
            const roomMsg = await GroupChat.find({'room': req.params.name.replace(/-/g, ' ')})
                                        .populate('sender');
            // if (roomMsg) {
            //     var deletionDate = new Date(date.setDate(date.getDate() - daysToDeletion));
            //     const del = await GroupChat.remove({createdAt : {$lt : deletionDate}});
                
            //     const msg = await GroupChat.find({'room': req.params.name.replace(/-/g, ' ')});
                
            //     return res.status(200).json({message: 'Room Messages', room: msg})
            // }
            return res.status(HttpStatus.OK).json({message: 'Room Messages', msg: roomMsg});
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
        }
    },

    async saveRoomMsg(req, res) {
        try {
            if(req.body.message){
                const room = new GroupChat();
                room.sender = req.user._id;
                room.room = req.body.room;
                room.message = req.body.message;
                
                await room.save();
                
                return res.status(200).json({message: 'Message saved successfully'})
            }
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
        }
    }
}
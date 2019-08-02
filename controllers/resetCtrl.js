const HttpStatus = require('http-status-codes');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Helpers = require('../helpers/helpers');
const Mail = require('./mail');

module.exports = {
    async getCode(req, res) {        
        try {
            const user = await User.findOne({'email': req.body.email});

            if(!user){
                return res.status(HttpStatus.NOT_FOUND).json({message: `No Account With That Email Exist Or Email is Invalid`});
            }

            const token = Helpers.randomValue(4);
            user.passwordResetToken = token;
            user.passwordResetExpires = Date.now() + 60*60*1*1000; 

            await user.save();

            const resetLink = `
                <h2>You requested for a password reset code</h2>
                <h4>Use this 4 digit code to reset your password: ${token}</h4>
                Code is only valid for one hour.
            `;
            const options = {
                receiver: req.body.email,
                subject: 'KickChat Password Reset Code',
                html: resetLink
            };
            await Mail.sendMail(options);
            return res.status(HttpStatus.OK).json({message: `A reset code has been sent to ${user.email}`});
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
        }
    },

    async resetPassword(req, res) {
        try {
            const schema = Joi.object().keys({
                password: Joi.string()
                    .min(5)
                    .required()
            });
        
            const { error, value } = Joi.validate(req.body, schema);
            if (error && error.details) {
                return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details })
            }
    
            const user = await User.findOne({
                passwordResetToken: req.params.token,
                passwordResetExpires: { $gt: Date.now() }
            });

            if (!user) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Password reset code has expired or is invalid.' });
            }
    
            if (user) {
                return bcrypt.hash(value.password, 10, async (err, hash) => {
                    if (err) {
                        return res.status(400).json({ message: 'Error hashing password' });
                    }

                    user.password = hash;
                    user.passwordResetToken = undefined;
                    user.passwordResetExpires = undefined;
                    await user.save();
        
                    const message = `
                        <h4>This is a confirmation that you changed the password for ${user.email}</h4>
                    `;
                    const options = {
                        receiver: user.email,
                        subject: 'Password Reset Confirmation',
                        html: message
                    };
                    await Mail.sendMail(options);
                    res.status(HttpStatus.OK).json({ message: 'Password reset successfully. You can now login.' });
                });
            }
        } catch (err) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
        }
    }
}
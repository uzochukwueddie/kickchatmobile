const HttpStatus = require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const User = require('../models/User');
const Helpers = require('../helpers/helpers');

module.exports = {
    async createUser(req, res) {
        const schema = Joi.object().keys({
            username: Joi.string()
              .min(5)
              .max(10)
              .required(),
            email: Joi.string()
              .email()
              .required(),
            password: Joi.string()
              .min(5)
              .required()
        });

        const { error, value } = Joi.validate(req.body, schema);
        if (error && error.details) {
          return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details })
        }

        const email = await User.findOne({email: Helpers.lowerCase(req.body.email)});
        if (email) {
            return res.status(HttpStatus.CONFLICT).json({ message: 'Email already exist' });
        }
    
        const username = await User.findOne({username: Helpers.firstUpper(req.body.username)});
        if (username) {
            return res.status(HttpStatus.CONFLICT).json({ message: 'Username already exist' });
        }

        return bcrypt.hash(value.password, 10, (err, hash) => {
            if (err) {
              return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Error hashing password' });
            }
            const body = {
              username: Helpers.firstUpper(value.username),
              email: Helpers.lowerCase(value.email),
              password: hash
            };
            User.create(body)
              .then(user => {
                const userData = {
                  _id: user._id,
                  username: user.username
                }
                const token = jwt.sign({ data: userData }, process.env.JWT_SECRET, {});
                res.status(HttpStatus.CREATED).json({ message: 'User created successfully', token, username: user.username });
              })
              .catch(err => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured', error: err });
              });
            });
    },

    async loginUser(req, res) {
        const schema = Joi.object().keys({
          email: Joi.string()
            .email()
            .required(),
          password: Joi.string()
            .min(5)
            .required()
      });

      const { error, value } = Joi.validate(req.body, schema);
      if (error && error.details) {
        return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details })
      }
      
      await User.findOne({ email: Helpers.lowerCase(value.email) })
        .then(user => {
          if (!user) {
            return res.status(HttpStatus.NOT_FOUND).json({ message: 'Email not found' });
          }
  
          return bcrypt.compare(req.body.password, user.password).then(result => {
            if (!result) {
              return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Password is incorrect' });
            }
            const userData = {
              _id: user._id,
              username: user.username
            }
            const token = jwt.sign({ data: userData }, process.env.JWT_SECRET, {});
            return res.status(HttpStatus.OK).json({ message: 'Login successful', token, username: user.username });
          });
        })
        .catch(err => {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
        });
    },

    async loginWithFacebook(req, res) {
      try {
        const user = await User.findOne({facebook: req.body.id});
        if (user) {
          const userData = {
            _id: user._id,
            username: user.username
          }
          const token = jwt.sign({ data: userData }, process.env.JWT_SECRET, {});
          return res.status(HttpStatus.CREATED).json({ message: 'Login successfull', token, username: user.username });
        } else {
          const name = req.body.name.split(' ');
          const email = req.body.email.split('@');
          let username;
  
          const checkUsername = await User.findOne({username: Helpers.firstUpper(name[0])});
          if (checkUsername) {
              username = Helpers.firstUpper(name[1]) || Helpers.firstUpper(email[0]);
          } else {
              username = Helpers.firstUpper(name[0]);
          }
          const newUser = new User();
          newUser.facebook = req.body.id;
          newUser.username = username;
          newUser.email = req.body.email;
          newUser.fbToken = req.body.accessToken;
          newUser.fbImage = req.body.imageUrl;
  
          newUser.save((err, response) => {
            if(err){
              return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
            }
            const userData = {
              _id: response._id,
              username: response.username
            }
            const token = jwt.sign({ data: userData }, process.env.JWT_SECRET, {});
            res.status(HttpStatus.CREATED).json({ message: 'User created successfully', token, username: response.username });
            
          });
        }
      } catch (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
      }
    },

    async loginWithGoogle(req, res) {
      try {
        const user = await User.findOne({google: req.body.id});
        if (user) {
          const userData = {
            _id: user._id,
            username: user.username
          }
          const token = jwt.sign({ data: userData }, process.env.JWT_SECRET, {});
          return res.status(HttpStatus.CREATED).json({ message: 'Login successfull', token, username: user.username });
        } else {
          const name = req.body.name.split(' ');
          const email = req.body.email.split('@');
          let username;
  
          const checkUsername = await User.findOne({username: Helpers.firstUpper(name[0])});
          if (checkUsername) {
              username = Helpers.firstUpper(name[1]) || Helpers.firstUpper(email[0]);
          } else {
              username = Helpers.firstUpper(name[0]);
          }
          const newUser = new User();
          newUser.google = req.body.id;
          newUser.username = username;
          newUser.email = req.body.email;
          newUser.googleToken = req.body.accessToken;
          newUser.googleImage = req.body.imageUrl;
  
          newUser.save((err, response) => {
            if(err){
              return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
            }
            const userData = {
              _id: response._id,
              username: response.username
            }
            const token = jwt.sign({ data: userData }, process.env.JWT_SECRET, {});
            res.status(HttpStatus.CREATED).json({ message: 'User created successfully', token, username: response.username });
            
          });
        }
      } catch (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
      }
    }
}
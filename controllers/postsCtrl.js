const Joi = require('joi');
const HttpStatus = require('http-status-codes');
const cloudinary = require('cloudinary');
const moment = require('moment');
const request = require('request');

const Post = require('../models/Post');
const User = require('../models/User');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

module.exports = {
    async addPost(req, res) {
        const schema = Joi.object().keys({
            post: Joi.string().required()
        });
        const body = {
            post: req.body.post
        };
        const { error } = Joi.validate(body, schema);
        if (error && error.details) {
            return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
        }

        const postObj = {
            user: req.user._id,
            post: req.body.post,
            created: new Date()
        };

        if (req.body.post && !req.body.image) {
            Post.create(postObj)
              .then(async post => {
                await User.updateOne(
                  {
                    _id: req.user._id
                  },
                  {
                    $push: {
                      posts: {
                        postId: post._id,
                        created: new Date()
                      }
                    }
                  }
                );
                res.status(HttpStatus.OK).json({ message: 'Post created', post });
              })
              .catch(err => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
              });
        }
      
        if (req.body.post && req.body.image) {
            cloudinary.uploader.upload(req.body.image, async result => {
              const reqBody = {
                user: req.user._id,
                post: req.body.post,
                imgId: result.public_id,
                imgVersion: result.version,
                created: new Date()
              };
              Post.create(reqBody)
                .then(async post => {
                  await User.updateOne(
                    {
                      _id: req.user._id
                    },
                    {
                      $push: {
                        posts: {
                          postId: post._id,
                          created: new Date()
                        },
                        images: {
                            imgId: result.public_id,
                            imgVersion: result.version
                        }
                      }
                    }
                  );
                  res.status(HttpStatus.OK).json({ message: 'Post created', post });
                })
                .catch(err => {
                  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
                });
            });
        }
    },

    async getAllPosts(req, res) {
        try {
          const today = moment().startOf('day');
          const tomorrow = moment(today).add(1, 'days');
    
          const posts = await Post.find({
            // created: { $gte: today.toDate(), $lt: tomorrow.toDate() }
          })
            .populate('user')
            .sort({ created: -1 });
    
          const top = await Post.find({
            totalLikes: { $gte: 2 }
            // created: { $gte: today.toDate(), $lt: tomorrow.toDate() }
          })
            .populate('user')
            .sort({ created: -1 });
    
          const user = await User.findOne({ _id: req.user._id });
          if (user.city === '' && user.country === '') {
            request(
              process.env.GEO_IP,
              { json: true },
              async (err, res, body) => {
                await User.updateOne(
                  {
                    _id: req.user._id
                  },
                  {
                    city: body.city,
                    country: body.country_name
                  }
                );
              }
            );
          }
          return res.status(HttpStatus.OK).json({ message: 'All posts', posts, top });
        } catch (err) {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' });
        }
    },

    async addLike(req, res) {
      await Post.updateOne(
        {
          _id: req.body.id,
          'likes.userId': { $ne: req.user._id }
        },
        {
          $push: {
            likes: {
              userId: req.user._id
            }
          },
          $inc: { totalLikes: 1 }
        }
      )
        .then(() => {
          res.status(HttpStatus.OK).json({ message: 'You liked the post' });
        })
        .catch(err =>
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Error occured' })
        );
    },
  
    async addComment(req, res) {
      await Post.updateOne(
        {
          _id: req.body.postId
        },
        {
          $push: {
            comments: {
              userId: req.user._id,
              comment: req.body.comment,
              createdAt: new Date()
            }
          }
        }
      )
        .then(async () => {
          const comments = await Post.findOne({"_id": req.body.postId})
                                    .populate("userId")
          res.status(HttpStatus.OK).json({ message: 'Comment added to post', comments });
        })
        .catch(err => {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error occured' })
        });
    },

    async getPost(req, res) {
      await Post.findOne({ _id: req.params.id })
        .populate('user')
        .populate('comments.userId')
        .populate('likes.userId')
        .then(post => {
          res.status(HttpStatus.OK).json({ message: 'Post found', post });
        })
        .catch(err =>
          res
            .status(HttpStatus.NOT_FOUND)
            .json({ message: 'Post not found', err })
        );
    },

    async editPost(req, res) {
      const schema = Joi.object().keys({
        post: Joi.string().required(),
        id: Joi.string().required()
      });
      const { error } = Joi.validate(req.body, schema);
      if (error && error.details) {
        return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
      }
  
      const body = {
        post: req.body.post,
        created: new Date()
      };
  
      Post.findOneAndUpdate({ _id: req.body.id }, body, { new: true })
        .then(post => {
          res.status(HttpStatus.OK).json({ message: 'Post updated successfully', post });
        })
        .catch(err => {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err });
        });
    },

    async deletePost(req, res) {
      try {
        const { id } = req.params;
        const result = await Post.findByIdAndRemove(id);
        if (!result) {
          return res.status(HttpStatus.NOT_FOUND).json({ message: 'Could not delete post' });
        } else {
          await User.updateOne(
            {
              _id: req.user._id
            },
            {
              $pull: {
                posts: {
                  postId: result._id
                }
              }
            }
          );
          return res
            .status(HttpStatus.OK)
            .json({ message: 'Post deleted successfully' });
        }
      } catch (err) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: err });
      }
    }
}
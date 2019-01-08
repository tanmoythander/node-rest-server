var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
var assert = require('assert');
var auth = require('./../components/auth');
var Post = mongoose.model('Post');
var User = mongoose.model('User');


function postIsAvailable(req, res, next) {
	User.findById(req.decoded._id, function(err, user) {
		if (err) {
			return res.status(500).send({
				state: 'failure',
				message: 'Database error'
			});
		}
		user.password = undefined;
		var i = 0;
		while (i<user.posts.length) {
			if (user.posts[i].toString() === req.params.id) {
				next();
				break;
			}
			i++;
		}
		if (i === user.posts.length) {
			return res.status(404).send({
				state: 'failure',
				message: 'Post not found'
			});
		}
	});
}

//Register the authentication middleware
router.use('/posts', auth.verifyUser);
router.use('/posts/:id', postIsAvailable);
router.use('/profile', auth.verifyUser);




/////////////////
// Post API 
// /post/.....
/////////////////

// API for 
// 	creating a post
// 	get all posts
router.route('/posts')
	.post(function(req, res) {
		// Create a new post
		/**
		 * @api {post} /user/posts Create a post
 		 * @apiHeader {String} Content-Type application/json
 		 * @apiHeader {String} access-key User authentication token.
		 * @apiVersion 1.0.0
		 * @apiGroup Posts
		 * @apiName CreatePost
		 * @apiExample Example usage:
		 *   url: http://localhost:3484/user/posts
		 *
		 *   body:
		 *   {
		 *     "text": "Hello world !!!"
		 *   }
		 *
		 * @apiParam {String} text Post text.
		 */
		var newPost = new Post();
		newPost.text = req.body.text;
		newPost._created_by = req.decoded._id;
		newPost.save(function(err, post) {
			if (err) {
				return res.status(500).send({
					state: 'failure',
					message: 'Database error',
					error: err
				});
			}
			post.archieved = undefined;
			User.findById(req.decoded._id, function(err, user) {
				if (err) {
					return res.status(500).send({
						state: 'failure',
						message: 'Database error',
						error: err
					});
				}
				user.posts.push(post._id);
				user.save(function(err, user) {
					if (err) {
						return res.status(500).send({
							state: 'failure',
							message: 'Database error',
							error: err
						});
					}
				});
			});

			return res.status(200).send({
				state: 'success',
				message: 'Successfully posted',
				post: post,
				more: 'User has been populated'
			});

		});
	})
	.get(function(req, res) {
		// get all posts
		// NOTE: Every single post created by the user except deleted posts
		/**
		 * @api {get} /user/posts Get all user posts
 		 * @apiHeader {String} Content-Type application/json
 		 * @apiHeader {String} access-key User authentication token.
		 * @apiVersion 1.0.0
		 * @apiGroup Posts
		 * @apiName AllPosts
		 * @apiExample Example usage:
		 *   url: http://localhost:3484/user/posts
		 *
		 * @apiDescription Every single post by every user except deleted posts.
		 */
		var query = Post.find({
			'_created_by': req.decoded._id,
			'archieved': false
		}, function(err, posts) {
			if (err) {
				return res.status(500).send({
					state: 'failure',
					message: 'Database error',
					error: err
				});
			}
			return res.status(200).send({
				state: 'success',
				message: 'Returned all posts',
				posts: posts
			});
		});
		query.select('-archived');
		assert.ok(query.exec() instanceof require('q').makePromise);
	});

// API for
// 	a specific post to get, update and delete
router.route('/posts/:id')
	.put(function(req, res) {
		// update post

		/**
		 * @api {post} /user/posts/:id Update a post
 		 * @apiHeader {String} Content-Type application/json
 		 * @apiHeader {String} access-key User authentication token.
		 * @apiVersion 1.0.0
		 * @apiGroup Posts
		 * @apiName UpdatePost
		 * @apiExample Example usage:
		 *   url: http://localhost:3484/user/posts/:id
		 *
		 *   body:
		 *   {
		 *     "text": "Hello world !!!"
		 *   }
		 *
		 * @apiParam {String} text Post text.
		 * @apiDescription User can update only his own post through this API.
		 */
		Post.findById(req.params.id, function(err, post){
			if (err) {
				return res.status(500).send({
					state: 'failure',
					message: 'Database error',
					error: err
				});
			}
			if (!post) {
				return res.status(404).send({
					state: 'failure',
					message: 'Post not found'
				});
			}
			if (post.archieved) {
				return res.status(404).send({
					state: 'failure',
					message: 'Post is already deleted'
				});
			}
			post.text = req.body.text;
			post.updated_at = Date.now();
			post.save(function(err, post){
				if(err) {
					return res.status(500).send({
						state: 'failure',
						message: 'Database error',
						error: err
					});
				}
				post.archieved = undefined;
				return res.status(200).send({
					state: 'success',
					message: 'Successfully updated post',
					post: post
				});
			});
		});
	})
	.get(function(req, res) {
		// get a post
		/**
		 * @api {get} /user/posts/:id Get a post
 		 * @apiHeader {String} Content-Type application/json
 		 * @apiHeader {String} access-key User authentication token.
		 * @apiVersion 1.0.0
		 * @apiGroup Posts
		 * @apiName GetPost
		 * @apiExample Example usage:
		 *   url: http://localhost:3484/user/posts/:id
		 *
		 * @apiDescription User can get only his own post through this API.
		 */
		Post.findById(req.params.id, function(err, post) {
			if (err) {
				return res.status(500).send({
					state: 'failure',
					message: 'Database error',
					error: err
				});
			}
			if (!post) {
				return res.status(404).send({
					state: 'failure',
					message: 'Post not found'
				});
			}
			if (post.archieved) {
				return res.status(404).send({
					state: 'failure',
					message: 'Post is already deleted'
				});
			}
			post.archieved = undefined;
			return res.status(200).send({
				state: 'success',
				message: 'Returned post',
				post: post
			});
		});
	})
	.delete(function(req, res) {
		// delete post
		/**
		 * @api {delete} /user/posts/:id Delete a post
 		 * @apiHeader {String} Content-Type application/json
 		 * @apiHeader {String} access-key User authentication token.
		 * @apiVersion 1.0.0
		 * @apiGroup Posts
		 * @apiName DeletePost
		 * @apiExample Example usage:
		 *   url: http://localhost:3484/user/posts/:id
		 *
		 * @apiDescription User can delete only his own post through this API.
		 */
		Post.findById(req.params.id, function(err, post){
			if (err) {
				return res.status(500).send({
					state: 'failure',
					message: 'Database error',
					error: err
				});
			}
			if (!post) {
				return res.status(404).send({
					state: 'failure',
					message: 'Post not found'
				});
			}
			if (post.archieved) {
				return res.status(404).send({
					state: 'failure',
					message: 'Post is already deleted'
				});
			}
			post.archieved = true;
			post.updated_at = (new Date()).getTime();
			post.save(function(err, post) {
				if (err) {
					return res.status(500).send({
						state: 'failure',
						message: 'Database error'
					});
				}

				User.findById(req.decoded._id, function(err, user) {
					if (err) {
						return res.status(500).send({
							state: 'failure',
							message: 'Database error',
							error: err
						});
					}
					user.posts.splice(user.posts.indexOf(req.params.id), 1);
					user.save(function(err, user) {
						if (err) {
							return res.status(500).send({
								state: 'failure',
								message: 'Database error',
								error: err
							});
						}
					});
				});

				return res.status(200).send({
					state: 'success',
					message: 'Successfully deleted post',
					more: 'User has been de-populated'
				});
			});
		});
	});




/////////////////
// Profile API 
// /profile
/////////////////

// API for
//  get profile
//  update profile
router.route('/profile')
	// get profile
	/**
	 * @api {get} /user/profile Get own profile
	 * @apiHeader {String} Content-Type application/json
	 * @apiHeader {String} access-key User authentication token.
	 * @apiVersion 1.0.0
	 * @apiGroup UserProfile
	 * @apiName GetUserProfile
	 * @apiExample Example usage:
	 *   url: http://localhost:3484/user/profile
	 *
	 */
	.get(function(req, res) {
		User.findById(req.decoded._id, function(err, user) {
			if (err) {
				return res.status(500).send({
					state: 'failure',
					message: 'Error getting user',
					error: err
				});
			}
			user.password = undefined;
			return res.status(200).send({
				state: 'success',
				message: 'Returned user data',
				user: user
			});
		});
	})
	// Update profile
	/**
	 * @api {put} /user/profile Update own profile
	 * @apiHeader {String} Content-Type application/json
	 * @apiHeader {String} access-key User authentication token.
	 * @apiVersion 0.1.0
	 * @apiGroup UserProfile
	 * @apiName UpdateUserProfile
	 * @apiExample Example usage:
	 *   url: http://localhost:3484/user/profile
	 *
	 *   body:
	 *   {
	 *     "name": "John Doe",
	 *     "profile": {
	 *       "address": "Sylhet, BD",
	 *       "company": "Owlette",
	 *       "phone": "+8801413667755",
	 *       "dob": "Thu Dec 16 1971 00:00:00 GMT+0600 (+06)"
	 *     }
	 *   }
	 *
	 * @apiParam {String} name User's name.
	 * @apiParam {Object} profile Profile object.
	 * @apiParam {String} profile.address Address.
	 * @apiParam {String} profile.company Company.
	 * @apiParam {String} profile.phone Phone number.
	 * @apiParam {Date} profile.dob Date of birth.
	 */

	/**
	 * @api {put} /user/profile Update own profile
	 * @apiHeader {String} Content-Type application/json
	 * @apiHeader {String} access-key User authentication token.
	 * @apiVersion 1.0.0
	 * @apiGroup UserProfile
	 * @apiName UpdateUserProfile
	 * @apiExample Example usage:
	 *   url: http://localhost:3484/user/profile
	 *
	 *   body:
	 *   {
	 *     "name": "John Doe",
	 *     "profile": {
	 *       "address": "Sylhet, BD",
	 *       "company": "Owlette",
	 *       "phone": "+8801413667755",
	 *       "dob": 1546973225829
	 *     }
	 *   }
	 *
	 * @apiParam {String} name User's name.
	 * @apiParam {Object} profile Profile object.
	 * @apiParam {String} profile.address Address.
	 * @apiParam {String} profile.company Company.
	 * @apiParam {String} profile.phone Phone number.
	 * @apiParam {Number} profile.dob Date of birth(in millis).
	 */
	.put(function(req, res) {
		User.findById(req.decoded._id, function(err, user) {
			if (err) {
				return res.status(500).send({
					state: 'failure',
					message: 'Error getting user',
					error: err
				});
			}

			user.name = req.body.name;
			user.profile.dob = req.body.profile.dob;
			user.profile.address = req.body.profile.address;
			user.profile.company = req.body.profile.company;
			user.profile.phone = req.body.profile.phone;
			user.profile.updated_at = (new Date()).getTime();

			user.save(function(err, user) {
				if (err) {
					return res.status(500).send({
						state: 'failure',
						message: 'Error updating user',
						error: err
					});
				}
				user.password = undefined;
				return res.status(200).send({
					state: 'success',
					message: 'Updated user profile',
					user: user
				});
			});
		});
	});


module.exports = router;

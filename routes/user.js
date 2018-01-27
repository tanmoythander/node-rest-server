var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
var assert = require('assert');
var jwt = require('jsonwebtoken');
var jwtSecret = require('./../secrets/jwt');
var Post = mongoose.model('Post');
var User = mongoose.model('User');



//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {

	var token = req.headers['x-access-key'];

	// decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, jwtSecret.user.secret, function(err, decoded) {      
      if (err) {
        return res.status(400).send({
        	state: 'failure',
        	message: 'Token is invalid'
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded._doc;
        return next();
      }
    });
  }
  else {
  	// if the user is not authenticated then redirect him to the login page
		return res.status(400).send({
			state: 'failure',
			message: 'No token provided'
		});
  }	
};
function postIsAvailable(userId, itemId) {
	User.findById(userId, function(err, user) {
		if (err) {
			return false;
		}
		user.password = undefined;
		var i = 0;
		if (user.posts.length > 0) {
			while (i<user.posts.length) {
				if (user.posts[i]==itemId) return true;
				i++;
			}
		}
		return false;
	});
}

//Register the authentication middleware
router.use('/posts', isAuthenticated);
router.use('/profile', isAuthenticated);




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
		var newPost = new Post();
		newPost.text = req.body.text;
		newPost._created_by = req.decoded._id;
		newPost.save(function(err, post) {
			if (err) {
				return res.status(500).send({
					state: 'failure',
					message: 'Creating post failed',
					error: err
				});
			}
			var newPostEcho = post;
			User.findById(req.decoded._id, function(err, user) {
				if (err) {
					return res.status(500).send({
						state: 'failure',
						message: 'Error getting user',
						error: err
					});
				}
				user.posts.push(newPostEcho);
				user.save(function(err, user) {
					if (err) {
						return res.status(500).send({
							state: 'failure',
							message: 'Error populating user',
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
		var query = Post.find({
			'_created_by': req.decoded._id
		}, function(err, posts) {
			if (err) {
				return res.status(500).send({
					state: 'failure',
					message: 'Something went wrong',
					error: err
				});
			}
			var i = 0;
			while (i<posts.length) {
				if (posts[i].archieved == true) {
					posts.splice(i, 1);
					continue;
				}
				i++;
			}
			return res.status(200).send({
				state: 'success',
				message: 'Returned all posts',
				posts: posts
			});
		});


		assert.ok(query.exec() instanceof require('q').makePromise);
	});

// API for
// 	a specific post to get, update and delete
router.route('/posts/:id')
	.put(function(req, res) {
		// update post
		if (!postIsAvailable(req.decoded._id, req.params.id)) {
			return res.status(500).send({
				state: 'failure',
				message: 'Post does not belong to this user'
			});
		}
		Post.findById(req.params.id, function(err, post){
			if(err) {
				return res.status(500).send({
					state: 'failure',
					message: 'Something went wrong',
					error: err
				});
			}
			if(!post) {
				return res.status(500).send({
					state: 'failure',
					message: 'Post not found'
				});
			}

			//post.created_by = req.body.created_by;
			post.text = req.body.text;
			post.updated_at = Date.now();

			post.save(function(err, post){
				if(err) return res.send(err);

				return res.status(200).send({
					state: 'success',
					message: 'Successfully updated post',
					post: post
				});
			});
		});
	})
	.get(function(req, res) {
		// get post
		if (!postIsAvailable(req.decoded._id, req.params.id)) {
			return res.status(500).send({
				state: 'failure',
				message: 'Post does not belong to this user'
			});
		}
		Post.findById(req.params.id, function(err, post) {
			if(err) {
				return res.status(500).send({
					state: 'failure',
					message: 'Something went wrong',
					error: err
				});
			}

			return res.status(200).send({
				state: 'success',
				message: 'Returned post',
				post: post
			});
		});
	})
	.delete(function(req, res) {
		// delete post
		if (!postIsAvailable(req.decoded._id, req.params.id)) {
			return res.status(500).send({
				state: 'failure',
				message: 'Post does not belong to this user'
			});
		}
		Post.findById(req.params.id, function(err, post){
			if(err) {
				return res.status(500).send({
					state: 'failure',
					message: 'Something went wrong',
					error: err
				});
			}
			if(!post) {
				return res.status(500).send({
					state: 'failure',
					message: 'Post not found'
				});
			}


			post.archieved = true;
			post.updated_at = Date.now();

			post.save(function(err, post){
				if(err) return res.send(err);

				User.findById(req.decoded._id, function(err, user) {
					if (err) {
						return res.status(500).send({
							state: 'failure',
							message: 'Error getting user',
							error: err
						});
					}
					var i = 0;
					while (i<user.posts.length) {
						if (user.posts[i] == req.params.id) {
							user.posts.splice(i, 1);
							break;
						}
						i++;
					}
					user.save(function(err, user) {
						if (err) {
							return res.status(500).send({
								state: 'failure',
								message: 'Error de-populating user',
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
			user.profile.updated_at = Date.now();

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

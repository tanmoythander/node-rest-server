var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
var bCrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var jwtSecret = require('./../secrets/jwt');

var User = mongoose.model('User');
var Admin = mongoose.model('Admin');
	
var isValidPassword = function(user, password){
	return bCrypt.compareSync(password, user.password);
};
// Generates hash using bCrypt
var createHash = function(password){
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};


/**
 * @api {post} /token/user/signup User Signup
 * @apiHeader {String} Content-Type application/json
 * @apiVersion 0.1.0
 * @apiGroup Authentication
 * @apiExample Example usage:
 *   url: http://localhost:3484/token/user/signup
 *
 *   body:
 *   {
 *     "name": "John Doe",
 *     "email": "example@example.com",
 *     "dob": "Thu Dec 16 1971 00:00:00 GMT+0600 (+06)",
 *     "pass": "thisIsPassword"
 *   }
 *
 * @apiParam {String} name Users name.
 * @apiParam {String} email Users email.
 * @apiParam {Date} dob Users date of birth.
 * @apiParam {String} pass Users password.
 */

/**
 * @api {post} /token/user/signup User Signup
 * @apiHeader {String} Content-Type application/json
 * @apiVersion 1.0.0
 * @apiGroup Authentication
 * @apiExample Example usage:
 *   url: http://localhost:3484/token/user/signup
 *
 *   body:
 *   {
 *     "name": "John Doe",
 *     "email": "example@example.com",
 *     "dob": 1546973225829,
 *     "pass": "thisIsPassword"
 *   }
 *
 * @apiParam {String} name Users name.
 * @apiParam {String} email Users email.
 * @apiParam {Number} dob Users date of birth(in millis).
 * @apiParam {String} pass Users password.
 */
router.route('/user/signup')
	.post(function(req, res) {
		User.findOne({'email':req.body.email}, function(err, user) {
			if (err) {
				return res.status(500).send({
					state: 'failure',
					message: 'Database error',
					error: err
				});
			}
			if (user) {
				return res.status(400).send({
					state: 'failure',
					message: 'email already registered'
				});
			}
			var newUser = new User();
			newUser.name = req.body.name;
			newUser.email = req.body.email;
			newUser.profile.dob = req.body.dob;
			newUser.password = createHash(req.body.pass);
			newUser.save(function(err, user) {
				if (err) {
					return res.status(500).send({
						state: 'failure',
						message: 'Database error, failed to create user',
						error: err
					});
				}
				user.password = undefined;
				jwt.sign(user, jwtSecret.user.secret,
					{ expiresIn: jwtSecret.user.expiresIn },
					function(err, token) {
						if (err) {
							return res.status(500).send({
								state: 'failure',
								message: 'token generation failed',
								error: err
							});
						}
						return res.status(200).send({
							state: 'success',
							message: 'Successfully signed up',
							token: token,
							user: user
						});
					}
				);
			});
		});
	});

/**
 * @api {post} /token/user/login User Login
 * @apiHeader {String} Content-Type application/json
 * @apiVersion 1.0.0
 * @apiGroup Authentication
 * @apiExample Example usage:
 *   url: http://localhost:3484/token/user/login
 *
 *   body:
 *   {
 *     "email": "example@example.com",
 *     "pass": "thisIsPassword"
 *   }
 *
 * @apiParam {String} email Users email.
 * @apiParam {String} pass Users password.
 */
router.route('/user/login')
	.post(function(req, res) {
		User.findOne({'email':req.body.email}, function(err, user) {
			if (err) {
				return res.status(500).send({
					state: 'failure',
					message: 'Database error',
					error: err
				});
			}
			if (!user) {
				return res.status(404).send({
					state: 'failure',
					message: 'email not registered'
				});
			}
			if (!isValidPassword(user, req.body.pass)) {
				return res.status(400).send({
					state: 'failure',
					message: 'email or password mismatch'
				});
			}
			user.password = undefined;
			jwt.sign(user, jwtSecret.user.secret,
				{ expiresIn: jwtSecret.user.expiresIn },
				function(err, token) {
					if (err) {
						return res.status(500).send({
							state: 'failure',
							message: 'token generation failed',
							error: err
						});
					}
					return res.status(200).send({
						state: 'success',
						message: 'Successfully logged in',
						token: token,
						user: user
					});
				}
			);
		});
	});

/**
 * @api {post} /token/admin/signup Admin Signup
 * @apiHeader {String} Content-Type application/json
 * @apiVersion 0.1.0
 * @apiGroup Authentication
 * @apiExample Example usage:
 *   url: http://localhost:3484/token/admin/signup
 *
 *   body:
 *   {
 *     "name": "John Doe",
 *     "email": "example@example.com",
 *     "dob": "Thu Dec 16 1971 00:00:00 GMT+0600 (+06)",
 *     "pass": "thisIsPassword"
 *   }
 *
 * @apiParam {String} name Admins name.
 * @apiParam {String} email Admins email.
 * @apiParam {Date} dob Admins date of birth.
 * @apiParam {String} pass Admins password.
 */

/**
 * @api {post} /token/admin/signup Admin Signup
 * @apiHeader {String} Content-Type application/json
 * @apiVersion 1.0.0
 * @apiGroup Authentication
 * @apiExample Example usage:
 *   url: http://localhost:3484/token/admin/signup
 *
 *   body:
 *   {
 *     "name": "John Doe",
 *     "email": "example@example.com",
 *     "dob": 1546973225829,
 *     "pass": "thisIsPassword"
 *   }
 *
 * @apiParam {String} name Admins name.
 * @apiParam {String} email Admins email.
 * @apiParam {Number} dob Admins date of birth(in millis).
 * @apiParam {String} pass Admins password.
 */
router.route('/admin/signup')
	.post(function(req, res) {
		Admin.findOne({'email':req.body.email}, function(err, admin) {
			if (err) {
				return res.status(500).send({
					state: 'failure',
					message: 'Database error',
					error: err
				});
			}
			if (admin) {
				return res.status(400).send({
					state: 'failure',
					message: 'email already registered'
				});
			}
			var newAdmin = new Admin();
			newAdmin.name = req.body.name;
			newAdmin.email = req.body.email;
			newAdmin.profile.dob = req.body.dob;
			newAdmin.password = createHash(req.body.pass);
			newAdmin.save(function(err, admin) {
				if (err) {
					return res.status(500).send({
						state: 'failure',
						message: 'Database error, failed to create admin',
						error: err
					});
				}
				admin.password = undefined;
				jwt.sign(admin, jwtSecret.admin.secret,
					{ expiresIn: jwtSecret.admin.expiresIn },
					function(err, token) {
						if (err) {
							return res.status(500).send({
								state: 'failure',
								message: 'token generation failed',
								error: err
							});
						}
						return res.status(200).send({
							state: 'success',
							message: 'Successfully signed up',
							token: token,
							admin: admin
						});
					}
				);
			});
		});
	});

/**
 * @api {post} /token/admin/login Admin Login
 * @apiHeader {String} Content-Type application/json
 * @apiVersion 1.0.0
 * @apiGroup Authentication
 * @apiExample Example usage:
 *   url: http://localhost:3484/token/admin/login
 *
 *   body:
 *   {
 *     "email": "example@example.com",
 *     "pass": "thisIsPassword"
 *   }
 *
 * @apiParam {String} email Admins email.
 * @apiParam {String} pass Admins password.
 */
router.route('/admin/login')
	.post(function(req, res) {
		Admin.findOne({'email':req.body.email}, function(err, admin) {
			if (err) {
				return res.status(500).send({
					state: 'failure',
					message: 'Database error',
					error: err
				});
			}
			if (!admin) {
				return res.status(404).send({
					state: 'failure',
					message: 'email not registered'
				});
			}
			if (!isValidPassword(admin, req.body.pass)) {
				return res.status(400).send({
					state: 'failure',
					message: 'email or password mismatch'
				});
			}
			admin.password = undefined;
			jwt.sign(admin, jwtSecret.admin.secret,
				{ expiresIn: jwtSecret.admin.expiresIn },
				function(err, token) {
					if (err) {
						return res.status(500).send({
							state: 'failure',
							message: 'token generation failed',
							error: err
						});
					}
					return res.status(200).send({
						state: 'success',
						message: 'Successfully logged in',
						token: token,
						admin: admin
					});
				}
			);
		});
	});

module.exports = router;

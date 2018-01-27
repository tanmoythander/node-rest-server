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


router.route('/user/login')
	.post(function(req, res) {
		User.findOne({ "email" : req.body.email }, function(err, user) {
			if (err) {
				return res.send({
					state: "failure",
					message: "database error",
					error: err
				});
			}
			if (!user) {
				return res.send({
					state: "failure",
					message: "email not registered"
				});
			}
			if (!isValidPassword(user, req.body.pass)) {
				return res.send({
					state: "failure",
					message: "email or password mismatch"
				});
			}
			user.password = undefined;
			jwt.sign(user, jwtSecret.user.secret,
				{ expiresIn: jwtSecret.user.expiresIn },
				function(err, token) {
					if (err) {
						return res.send({
							state: "failure",
							message: "token generation failed",
							error: err
						});
					}
					return res.send({
						state: "success",
						message: "Successfully logged in",
						token: token,
						user: user
					});
				}
			);
		});
	});

router.route('/user/signup')
	.post(function(req, res) {
		User.findOne({ "email": req.body.email }, function(err, user) {
			if (err) {
				return res.send({
					state: "failure",
					message: "database error",
					error: err
				});
			}
			if (user) {
				return res.send({
					state: "failure",
					message: "email already registered"
				});
			}
			var newUser = new User();
			newUser.name = req.body.name;
			newUser.email = req.body.email;
			newUser.profile.dob = req.body.profile.dob;
			newUser.password = createHash(req.body.pass);
			newUser.save(function(err, user) {
				if (err) {
					return res.send({
						state: "failure",
						message: "database error, failed to create user",
						error: err
					});
				}
				user.password = undefined;
				jwt.sign(user, jwtSecret.user.secret,
					{ expiresIn: jwtSecret.user.expiresIn },
					function(err, token) {
						if (err) {
							return res.send({
								state: "failure",
								message: "token generation failed",
								error: err
							});
						}
						return res.send({
							state: "success",
							message: "Successfully signed up",
							token: token,
							user: user
						});
					}
				);
			});
		});
	});

router.route('/admin/login')
	.post(function(req, res) {
		Admin.findOne({ "email" : req.body.email }, function(err, admin) {
			if (err) {
				return res.send({
					state: "failure",
					message: "database error",
					error: err
				});
			}
			if (!admin) {
				return res.send({
					state: "failure",
					message: "email not registered"
				});
			}
			if (!isValidPassword(admin, req.body.pass)) {
				return res.send({
					state: "failure",
					message: "email or password mismatch"
				});
			}
			admin.password = undefined;
			jwt.sign(admin, jwtSecret.admin.secret,
				{ expiresIn: jwtSecret.admin.expiresIn },
				function(err, token) {
					if (err) {
						return res.send({
							state: "failure",
							message: "token generation failed",
							error: err
						});
					}
					return res.send({
						state: "success",
						message: "Successfully logged in",
						token: token,
						admin: admin
					});
				}
			);
		});
	});

router.route('/admin/signup')
	.post(function(req, res) {
		Admin.findOne({ "email": req.body.email }, function(err, admin) {
			if (err) {
				return res.send({
					state: "failure",
					message: "database error",
					error: err
				});
			}
			if (admin) {
				return res.send({
					state: "failure",
					message: "email already registered"
				});
			}
			var newAdmin = new Admin();
			newAdmin.name = req.body.name;
			newAdmin.email = req.body.email;
			newAdmin.profile.dob = req.body.profile.dob;
			newAdmin.password = createHash(req.body.pass);
			newAdmin.save(function(err, admin) {
				if (err) {
					return res.send({
						state: "failure",
						message: "database error, failed to create admin",
						error: err
					});
				}
				admin.password = undefined;
				jwt.sign(admin, jwtSecret.admin.secret,
					{ expiresIn: jwtSecret.admin.expiresIn },
					function(err, token) {
						if (err) {
							return res.send({
								state: "failure",
								message: "token generation failed",
								error: err
							});
						}
						return res.send({
							state: "success",
							message: "Successfully signed up",
							token: token,
							admin: admin
						});
					}
				);
			});
		});
	});

module.exports = router;

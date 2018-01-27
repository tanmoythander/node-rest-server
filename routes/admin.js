var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
var assert = require('assert');
var jwt = require('jsonwebtoken');
var jwtSecret = require('./../secrets/jwt');
var Admin = mongoose.model('Admin');



//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {

	var token = req.headers['x-access-key'];

	// decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, jwtSecret.admin.secret, function(err, decoded) {      
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
  	// if the admin is not authenticated then redirect him to the login page
		return res.status(400).send({
			state: 'failure',
			message: 'No token provided'
		});
  }	
};

//Register the authentication middleware
router.use('/profile', isAuthenticated);


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
		Admin.findById(req.decoded._id, function(err, admin) {
			if (err) {
				return res.status(500).send({
					state: 'failure',
					message: 'Error getting admin',
					error: err
				});
			}
			admin.password = undefined;
			return res.status(200).send({
				state: 'success',
				message: 'Returned admin data',
				admin: admin
			});
		});
	})
	// Update profile
	.put(function(req, res) {
		Admin.findById(req.decoded._id, function(err, admin) {
			if (err) {
				return res.status(500).send({
					state: 'failure',
					message: 'Error getting admin',
					error: err
				});
			}

			admin.name = req.body.name;
			admin.profile.dob = req.body.profile.dob;
			admin.profile.address = req.body.profile.address;
			admin.profile.company = req.body.profile.company;
			admin.profile.phone = req.body.profile.phone;
			admin.profile.updated_at = Date.now();

			admin.save(function(err, admin) {
				if (err) {
					return res.status(500).send({
						state: 'failure',
						message: 'Error updating admin',
						error: err
					});
				}
				admin.password = undefined;
				return res.status(200).send({
					state: 'success',
					message: 'Updated admin profile',
					admin: admin
				});
			});
		});
	});


module.exports = router;

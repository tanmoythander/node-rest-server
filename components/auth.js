var jwt = require('jsonwebtoken');
var jwtSecret = require('./../secrets/jwt');

// Verify Admin Authentication
function verifyAdmin(req, res, next) {

	var token = req.headers['access-key'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, jwtSecret.admin.secret, function(err, decoded) {
			if (err) {
				return res.status(400).send({
					state: 'failure',
					message: 'Token is dead'
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
}

// Verify User Authentication
function verifyUser(req, res, next) {

	var token = req.headers['access-key'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, jwtSecret.user.secret, function(err, decoded) {
			if (err) {
				return res.status(400).send({
					state: 'failure',
					message: 'Token is dead'
				});
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded._doc;
				return next();
			}
		});
	}
	else {
		// if the user is not authenticated
		return res.status(400).send({
			state: 'failure',
			message: 'No token provided'
		});
	}
}

module.exports = {
	verifyUser: verifyUser,
	verifyAdmin: verifyAdmin
};

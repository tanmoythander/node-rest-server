var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var logSchema = new mongoose.Schema({
	action: {
		type: String,
		required: true
	},
	_created_by: {
		type: String,
		ref: 'Admin'
	},
	created_at: {
		type: Date,
		default: Date.now
	}
});

// declare a model
mongoose.model('Log', logSchema);

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new mongoose.Schema({
	text: {
		type: String,
		required: true
	},
	_created_by: {
		type: String,
		ref: 'User'
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	updated_at: {
		type: Date,
		default: Date.now
	},
	archieved: {
		type: Boolean,
		default: false
	}
});

// declare a model
mongoose.model('Post', postSchema);

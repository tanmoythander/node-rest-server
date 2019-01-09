var mongoose = require('mongoose');
// patch to support MongoDB Server v3.5+
mongoose.plugin(function(schema) {
	schema.options.usePushEach = true;
});

var logSchema = new mongoose.Schema({
	action: {
		type: String,
		required: true
	},
	message: {
		type: String
	},
	_created_by: {
		type: String,
		required: true
	},
	created_at: {
		type: Number,
		default: (new Date()).getTime()
	}
});

// declare a model
mongoose.model('Log', logSchema);

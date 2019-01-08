var mongoose = require('mongoose');
// patch to support MongoDB Server v3.5+
mongoose.plugin(schema => {
	schema.options.usePushEach = true;
});
var Schema = mongoose.Schema;

var postSchema = new mongoose.Schema({
	text: {
		type: String,
		required: true
	},
	_created_by: {
		type: String,
		required: true
	},
	created_at: {
		type: Number,
		default: (new Date()).getTime()
	},
	updated_at: {
		type: Number,
		default: (new Date()).getTime()
	},
	archieved: {
		type: Boolean,
		default: false
	}
});

// declare a model
mongoose.model('Post', postSchema);

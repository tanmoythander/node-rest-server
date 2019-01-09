var mongoose = require('mongoose');
// patch to support MongoDB Server v3.5+
mongoose.plugin(function(schema) {
	schema.options.usePushEach = true;
});

var adminSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true,
		maxlength: 100
	},
	password: {
		type: String,
		required: true
	},
	created_at: {
		type: Number,
		default: (new Date()).getTime()
	},
	profile: {
		dob: {
			type: Number,
			required: true
		},
		address: {
			type: String,
			maxlength: 100,
			minlength: 5,
			default: 'not set'
		},
		company: {
			type: String,
			maxlength: 100,
			minlength: 2,
			default: 'not set'
		},
		phone: {
			type: String,
			minlength: 6,
			maxlength: 20,
			default: 'not set'
		},
		updated_at: {
			type: Number
		}
	},
	logs: [{
		type: String,
		required: true
	}]
});

// declare a model
mongoose.model('Admin', adminSchema);

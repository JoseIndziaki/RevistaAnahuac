'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Autor Schema
 */
var AutorSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Autor name',
		trim: true
	},
	perfil: {
		type: String,
		required: 'Por Favor rellena el perfil de este autor',
		trim: true
	},
	email: {
		type:String,
		trim: true
	},
	foto: {
		type: String,
		trim: true,
		default: 'profile.png'
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Autor', AutorSchema);
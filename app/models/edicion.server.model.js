'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Edicion Schema
 */
var EdicionSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Edicion name',
		trim: true
	},
	editorial: {
		type: String
	},
	numero: {
		type: Number
	},
	fechas: {
		type: String
	},
	portada: {
		type: String
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

mongoose.model('Edicion', EdicionSchema);
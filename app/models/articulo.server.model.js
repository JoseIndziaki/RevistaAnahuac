'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Articulo Schema
 */
var ArticuloSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Por favor especifica un nombre para el Artículo',
		trim: true
	},
	keywords: {
		type: String,
		default: 'revista, investigacion, anahuac'
	},
	numero: {
		type: Number,
		default: 1
	},
	autor_id: {
		type: String
	},
	autor: {
		type: Schema.ObjectId,
		ref: 'Autor'
	},
	resumen: {
		type: String
	},
	fecha_pub: {
		type: String
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	bibliografia: {
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

mongoose.model('Articulo', ArticuloSchema);

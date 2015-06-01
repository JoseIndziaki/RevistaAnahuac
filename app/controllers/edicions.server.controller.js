'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Edicion = mongoose.model('Edicion'),
	_ = require('lodash');

/**
 * Create a Edicion
 */
exports.create = function(req, res) {
	var edicion = new Edicion(req.body);
	edicion.user = req.user;

	edicion.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(edicion);
		}
	});
};

/**
 * Show the current Edicion
 */
exports.read = function(req, res) {
	res.jsonp(req.edicion);
};

/**
 * Update a Edicion
 */
exports.update = function(req, res) {
	var edicion = req.edicion ;

	edicion = _.extend(edicion , req.body);

	edicion.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(edicion);
		}
	});
};

/**
 * Delete an Edicion
 */
exports.delete = function(req, res) {
	var edicion = req.edicion ;

	edicion.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(edicion);
		}
	});
};

/**
 * List of Edicions
 */
exports.list = function(req, res) { 
	Edicion.find().sort('-created').populate('user', 'displayName').exec(function(err, edicions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(edicions);
		}
	});
};

/**
 * Edicion middleware
 */
exports.edicionByID = function(req, res, next, id) { 
	Edicion.findById(id).populate('user', 'displayName').exec(function(err, edicion) {
		if (err) return next(err);
		if (! edicion) return next(new Error('Failed to load Edicion ' + id));
		req.edicion = edicion ;
		next();
	});
};

/**
 * Edicion authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.edicion.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

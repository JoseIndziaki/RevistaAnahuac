'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Autor = mongoose.model('Autor'),
	_ = require('lodash');

/**
 * Create a Autor
 */
exports.create = function(req, res) {
	var autor = new Autor(req.body);
	autor.user = req.user;

	autor.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(autor);
		}
	});
};

/**
 * Show the current Autor
 */
exports.read = function(req, res) {
	res.jsonp(req.autor);
};

/**
 * Update a Autor
 */
exports.update = function(req, res) {
	var autor = req.autor ;

	autor = _.extend(autor , req.body);

	autor.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(autor);
		}
	});
};

/**
 * Delete an Autor
 */
exports.delete = function(req, res) {
	var autor = req.autor ;

	autor.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(autor);
		}
	});
};

/**
 * List of Autors
 */
exports.list = function(req, res) { 
	Autor.find().sort('-created').populate('user', 'displayName').exec(function(err, autors) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(autors);
		}
	});
};

/**
 * Autor middleware
 */
exports.autorByID = function(req, res, next, id) { 
	Autor.findById(id).populate('user', 'displayName').exec(function(err, autor) {
		if (err) return next(err);
		if (! autor) return next(new Error('Failed to load Autor ' + id));
		req.autor = autor ;
		next();
	});
};

/**
 * Autor authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.autor.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Edicion = mongoose.model('Edicion'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, edicion;

/**
 * Edicion routes tests
 */
describe('Edicion CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Edicion
		user.save(function() {
			edicion = {
				name: 'Edicion Name'
			};

			done();
		});
	});

	it('should be able to save Edicion instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Edicion
				agent.post('/edicions')
					.send(edicion)
					.expect(200)
					.end(function(edicionSaveErr, edicionSaveRes) {
						// Handle Edicion save error
						if (edicionSaveErr) done(edicionSaveErr);

						// Get a list of Edicions
						agent.get('/edicions')
							.end(function(edicionsGetErr, edicionsGetRes) {
								// Handle Edicion save error
								if (edicionsGetErr) done(edicionsGetErr);

								// Get Edicions list
								var edicions = edicionsGetRes.body;

								// Set assertions
								(edicions[0].user._id).should.equal(userId);
								(edicions[0].name).should.match('Edicion Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Edicion instance if not logged in', function(done) {
		agent.post('/edicions')
			.send(edicion)
			.expect(401)
			.end(function(edicionSaveErr, edicionSaveRes) {
				// Call the assertion callback
				done(edicionSaveErr);
			});
	});

	it('should not be able to save Edicion instance if no name is provided', function(done) {
		// Invalidate name field
		edicion.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Edicion
				agent.post('/edicions')
					.send(edicion)
					.expect(400)
					.end(function(edicionSaveErr, edicionSaveRes) {
						// Set message assertion
						(edicionSaveRes.body.message).should.match('Please fill Edicion name');
						
						// Handle Edicion save error
						done(edicionSaveErr);
					});
			});
	});

	it('should be able to update Edicion instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Edicion
				agent.post('/edicions')
					.send(edicion)
					.expect(200)
					.end(function(edicionSaveErr, edicionSaveRes) {
						// Handle Edicion save error
						if (edicionSaveErr) done(edicionSaveErr);

						// Update Edicion name
						edicion.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Edicion
						agent.put('/edicions/' + edicionSaveRes.body._id)
							.send(edicion)
							.expect(200)
							.end(function(edicionUpdateErr, edicionUpdateRes) {
								// Handle Edicion update error
								if (edicionUpdateErr) done(edicionUpdateErr);

								// Set assertions
								(edicionUpdateRes.body._id).should.equal(edicionSaveRes.body._id);
								(edicionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Edicions if not signed in', function(done) {
		// Create new Edicion model instance
		var edicionObj = new Edicion(edicion);

		// Save the Edicion
		edicionObj.save(function() {
			// Request Edicions
			request(app).get('/edicions')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Edicion if not signed in', function(done) {
		// Create new Edicion model instance
		var edicionObj = new Edicion(edicion);

		// Save the Edicion
		edicionObj.save(function() {
			request(app).get('/edicions/' + edicionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', edicion.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Edicion instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Edicion
				agent.post('/edicions')
					.send(edicion)
					.expect(200)
					.end(function(edicionSaveErr, edicionSaveRes) {
						// Handle Edicion save error
						if (edicionSaveErr) done(edicionSaveErr);

						// Delete existing Edicion
						agent.delete('/edicions/' + edicionSaveRes.body._id)
							.send(edicion)
							.expect(200)
							.end(function(edicionDeleteErr, edicionDeleteRes) {
								// Handle Edicion error error
								if (edicionDeleteErr) done(edicionDeleteErr);

								// Set assertions
								(edicionDeleteRes.body._id).should.equal(edicionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Edicion instance if not signed in', function(done) {
		// Set Edicion user 
		edicion.user = user;

		// Create new Edicion model instance
		var edicionObj = new Edicion(edicion);

		// Save the Edicion
		edicionObj.save(function() {
			// Try deleting Edicion
			request(app).delete('/edicions/' + edicionObj._id)
			.expect(401)
			.end(function(edicionDeleteErr, edicionDeleteRes) {
				// Set message assertion
				(edicionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Edicion error error
				done(edicionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Edicion.remove().exec();
		done();
	});
});
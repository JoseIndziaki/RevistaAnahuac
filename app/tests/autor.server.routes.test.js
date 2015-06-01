'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Autor = mongoose.model('Autor'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, autor;

/**
 * Autor routes tests
 */
describe('Autor CRUD tests', function() {
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

		// Save a user to the test db and create new Autor
		user.save(function() {
			autor = {
				name: 'Autor Name'
			};

			done();
		});
	});

	it('should be able to save Autor instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Autor
				agent.post('/autors')
					.send(autor)
					.expect(200)
					.end(function(autorSaveErr, autorSaveRes) {
						// Handle Autor save error
						if (autorSaveErr) done(autorSaveErr);

						// Get a list of Autors
						agent.get('/autors')
							.end(function(autorsGetErr, autorsGetRes) {
								// Handle Autor save error
								if (autorsGetErr) done(autorsGetErr);

								// Get Autors list
								var autors = autorsGetRes.body;

								// Set assertions
								(autors[0].user._id).should.equal(userId);
								(autors[0].name).should.match('Autor Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Autor instance if not logged in', function(done) {
		agent.post('/autors')
			.send(autor)
			.expect(401)
			.end(function(autorSaveErr, autorSaveRes) {
				// Call the assertion callback
				done(autorSaveErr);
			});
	});

	it('should not be able to save Autor instance if no name is provided', function(done) {
		// Invalidate name field
		autor.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Autor
				agent.post('/autors')
					.send(autor)
					.expect(400)
					.end(function(autorSaveErr, autorSaveRes) {
						// Set message assertion
						(autorSaveRes.body.message).should.match('Please fill Autor name');
						
						// Handle Autor save error
						done(autorSaveErr);
					});
			});
	});

	it('should be able to update Autor instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Autor
				agent.post('/autors')
					.send(autor)
					.expect(200)
					.end(function(autorSaveErr, autorSaveRes) {
						// Handle Autor save error
						if (autorSaveErr) done(autorSaveErr);

						// Update Autor name
						autor.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Autor
						agent.put('/autors/' + autorSaveRes.body._id)
							.send(autor)
							.expect(200)
							.end(function(autorUpdateErr, autorUpdateRes) {
								// Handle Autor update error
								if (autorUpdateErr) done(autorUpdateErr);

								// Set assertions
								(autorUpdateRes.body._id).should.equal(autorSaveRes.body._id);
								(autorUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Autors if not signed in', function(done) {
		// Create new Autor model instance
		var autorObj = new Autor(autor);

		// Save the Autor
		autorObj.save(function() {
			// Request Autors
			request(app).get('/autors')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Autor if not signed in', function(done) {
		// Create new Autor model instance
		var autorObj = new Autor(autor);

		// Save the Autor
		autorObj.save(function() {
			request(app).get('/autors/' + autorObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', autor.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Autor instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Autor
				agent.post('/autors')
					.send(autor)
					.expect(200)
					.end(function(autorSaveErr, autorSaveRes) {
						// Handle Autor save error
						if (autorSaveErr) done(autorSaveErr);

						// Delete existing Autor
						agent.delete('/autors/' + autorSaveRes.body._id)
							.send(autor)
							.expect(200)
							.end(function(autorDeleteErr, autorDeleteRes) {
								// Handle Autor error error
								if (autorDeleteErr) done(autorDeleteErr);

								// Set assertions
								(autorDeleteRes.body._id).should.equal(autorSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Autor instance if not signed in', function(done) {
		// Set Autor user 
		autor.user = user;

		// Create new Autor model instance
		var autorObj = new Autor(autor);

		// Save the Autor
		autorObj.save(function() {
			// Try deleting Autor
			request(app).delete('/autors/' + autorObj._id)
			.expect(401)
			.end(function(autorDeleteErr, autorDeleteRes) {
				// Set message assertion
				(autorDeleteRes.body.message).should.match('User is not logged in');

				// Handle Autor error error
				done(autorDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Autor.remove().exec();
		done();
	});
});
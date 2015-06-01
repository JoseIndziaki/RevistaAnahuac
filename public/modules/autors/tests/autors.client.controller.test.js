'use strict';

(function() {
	// Autors Controller Spec
	describe('Autors Controller Tests', function() {
		// Initialize global variables
		var AutorsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Autors controller.
			AutorsController = $controller('AutorsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Autor object fetched from XHR', inject(function(Autors) {
			// Create sample Autor using the Autors service
			var sampleAutor = new Autors({
				name: 'New Autor'
			});

			// Create a sample Autors array that includes the new Autor
			var sampleAutors = [sampleAutor];

			// Set GET response
			$httpBackend.expectGET('autors').respond(sampleAutors);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.autors).toEqualData(sampleAutors);
		}));

		it('$scope.findOne() should create an array with one Autor object fetched from XHR using a autorId URL parameter', inject(function(Autors) {
			// Define a sample Autor object
			var sampleAutor = new Autors({
				name: 'New Autor'
			});

			// Set the URL parameter
			$stateParams.autorId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/autors\/([0-9a-fA-F]{24})$/).respond(sampleAutor);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.autor).toEqualData(sampleAutor);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Autors) {
			// Create a sample Autor object
			var sampleAutorPostData = new Autors({
				name: 'New Autor'
			});

			// Create a sample Autor response
			var sampleAutorResponse = new Autors({
				_id: '525cf20451979dea2c000001',
				name: 'New Autor'
			});

			// Fixture mock form input values
			scope.name = 'New Autor';

			// Set POST response
			$httpBackend.expectPOST('autors', sampleAutorPostData).respond(sampleAutorResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Autor was created
			expect($location.path()).toBe('/autors/' + sampleAutorResponse._id);
		}));

		it('$scope.update() should update a valid Autor', inject(function(Autors) {
			// Define a sample Autor put data
			var sampleAutorPutData = new Autors({
				_id: '525cf20451979dea2c000001',
				name: 'New Autor'
			});

			// Mock Autor in scope
			scope.autor = sampleAutorPutData;

			// Set PUT response
			$httpBackend.expectPUT(/autors\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/autors/' + sampleAutorPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid autorId and remove the Autor from the scope', inject(function(Autors) {
			// Create new Autor object
			var sampleAutor = new Autors({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Autors array and include the Autor
			scope.autors = [sampleAutor];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/autors\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAutor);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.autors.length).toBe(0);
		}));
	});
}());
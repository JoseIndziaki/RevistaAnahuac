'use strict';

(function() {
	// Edicions Controller Spec
	describe('Edicions Controller Tests', function() {
		// Initialize global variables
		var EdicionsController,
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

			// Initialize the Edicions controller.
			EdicionsController = $controller('EdicionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Edicion object fetched from XHR', inject(function(Edicions) {
			// Create sample Edicion using the Edicions service
			var sampleEdicion = new Edicions({
				name: 'New Edicion'
			});

			// Create a sample Edicions array that includes the new Edicion
			var sampleEdicions = [sampleEdicion];

			// Set GET response
			$httpBackend.expectGET('edicions').respond(sampleEdicions);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.edicions).toEqualData(sampleEdicions);
		}));

		it('$scope.findOne() should create an array with one Edicion object fetched from XHR using a edicionId URL parameter', inject(function(Edicions) {
			// Define a sample Edicion object
			var sampleEdicion = new Edicions({
				name: 'New Edicion'
			});

			// Set the URL parameter
			$stateParams.edicionId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/edicions\/([0-9a-fA-F]{24})$/).respond(sampleEdicion);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.edicion).toEqualData(sampleEdicion);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Edicions) {
			// Create a sample Edicion object
			var sampleEdicionPostData = new Edicions({
				name: 'New Edicion'
			});

			// Create a sample Edicion response
			var sampleEdicionResponse = new Edicions({
				_id: '525cf20451979dea2c000001',
				name: 'New Edicion'
			});

			// Fixture mock form input values
			scope.name = 'New Edicion';

			// Set POST response
			$httpBackend.expectPOST('edicions', sampleEdicionPostData).respond(sampleEdicionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Edicion was created
			expect($location.path()).toBe('/edicions/' + sampleEdicionResponse._id);
		}));

		it('$scope.update() should update a valid Edicion', inject(function(Edicions) {
			// Define a sample Edicion put data
			var sampleEdicionPutData = new Edicions({
				_id: '525cf20451979dea2c000001',
				name: 'New Edicion'
			});

			// Mock Edicion in scope
			scope.edicion = sampleEdicionPutData;

			// Set PUT response
			$httpBackend.expectPUT(/edicions\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/edicions/' + sampleEdicionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid edicionId and remove the Edicion from the scope', inject(function(Edicions) {
			// Create new Edicion object
			var sampleEdicion = new Edicions({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Edicions array and include the Edicion
			scope.edicions = [sampleEdicion];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/edicions\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEdicion);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.edicions.length).toBe(0);
		}));
	});
}());
'use strict';

// Autors controller
angular.module('autors').controller('AutorsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Autors',
	function($scope, $stateParams, $location, Authentication, Autors) {
		$scope.authentication = Authentication;

		// Create new Autor
		$scope.create = function() {
			// Create new Autor object
			var autor = new Autors ({
				name: this.name,
				perfil: this.perfil,
				email: this.email
			});

			// Redirect after save
			autor.$save(function(response) {
				$location.path('autors/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Autor
		$scope.remove = function(autor) {
			if ( autor ) { 
				autor.$remove();

				for (var i in $scope.autors) {
					if ($scope.autors [i] === autor) {
						$scope.autors.splice(i, 1);
					}
				}
			} else {
				$scope.autor.$remove(function() {
					$location.path('autors');
				});
			}
		};

		// Update existing Autor
		$scope.update = function() {
			var autor = $scope.autor;

			autor.$update(function() {
				$location.path('autors/' + autor._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Autors
		$scope.find = function() {
			$scope.autors = Autors.query();
		};

		// Find existing Autor
		$scope.findOne = function() {
			$scope.autor = Autors.get({ 
				autorId: $stateParams.autorId
			});
		};
	}
]);
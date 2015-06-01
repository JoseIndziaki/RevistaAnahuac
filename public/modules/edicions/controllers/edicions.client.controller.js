'use strict';

// Edicions controller
angular.module('edicions').controller('EdicionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Edicions', 'Articulos','$filter',
	function($scope, $stateParams, $location, Authentication, Edicions, Articulos, $filter) {
		$scope.authentication = Authentication;

		var ediciones = this;

		// Create new Edicion
		$scope.create = function() {
			// Create new Edicion object
			var edicion = new Edicions ({
				name: this.name,
				editorial: this.editorial,
				numero: this.numero,
				fechas: this.fechas
			});

			// Redirect after save
			edicion.$save(function(response) {
				$location.path('edicions/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Edicion
		$scope.remove = function(edicion) {
			if ( edicion ) { 
				edicion.$remove();

				for (var i in $scope.edicions) {
					if ($scope.edicions [i] === edicion) {
						$scope.edicions.splice(i, 1);
					}
				}
			} else {
				$scope.edicion.$remove(function() {
					$location.path('edicions');
				});
			}
		};

		// Update existing Edicion
		$scope.update = function() {
			var edicion = $scope.edicion;

			edicion.$update(function() {
				$location.path('edicions/' + edicion._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Edicions
		$scope.find = function() {
			$scope.edicions = Edicions.query();
		};

		var numero;
		// Find existing Edicion
		$scope.findOne = function() {
			$scope.edicion = Edicions.get({ 
				edicionId: $stateParams.edicionId
			});
			$scope.edicion.$promise.then(function (result) {
				ediciones.darNumero(result.numero);
			});
			$scope.articulos = Articulos.query();
			console.log($scope.edicion);

		};
		// Find existing Edicion
		ediciones.findArticulos = function(articulo) {
			console.log(numero);
			if(articulo.numero===numero) return articulo;
		};

		ediciones.darNumero = function(num){
			numero = num;
		}

	}
]);
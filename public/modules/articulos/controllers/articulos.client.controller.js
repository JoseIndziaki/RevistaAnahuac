'use strict';

// Articulos controller
angular.module('articulos').controller('ArticulosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articulos', 'Autors',
	function($scope, $stateParams, $location, Authentication, Articulos, Autors) {
		$scope.authentication = Authentication;

		// Create new Articulo
		$scope.create = function() {
			// Create new Articulo object
			var articulo = new Articulos ({
				name: this.name,
				autor_id: this.autor,
				content: this.content
			});

			// Redirect after save
			articulo.$save(function(response) {
				$location.path('articulos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Articulo
		$scope.remove = function(articulo) {
			if ( articulo ) {
				articulo.$remove();

				for (var i in $scope.articulos) {
					if ($scope.articulos [i] === articulo) {
						$scope.articulos.splice(i, 1);
					}
				}
			} else {
				$scope.articulo.$remove(function() {
					$location.path('articulos');
				});
			}
		};

		// Update existing Articulo
		$scope.update = function() {
			var articulo = $scope.articulo;

			articulo.$update(function() {
				$location.path('articulos/' + articulo._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Articulos
		$scope.find = function() {
			$scope.articulos = Articulos.query();
		};

		// Find existing Articulo
		$scope.findOne = function() {
			$scope.articulo = Articulos.get({
				articuloId: $stateParams.articuloId
			});
		};

		//Buscar Autores
		$scope.buscarAutores = function(){
			$scope.autores = Autors.query();
		}
	}
]);
angular.module('articulos').directive('bindHtmlUnsafe', function( $compile ) {
    return function( $scope, $element, $attrs ) {

        var compile = function( newHTML ) { // Create re-useable compile function
            newHTML = $compile(newHTML)($scope); // Compile html
            $element.html('').append(newHTML); // Clear and append it
        };

        var htmlName = $attrs.bindHtmlUnsafe; // Get the name of the variable 
                                              // Where the HTML is stored

        $scope.$watch(htmlName, function( newHTML ) { // Watch for changes to 
                                                      // the HTML
            if(!newHTML) return;
            compile(newHTML);   // Compile it
        });

    };
});
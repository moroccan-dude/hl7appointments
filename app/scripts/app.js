'use strict';

/**
 * @ngdoc overview
 * @name hl7appointmentApp
 * @description
 * HL7 appointment application
 */
angular.module('hl7appointmentApp', [
    'ngRoute',
    'ui.calendar'
])
.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
         templateUrl: 'views/home.html',
         controller: 'HomeCtrl'
      })
      .otherwise({
         redirectTo: '/'
      });
})
.directive('datepicker', function() {
    return {
        restrict: 'A',
        require: '^ngModel',
        link: function(scope, element, attrs, ngModel) {
        	setTimeout( function(){
        		  var options = scope.getDefaultDatepickerOptions( element );
        		  element.datepicker( options );

        		  element.datepicker('option', 'onSelect', function(dateText, instance){
        			  var date = element.datepicker( 'getDate' );

        			  ngModel.$setViewValue( date );
        			  ngModel.$modelValue = date;
        			  scope.$apply();
	       		  });
        	}, 0);
        }
    };
});

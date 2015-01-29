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
});

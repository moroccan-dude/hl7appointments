'use strict';

/**
 * @ngdoc function
 * @name hl7appointmentAppApp.controller:MainCtrl
 * @description
 * # HomeCtrl
 * Controller of the hl7appointmentApp
 */
angular.module('hl7appointmentApp')
  .controller('HomeCtrl', function ($scope) {
	     $scope.appointmentsEvtSources = [
	         {
	              overlap: false,
	              className: ['sales-calendar-item']
	         }
	     ];
	  
	  	 $scope.calConfig = {
				editable: false,
			    header:{
			         left: 'prev',
			         center: 'title',
			         right: 'next'
			    },
			    eventClick: function(calEvent, jsEvent, view) {
				    $location.path( '/admin/sale/' + calEvent.saleId );
				},
				eventRender: function( event, element, view ) { 
			        
			    },
				viewRender: function(view, element ){ //need to refresh eventSources when doing prev/next month
					if( !$scope.sales ) return;

					buildSalesEvents();
				}
		 };
  });

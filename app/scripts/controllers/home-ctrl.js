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
	              className: ['appointment-calendar-item'],
	              events: []
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
					var appmt;
					for( var i = 0 ; i < $scope.appointmentsEvtSources.events ; i++ )
					{
						appmt = $scope.appointmentsEvtSources.events[i];
						if( appmt == calEvent.appointment )
						{
							$scope.currentAppointment = appmt;
							break;
						}
					}

				    $scope.showAppointmentForm();
				},
				dayClick: function( date, jsEvent, view ) {
					$scope.showNewAppointmentForm( date );
			    },
				viewRender: function(view, element ){ //need to refresh eventSources when doing prev/next month
					if( !$scope.sales ) return;

					buildSalesEvents();
				}
		 };
		 
	   $scope.getDefaultDatepickerOptions = function( htmlElement ){
		   var options = {
			  dateFormat: 'yy-mm-dd'
		   };

		   return options;
	   };		 

	  	 $scope.showAppointmentForm = function(){
	  		   $scope.appointmentFormVisible = true;
	  	 };

	  	 $scope.showNewAppointmentForm = function( appmtDate ){
	  		   $scope.appointmentFormVisible = true;

	  		   $scope.currentAppointment = {
				    uid: null,
					sourceUid: 'a1f48367-48c3-405f-9283-9b8ad88295af',
					messageType: 'S12',
					sch: {
						placerAppointmentID: Math.random() * (999999999 - 1) + 1,
						appointmentDate: appmtDate._d
					},
					patient: {
						lastName: 'DEVELOPPER'
					},
					pv1: {
						assignedPatientLocation: {
							department: 'HDPS_APPLICATION_UNIQUE_ID'
						},
						referringDoctor: {
							
						}
					},
					isPersisted: false
			   };
			   
			   setTimeout(function(){
	  		   		angular.element('#apptmDate').val( appmtDate._i );
	  		   }, 100);
	  	 };

	  	 $scope.hideAppointmentForm = function(){
	  		   $scope.appointmentFormVisible = false;
	  	 };
	  	 
	  	 $scope.deleteCurrentAppointment = function(){
	  	 	   
	  	 };

	  	 $scope.saveCurrentAppointment = function(){
	  		   if( $scope.appmtForm.$invalid ) return;
	  		   
	  		   var apptDate = $scope.currentAppointment.sch.appointmentDate;
	  		   var startDate = JSON.stringify(apptDate).replace(/"/, '').substr(0, 10); //date format: 'yyyy-mm-dd'
			   var endDate = startDate;
			   
			   $scope.appointmentsEvtSources.events.push( {appointment: $scope.currentAppointment, title: $scope.currentAppointment.patient.code, start: startDate, end: endDate} );
	  	 };
  });

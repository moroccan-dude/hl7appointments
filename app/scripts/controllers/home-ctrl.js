'use strict';

/**
 * @ngdoc function
 * @name hl7appointmentAppApp.controller:MainCtrl
 * @description
 * # HomeCtrl
 * Controller of the hl7appointmentApp
 */
angular.module('hl7appointmentApp')
  .controller('HomeCtrl', ['$scope', '$http', function ($scope, $http) {
	  	 var CREATE_APPMT_STATUS = 'S12';
	  	 var UPDATE_APPMT_STATUS = 'S14';
	  	 var DELETE_APPMT_STATUS = 'S15';

	  	 $scope.postOptions = {url: 'http://localhost:8080/hl7broker/router/incoming/format/HDPSv1'};

	  	 $scope.forms = { appmtForm: {} };

	  	 $scope.messages = {};

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
					var events = $scope.appointmentsEvtSources[0].events;
					for( var i = 0 ; i < events.length ; i++ )
					{
						appmt = events[i].appointment;
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
					//if( $scope.appointmentsEvtSources[0].events.length == 0 ) return;
					//refreshAppointmentsEvents();

					if( $scope.moveCalendarToDate )
					{
						view.calendar.gotoDate($scope.moveCalendarToDate);
						$scope.moveCalendarToDate = undefined;
					}
				}
		 };

	  	 var refreshAppointmentsEvents = function(){
	  		 var events = angular.copy( $scope.appointmentsEvtSources[0].events );
	  		 $scope.appointmentsEvtSources[0].events = events;
	  	 };

	     $scope.getDefaultDatepickerOptions = function( htmlElement ){
		     var options = {
			    dateFormat: 'yy-mm-dd'
		     };

		     return options;
	     };

	  	 $scope.showAppointmentForm = function(){
			   $scope.currentAppointmentOrig = angular.copy( $scope.currentAppointment );
	  		   $scope.appointmentFormVisible = true;

	  		   setTimeout(function(){
			   	  	angular.element('#apptmDate').val( moment($scope.currentAppointment.sch.appointmentDate).format('YYYY-MM-DD') );
	  		   }, 200);
	  	 };

	  	 $scope.showNewAppointmentForm = function( appmtDate ){
	  		   $scope.messages.savingSuccess = false;
	  		   $scope.messages.savingError = false;
	  		   $scope.currentAppointmentOrig = undefined;

	  		   $scope.appointmentFormVisible = true;

	  		   var randomId = Math.floor(Math.random() * (999999999 - 1) + 1);

	  		   $scope.currentAppointment = {
				    uid: null,
					sourceUid: 'b1f48367-48c3-405f-9283-9b8ad88295af',
					messageType: CREATE_APPMT_STATUS,
					sch: {
						placerAppointmentID: randomId,
						appointmentDurationUnits: 'MIN',
						appointmentDate: appmtDate._d
					},
					patient: {
						pid: {
							id: 30,
							lastName: 'DEVELOPPER'
						},
						pv1: {
							assignedPatientLocation: {
								department: 'Service d\u0027h\u00e9patologie de l\u0027h\u00f4pital Saint-Pierre'
							},
							attendingDoctor: {
								providerID: 0
							},
							visitNumber: randomId
						},
						pv2: {

						}
					},
					isPersisted: false, /* already saved on server */
					isSaved: false /* if added to appointment list : see $scope.saveCurrentAppointment*/
			   };

			   setTimeout(function(){
	  		   		angular.element('#apptmDate').val( appmtDate._i );
	  		   }, 200);
	  	 };

	  	 $scope.hideAppointmentForm = function(){
	  		   $scope.appointmentFormVisible = false;
	  	 };

	  	 $scope.cancelAppointmentUpdate = function(){
	  		   if( $scope.currentAppointment.isSaved && $scope.currentAppointmentOrig ) //revert to old values
	  		   {
				    $scope.currentAppointment = angular.copy( $scope.currentAppointmentOrig );
			   }

			   if( $scope.currentAppointment.sch.appointmentDate )
			   {
			   	    var fdate = moment($scope.currentAppointment.sch.appointmentDate).format( 'YYYY-MM-DD' );
			   	    $scope.moveCalendarToDate = fdate;
		   	   }

			   $scope.hideAppointmentForm();
	  	 };

	  	 $scope.deleteCurrentAppointment = function(){
	  	 	   if( !$scope.currentAppointment.isSaved ) //same as cancelling
	  	 	   {
	  	 		   $scope.hideAppointmentForm();
	  	 	   }
	  	 	   else
	  	 	   {
	  	 		   if( !$scope.currentAppointment.isPersisted )
	  	 		   {
		  	 		   var appmt, delIndex = -1;
		  	 		   for( var i = 0 ; i < $scope.appointmentsEvtSources[0].events.length ; i++ )
		  	 		   {
		  	 			   appmt = $scope.appointmentsEvtSources[0].events[i].appointment;
		  	 			   if( appmt == $scope.currentAppointment )
		  	 			   {
		  	 				   delIndex = i;
		  	 				   break;
		  	 			   }
		  	 		   }

		  	 		   if( delIndex >= 0 )
		  	 		   {
		  	 			   $scope.appointmentsEvtSources[0].events.splice( delIndex, 1 );
		  	 		   }

		  	 		   refreshAppointmentsEvents();
	  	 		   }
	  	 		   else
	  	 		   {
	  	 			   $scope.currentAppointment.messageType = DELETE_APPMT_STATUS;
	  	 		   }

	  	 		   $scope.hideAppointmentForm();
	  	 	   }
	  	 };

	  	 $scope.saveCurrentAppointment = function(){
	  		   if( $scope.forms.appmtForm.$invalid ) return;

	  		   var apptDate = $scope.currentAppointment.sch.appointmentDate;
	  		   var startDate = moment(apptDate).format( 'YYYY-MM-DD' );
			   var endDate = startDate;
			   var appmtTime = moment($scope.currentAppointment.sch.appointmentTime).format( 'hh:mm A' );
			   var eventTitle = 'Patient ' + $scope.currentAppointment.patient.pid.code + '\nAt ' + appmtTime;

			   if( !$scope.currentAppointment.isSaved )
			   {
			   	  var evt = buildEvent( $scope.currentAppointment );
			   	  $scope.currentAppointment.isSaved = true;
			   	  $scope.appointmentsEvtSources[0].events.push( {appointment: $scope.currentAppointment, title: eventTitle, start: startDate, end: endDate} );
		   	   }
		   	   else
		   	   {
					if( $scope.currentAppointment.isPersisted )
					{
						$scope.currentAppointment.messageType = UPDATE_APPMT_STATUS;
			   		}

					var events = $scope.appointmentsEvtSources[0].events;
					var evt
					for( var i = 0 ; i < events.length ; i++ )
					{
						evt = events[i];
						if( evt.appointment == $scope.currentAppointment )
						{
							evt.startDate = startDate;
							evt.endDate = endDate;
							evt.title = eventTitle;
							break;
						}
					}
			   }

			   $scope.moveCalendarToDate = startDate;

			   angular.element('.appointments-calendar').fullCalendar( 'refetchEvents' );

			   $scope.hideAppointmentForm();
	  	 };

	  	 var buildEvent = function( appmt ){
	  		   var apptDate = appmt.sch.appointmentDate;
	  		   var startDate = JSON.stringify(apptDate).replace(/"/, '').substr(0, 10); //date format: 'yyyy-mm-dd'
			   var endDate = startDate;
			   var appmtTime = moment(appmt.sch.appointmentTime).format( 'HH:mm' );
			   var eventTitle = 'Patient Code: ' + appmt.patient.code + '\nAt ' + appmtTime;

			   appmt.isSaved = true;
			   if( appmt.isPersisted )
			   {
				   appmt.messageType = UPDATE_APPMT_STATUS;
			   }

			   var evt = {appointment: $scope.appmt, title: eventTitle, start: startDate, end: endDate};
			   return evt;
		};

		$scope.postAppointments = function(){
				$scope.messages.savingSuccess = false;
				$scope.messages.savingError = false;

				var events = $scope.appointmentsEvtSources[0].events;
				var apptm, apptmTemp, appointments = [];
				var apptmDatTime, expectedAdmitDate;
				for( var i = 0 ; i < events.length ; i++ )
			    {
					apptm = events[i].appointment;
					apptmDatTime = moment(apptm.sch.appointmentDate).format( 'YYYYMMDD' ) + moment(apptm.sch.appointmentTime).format( 'HHmm' );
					expectedAdmitDate = moment(apptm.sch.appointmentDate).set({'hour': apptm.sch.appointmentTime.getHours(), 'minute': apptm.sch.appointmentTime.getMinutes()}).add('minutes', apptm.sch.appointmentDuration).format( 'YYYYMMDDHHmm' );
					apptmTemp = angular.copy( apptm );
					apptmTemp.sch.appointmentTimingQuantity = apptmDatTime;
					apptmTemp.patient.pv2.expectedAdmitDateTime = expectedAdmitDate;
					//remove custom properties
					delete apptmTemp.sch.appointmentDate;
					delete apptmTemp.sch.appointmentTime;
					delete apptmTemp.isPersisted;
					delete apptmTemp.isSaved;

					appointments.push( apptmTemp );
			    }

				$scope.appointmentsJson = JSON.stringify(appointments, null, 5);
				//return;

			    for( var i = 0 ; i < appointments.length ; i++ )
			    {
					doAppointmentPost( appointments[i], appointments.length );
			    }
		};

		var doAppointmentPost = function(appmt, appointpentsCount){
			var postResponseCount = 0, postErrors = [];

			var headersObj = {};

			if( $scope.postOptions.username && $scope.postOptions.password )
			{
				headersObj['Authorization'] = 'Basic ' + btoa( $scope.postOptions.username + ':' + $scope.postOptions.password );
			}

			$http.post( $scope.postOptions.url, appmt, {headers: headersObj} ).then(
					function(response){
						if( response.status != 200 )
						{
							console.error("Appointment saving error: " + response.status + ' for patient ' + appmt.patient.pid.code);
							postErrors.push( appmt.patient.pid.code );
						}
						else
						{
							$scope.messages.savingSuccess = true;

							var events = $scope.appointmentsEvtSources[0].events;
							for( var i = 0 ; i < events.length ; i++ )
			    			{
								if(events[i].appointment.sch.placerAppointmentID==appmt.sch.placerAppointmentID)
								{
									events[i].appointment.isPersisted = true;
									break;
								}
							}
						}

						postResponseCount++;
						if( postResponseCount == appointpentsCount )
						{
							if( postErrors.length > 0)
							{
								$scope.messages.savingError = 'POST errors for patient codes: ' + postErrors.join( ' , ' );
							}
							else
							{
								$scope.messages.savingSuccess = true;
							}
						}
					},
					function(error){
						postErrors.push( appmt.patient.pid.code );
						postResponseCount++;
						if( postResponseCount == appointpentsCount )
						{
							if( postErrors.length > 0)
							{
								$scope.messages.savingError = 'POST errors for patient codes: ' + postErrors.join( ' , ' );
							}
							else
							{
								$scope.messages.savingSuccess = true;
							}
						}

						console.error('Appointment saving error for patient ' + appmt.patient.pid.code);
					}
			);
		}; //END doAppointmentPost
   }
  ]);

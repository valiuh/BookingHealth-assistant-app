'use strict';
process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');
const firebaseAdmin = require('firebase-admin');
const Actions = require('./assistant-actions');
const Conversation = require('./conversation.js');


firebaseAdmin.initializeApp(functions.config().firebase);

exports.bookingHealth = functions.https.onRequest(
    (request, response) => {
        const app = new App({request, response});
        // better use console dir with es6 strings literals
        console.log('Request headers: ' + JSON.stringify(request.headers));
        console.log('Request body: ' + JSON.stringify(request.body));

        const conversation = new Conversation(app, firebaseAdmin);

        let actionMap = new Map();
        actionMap.set(Actions.START_BOOKING_ACTION, () => conversation.getAppointmentsType());
        actionMap.set(Actions.APPOINTMENT_TYPE_SELECTED_ACTION, () => conversation.selectAppointmentType());
        actionMap.set(Actions.APPOINTMENT_BRANCH_SELECTED_ACTION, () => conversation.selectAppointmentBranch());
        actionMap.set(Actions.APPOINTMENT_ADD_REASON_ACTION, () => conversation.addAppointmentReason());
        actionMap.set(Actions.APPOINTMENT_SHOW_ACTION, () => conversation.showAppointment());
        actionMap.set(Actions.APPOINTMENT_CANCEL_ACTION, () => conversation.canceledAppointment());
        actionMap.set(Actions.APPOINTMENT_CONFIRM_ACTION, () => conversation.confirmedAppointment());
        app.handleRequest(actionMap);

});
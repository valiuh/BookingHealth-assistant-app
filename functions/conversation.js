const Str = require('./strings');
const moment = require("moment");

class Conversation {
    constructor(dialogflowApp, firebaseAdmin) {
        this.dialogflowApp = dialogflowApp;
        this.firebaseAdmin = firebaseAdmin;
    }

    //Intent start-booking-flow
    getAppointmentsType() {
        this._getAppointmentTypes()
            .then(types => {
                this._askWithSuggestions(Str.STR_SELECT_APPOINTMENT_TYPE(), types);
            });
    }

    //Intent chose-appointment-type
    selectAppointmentType() {
        let type = this.dialogflowApp.getArgument('appointment-type')[0];

        this._getAppointmentBranches(type)
            .then(brunches => {
                this._askWithList(Str.STR_SELECT_APPOINTMENT_BRUNCH(), Str.STR_APPOINTMENT_BRUNCHES(), brunches);
            });

    }

    // Intent chose-appointment-branch
    selectAppointmentBranch() {
        const type = this.dialogflowApp.getContextArgument('booking-flow', 'appointment-type').value;
        const option = this.dialogflowApp.getSelectedOption();

        if(this._isJsonString(option)) {
            this._storeCurrentAppointment(option);
        } else {
            this._getAppointmentTimeslots(type, option)
                .then(timeSlots => {
                    this._askWithCarousel(Str.STR_SELECT_APPOINTMENT_TIME(), timeSlots);
                })
        }
    }

    // Intent add-appointment-reason
    addAppointmentReason() {
        let reason = this.dialogflowApp.getArgument('reason');
        this.firebaseAdmin.database().ref('appointments/current/reason').set(reason);

        this._getNewAppointment()
            .then(appointment => {
                this._confirmAppointment(appointment)
            });
    }

    // Intent show-appointment
    showAppointment() {
        this._getNewAppointment()
            .then(appointment => {
                this._confirmAppointment(appointment)
            });
    }

    // Intent confirm-appointment
    confirmedAppointment(){
        this._getNewAppointment()
            .then(appointment => {
                this._storeNewAppointment(appointment);
                this.dialogflowApp.tell(Str.STR_APPOINTMENT_ADDED());
            });

    }

    // Intent cancel-appointment
    canceledAppointment(){
        this.firebaseAdmin.database().ref('appointments/current').remove();
        this.dialogflowApp.tell(Str.STR_APPOINTMENT_CANCELED());
    }

    _getAppointmentTypes(){
        return Promise.resolve(
            this.firebaseAdmin.database()
                .ref('types')
                .once('value'))
            .then(snapshot => {
                return Object.keys(snapshot.val())
            });
    }

    _getAppointmentBranches(type){
        return Promise.resolve(
            this.firebaseAdmin.database()
                .ref('types/' + type + '/branches')
                .once('value'))
            .then(snapshot => {
                return this._snapshotToBranches(snapshot);
            });
    }

    _getAppointmentTimeslots(type, branch){
        return Promise.resolve(
            this.firebaseAdmin.database()
                .ref('types/' + type + '/branches/' + branch)
                .once('value'))
            .then(snapshot => {
                return this._snapshotToBranchData(type, snapshot);
            });
    }

    _getNewAppointment(){
        return Promise.resolve(
            this.firebaseAdmin.database()
                .ref('appointments/current')
                .once('value'));
    }

    _ask(text) {
        this.dialogflowApp.ask(text);
    }

    _askWithSuggestions(title, suggestions) {
        this.dialogflowApp.ask(this.dialogflowApp
            .buildRichResponse()
            .addSimpleResponse(title)
            .addSuggestions(suggestions)
        );
    }

    _askWithList(title, subtitle, list) {
        let dialogList = this.dialogflowApp.buildList(subtitle);
        for(let i = 0; i < list.length; i++) {
            dialogList.addItems(this.dialogflowApp.buildOptionItem(list[i].key,
                    [list[i].name])
                    .setTitle(list[i].name)
                    .setDescription(list[i].address)
                    .setImage(list[i].image, list[i].name))
        }
        this.dialogflowApp.askWithList(title, dialogList);
    }

    _askWithCarousel(title, timeSlotes) {

        let list = timeSlotes.timeslots;

        let dialogCarousel = this.dialogflowApp.buildCarousel();
        for(let i = 0; i < list.length; i++) {

            let appointment = {
                type: timeSlotes.type[0],
                branch: timeSlotes.name,
                address: timeSlotes.address,
                image: timeSlotes.image,
                practitioner: list[i].practitioner,
                photo: list[i].image,
                date: list[i].date,
                reason: ""

            };

            dialogCarousel.addItems(this.dialogflowApp.buildOptionItem(JSON.stringify(appointment),
                [list[i].key])
                .setTitle(this._getFormattedDate(list[i].date))
                .setDescription(list[i].practitioner)
                .setImage(list[i].image, list[i].practitioner))
        }
        this.dialogflowApp.askWithCarousel(title, dialogCarousel);
    }

    _getFormattedDate(dateStr){
        return moment(dateStr).format('MMMM Do YYYY, h:mm a');
    }

     _isJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    _storeCurrentAppointment(appointmentStr){
        let appointment = JSON.parse(appointmentStr);
        this.firebaseAdmin.database().ref('appointments/current').set(appointment);
        this._ask(Str.STR_APPOINTMENT_STORED());
    }

    _snapshotToBranches(snapshot){
        let branches = [];
        snapshot.forEach(branch => {

                branches = [...branches, {
                    key: branch.key,
                    name: branch.val().name,
                    address: branch.val().address,
                    image: branch.val().image
                }];
        })
        return branches;
    }

    _snapshotToBranchData(type, snapshot){
        let branchData = {
            type: type,
            key: snapshot.key,
            name: snapshot.val().name,
            address: snapshot.val().address,
            image: snapshot.val().image,
            timeslots: []
        };

        let timeSlotsKeys = Object.keys(snapshot.val().timeslots)

        for(let key of timeSlotsKeys){

            let timeSlot = snapshot.val().timeslots[key];
            branchData.timeslots = [...branchData.timeslots, {
                key: key,
                practitioner: timeSlot.practitioner,
                date: timeSlot.date,
                image: timeSlot.image
            }];
        }
        return branchData;
    }

    _storeNewAppointment(appointment){
        const newKey = this.firebaseAdmin.database().ref().child('appointments').push().key;
        this.firebaseAdmin.database()
            .ref('appointments/' + newKey)
            .set({
                type: appointment.val().type,
                reason: appointment.val().reason,
                practitioner: appointment.val().practitioner,
                photo: appointment.val().photo,
                image: appointment.val().image,
                date: appointment.val().date,
                branch: appointment.val().branch,
                address: appointment.val().address
            });
        this.firebaseAdmin.database().ref('appointments/current').remove();
    }

    _confirmAppointment(appointment){
        this._ask(Str.STR_APPOINTMENT_CONFIRM(appointment, this._getFormattedDate(appointment.val().date)));
    }
}

module.exports = Conversation;





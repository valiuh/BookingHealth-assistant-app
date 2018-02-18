function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


module.exports = {
    STR_SELECT_APPOINTMENT_TYPE: () => {

        let arr = [
            'Sure, let’s get started. First of all, please choose an appointment type ',
            'Okeydokey, let\'s pick the appointment type',
            'Then let\'s get down to choosing an appointment type'];

        return arr[getRandomInt(0, arr.length)];

    },
    STR_SELECT_APPOINTMENT_BRUNCH: () => {

        let arr = [
            'I found several available brunches in your practice. Please, choose your branch ',
            'There are several branches available in your practice. Please, pick your branch',
            'Here we have several branches available. Let\'s go and pick one'];

        return arr[getRandomInt(0, arr.length)];

    },

    STR_APPOINTMENT_BRUNCHES: () => {

        let arr = [
            'Brunches in your practice',
            'Brunches in your practice',
            'Brunches in your practice'];

        return arr[getRandomInt(0, arr.length)];

    },

    STR_SELECT_APPOINTMENT_TIME: () => {

        let arr = [
            'And now my favorite part! Let\'s pick a practitioner! I found several options for you. So, please select your practitioner and a time slot',
            'Here\'s a number of practitioners and time slots for you to pick from. Let\'s go and pick out of those available.',
        	'Why don\'t you pick a practitioner who you\'d like to see? And don\'t forget to choose the time slot as well'];

        return arr[getRandomInt(0, arr.length)];

    },

    STR_APPOINTMENT_STORED: () => {

        let arr = [
            'OK, there\'s one more thing left. The appointment reason could help you practitioner. Would you like to add a reason for your appointment?',
            'Great! Now it would be a good idea to add a reason for your appointment for your practitioner',
            'Awesome! Another great thing for you to do will be to add a reason for your visit'];

        return arr[getRandomInt(0, arr.length)];

    },

    STR_APPOINTMENT_ADDED: () => {

        let arr = [
            'OK, I\'ve added this new appointment. Please, let me know when you want to book a new one. See you later.',
            'Your appointment is now booked. If you need to book a new one, please, don\'t hesitate to do so. Have a great day!',
            'You have your appointment booked. Please, don\'t hesitate to book another one if needed. Enjoy your day'];

        return arr[getRandomInt(0, arr.length)];

    },

    STR_APPOINTMENT_CANCELED: () => {

        let arr = [
            'OK, I\'ve canceled this new appointment. Please, let me know when you\'d like to book a new one. See you later.',
            'Your new appointment is canceled. Feel free to book a new one when needed. Take care',
            'You have your new appointment canceled. You are welcome to book another one any time. Have a good day'];

        return arr[getRandomInt(0, arr.length)];

    },


    STR_APPOINTMENT_CONFIRM: (appointment, date) =>
        `So, you are going to book appointment in ${appointment.val().branch} at ${date}.
         Your practitioner will be ${appointment.val().practitioner}. 
         ${appointment.val().reason ? `And your reason is - ${appointment.val().reason}.` : ''} 
         Should I book this appointment?`
}
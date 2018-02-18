# BookingHealth

Book new appointments online with a GP or nurse. 

# About this project

The main idea of this project is to show how to solve real life task from GP online services in voice-interface application. Appointments online booking with user general practitioners was selected as an example. In such a manner any part of GP online services could be solve, including:

- book or cancel appointments online with a GP;
- order repeat prescriptions online;
- view parts of users GP record;
- view clinical correspondence.

## Current tech stack:
- [Actions on Google](https://developers.google.com/actions/extending-the-assistant)
- [Firebase](https://firebase.google.com/): Cloud Functions and Realtime Database - for application backend logic and database
- [Dialogflow](https://dialogflow.com/) - for [NLP](https://en.wikipedia.org/wiki/Natural-language_processing) and conversations
- Node.js - for Firebase Cloud Function implementation

## Structure of project:
- `/Dialogflow` contains code and data for Dialogflow platform (conversation definitions, actions, intents)
- `/functions` contains code for Firebase Cloud Functions
- `/database` contains data for Firebase Database
- `/assets` contains assets (images, descriptions) required for app submission


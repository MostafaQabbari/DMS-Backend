const { google } = require('googleapis');
const Company = require('../models/company');
const Case = require('../models/case');

module.exports = async function createEvent(caseId, startDate, mediatorEmail, client1Email, client2Email) {
  try {
    // Retrieve the necessary data from the database
    const currentCase = await Case.findById(caseId);
    const company = await Company.findById(currentCase.connectionData.companyID);

    // Retrieve the service account details from the company schema
    const serviceAccountEmail = company.serviceAccountEmail;
    const privateKey = company.serviceAccountPrivateKey;

    // Create the JWT auth client
    const auth = new google.auth.JWT({
      email: serviceAccountEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    // Authorize the client
    const calendar = google.calendar({ version: 'v3', auth });

    // Prepare the event data
    const event = {
      summary: 'Meeting',
      start: {
        dateTime: startDate,
        timeZone: 'Africa/Cairo', // Replace with the appropriate time zone (spain or UK)
      },
      end: {
        dateTime: new Date(new Date(startDate).getTime() + 86400000).toISOString(), // Next day at midnight,
        timeZone: 'Africa/Cairo', // Replace with the appropriate time zone (spain or UK)
      },
      attendees: [
        { email: mediatorEmail },
        { email: client1Email },
        { email: client2Email },
      ],
    };

    // Create the event
    const createdEvent = await calendar.events.insert({
      calendarId: 'primary', // Use 'primary' for the authenticated user's primary calendar
      resource: event,
      sendUpdates: 'all', // Send invitations to the attendees
    });

    console.log('Event created:', createdEvent.data);

    return { message: 'Event created successfully' };
  } catch (error) {
    console.error('Error creating event:', error);
    throw new Error('Failed to create event');
  }
}

const { google } = require('googleapis');
const Company = require('../models/company');
const Case = require('../models/case');

//, client2Email
module.exports = async function createEvent(caseId, mediatorEmail, client1Email) {
  try {
    // // Retrieve the necessary data from the database
    // const currentCase = await Case.findById(caseId);
    // const company = await Company.findById(currentCase.connectionData.companyID);

    const companyData = await Case.findById(caseId).populate('connectionData.companyID');
 
    const companyServiceAccount = companyData.connectionData.companyID.serviceAccount;
    const companyServiceAccountKey = companyData.connectionData.companyID.serviceAccountKey;
    

    const plain = Buffer.from(companyServiceAccountKey, 'base64').toString('utf8') 
    
    const plainParsed = JSON.parse(plain);
    const privatekey1 = plainParsed.private_key;



    // Create the JWT auth client
    const auth = new google.auth.JWT({
      email: companyServiceAccount,
      key: privatekey1,
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
    });

    // Authorize the client
    const calendar = google.calendar({ version: 'v3', auth });

    // Prepare the event data
    const event = {
      summary: 'Meeting',
      start: {
        dateTime: "2023-12-09T01:00:00Z",
        timeZone: 'Africa/Cairo', // Replace with the appropriate time zone (spain or UK)
      },
      end: {
        dateTime: "2023-12-09T22:00:00Z", // Next day at midnight,
        timeZone: 'Africa/Cairo', // Replace with the appropriate time zone (spain or UK)
      },
      attendees: [
        { email: mediatorEmail },
        { email: client1Email },
        // { email: client2Email },
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

const { google } = require('googleapis');
const Company = require('../models/company');
const Case = require('../models/case');
const config = require("../config/config");

//, client2Email
 async function createEvent(caseId, mediatorEmail, client1Email) {
  try {
    // // Retrieve the necessary data from the database
    // const currentCase = await Case.findById(caseId);
    // const company = await Company.findById(currentCase.connectionData.companyID);

    // const companyData = await Case.findById(caseId).populate('connectionData.companyID');
 
    // const companyServiceAccount = companyData.connectionData.companyID.serviceAccount;
    // const companyServiceAccountKey = companyData.connectionData.companyID.serviceAccountKey;
    

    // const plain = Buffer.from(companyServiceAccountKey, 'base64').toString('utf8') 
    
    // const plainParsed = JSON.parse(plain);
    // const privatekey1 = plainParsed.private_key;

    // await impersonateServiceAccount("mkabary8@gmail.com" , )

    // // Create the JWT auth client
    // const auth = new google.auth.JWT({
    //   email: companyServiceAccount,
    //   key: privatekey1,
    //   scopes: ['https://www.googleapis.com/auth/calendar.events'],
    // });

    
    const auth = await google.auth.getClient({
      
      keyFile: config.credentialFile1,

      scopes: ['https://www.googleapis.com/auth/drive'], // Scopes required for accessing Google Drive
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

// async function impersonateServiceAccount(targetEmail, serviceAccount , serviceAccountKey) {
//   // Create the JWT auth client
//   const auth = new google.auth.GoogleAuth({
//     email: companyServiceAccount,
//     key: privatekey1,
//     scopes: ['https://www.googleapis.com/auth/calendar.events'],
//   });
  
  
//   // const auth = new google.auth.GoogleAuth({
//   //   credentials,
//   //   scopes: ['https://www.googleapis.com/auth/calendar.events'],
//   // });

//   // Get an access token for the target email
//   const client = await auth.getClient();
//   const accessToken = await client.getAccessToken();

//   // Create a calendar instance for the target user
//   const calendar = google.calendar({
//     version: 'v3',
//     auth,
//   });

//   // Use the calendar instance to perform actions on behalf of the target user
//   // For example, create an event and send invitations
//   const event = {
//     // Event details
//     summary: 'Sample Event',
//     start: {
//       dateTime: '2022-01-01T10:00:00Z',
//       timeZone: 'America/New_York',
//     },
//     end: {
//       dateTime: '2022-01-01T12:00:00Z',
//       timeZone: 'America/New_York',
//     },
//     // Attendees
//     attendees: [
//       { email: 'attendee1@example.com' },
//       { email: 'attendee2@example.com' },
//     ],
//   };

//   // Create the event on behalf of the target user and send invitations
//   const response = await calendar.events.insert({
//     calendarId: 'primary',
//     resource: event,
//     sendNotifications: true,
//   });

//   console.log('Event created:', response.data);
// }

module.exports = { createEvent };


// module.exports = GoogleAPIs;
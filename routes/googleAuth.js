const express = require('express');
const router = express.Router();

const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');
const crypto = require('crypto');
const Company = require("../models/company");


const clientSecret = require('../credentials-folder/client_secret_537502054165-metsp21euqsbddceh0tafk829h13n4gf.apps.googleusercontent.com.json');
const authMiddleware = require('../middleware/authMiddleware');
const clientId = clientSecret.web.client_id;
const clientSecretKey = clientSecret.web.client_secret;
const redirectUri = 'http://localhost:3007/oauth2callback';

const oAuth2Client = new OAuth2Client(clientId, clientSecretKey, redirectUri);
const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];



let stateGeneratedOnServer;


// A function to generate a secure random string
const generateRandomString = (length) => {
  return crypto.randomBytes(length).toString('hex');
};




router.get('/googleAuth', authMiddleware , (req, res) => {


  const state = generateRandomString(16);
  stateGeneratedOnServer = state;
  const userId = req.user._id; // Replace with your actual user ID or unique identifier

  const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      state: `${state}:${userId}`,
  });
  res.json(authUrl);
});

// router.get('/googleAuth', (req, res) => {
//     const authUrl = oAuth2Client.generateAuthUrl({
//       access_type: 'offline',
//       scope: SCOPES,
//     });
//     res.json(authUrl);
//   });
  
  router.get('/oauth2callback', async (req, res) => {
   
    const code = req.query.code;
    const state = req.query.state;

    // Extract the user ID and state from the state parameter
    const [receivedState, userId] = state.split(':');

    // Validate the state to ensure it's the one you generated
    if (receivedState !== stateGeneratedOnServer) {
      return res.status(400).send('Invalid state parameter');
    }
  
    try {
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);
  
      // In a real-world scenario, save the refresh token securely in your database
      const refreshToken = tokens.refresh_token;
      
      let user = await Company.findByIdAndUpdate( userId , {googleRefreshToken:refreshToken} , { new: true });
      
      if (!user) {
        return res.status(401).json({ message: "Invalid UserID" });
      }

      // console.log('Refresh Token:', refreshToken);
  
      res.send('Authorization successful! You can close this window.');
    } catch (error) {
      console.error('Error while exchanging code for tokens:', error.message);
      res.status(500).send('Internal Server Error');
    }
  });
  
  router.post('/create-event',authMiddleware ,async (req, res) => {
    try {
      // In a real-world scenario, you would retrieve the refresh token from your database
      // instead of hardcoding it here
      const company = await Company.findById(req.user._id);
      const refreshtoken = company.googleRefreshToken;
      oAuth2Client.setCredentials({ refresh_token: refreshtoken });
  
      const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  
      const eventDetails = {
        summary: req.body.eventTitle,
        start: { dateTime: req.body.eventDate, timeZone: 'UTC' },
        end: { dateTime: req.body.eventDate, timeZone: 'UTC' },
        attendees: req.body.attendees.map(email => ({ email })),
      };
  
      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: eventDetails,
      });
  
      res.status(200).json({ eventId: response.data.id, message: 'Event created successfully!' });
    } catch (error) {
      console.error('Error creating event:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  module.exports = router;
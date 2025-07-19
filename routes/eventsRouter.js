
import express from 'express';
import {
    allRegistration,
  createEvent,
  getEventDetails,
  registerUser,
//   cancelRegistration,
//   listUpcomingEvents,
//   getEventStats,
} from '../controllers/eventsController.js';

export const eventRoutes = express.Router();

eventRoutes.post('/createEvents', createEvent);
eventRoutes.get('/getAllEvents', getEventDetails);
 eventRoutes.post('/:id/register', registerUser);
 eventRoutes.get('/get',allRegistration);
// eventRoutes.delete('/:id/register', cancelRegistration);
// eventRoutes.get('/upcoming/list', listUpcomingEvents);
// eventRoutes.get('/:id/stats', getEventStats);

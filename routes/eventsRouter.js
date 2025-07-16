
import express from 'express';
import {
  createEvent,
  getEventDetails,
  registerUser,
  cancelRegistration,
  listUpcomingEvents,
  getEventStats,
} from '../controllers/eventsController.js';

export const eventRoutes = express.Router();

eventRoutes.post('/', createEvent);
eventRoutes.get('/:id', getEventDetails);
eventRoutes.post('/:id/register', registerUser);
eventRoutes.delete('/:id/register', cancelRegistration);
eventRoutes.get('/upcoming/list', listUpcomingEvents);
eventRoutes.get('/:id/stats', getEventStats);

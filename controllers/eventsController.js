import { pool } from '../db/schema.js';
import { date, z } from 'zod';

// Validate event schema
const eventSchema = z.object({
  title: z.string(),
  date_time: z.coerce.date(), // safer parsing of datetime
  location: z.string(),
  capacity: z.number().int().min(1).max(1000),
});

const registrationSchema = z.object({
  user_id: z.number().int(),
});

// // Create event
// export const createEvent = async (req, res) => {
//   const validated = eventSchema.safeParse(req.body);
//   if (!validated.success) {
//     return res.status(400).json({ error: 'Invalid event data', details: validated.error.errors });
//   }

//   const { title, date_time, location, capacity } = validated.data;

//   try {
//     const result = await pool.query(
//       'INSERT INTO events (title, date_time, location, capacity) VALUES ($1, $2, $3, $4) RETURNING id',
//       [title, date_time, location, capacity]
//     );

//     res.status(201).json({ eventId: result.rows[0].id });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get event details (with registered users)
// export const getEventDetails = async (req, res) => {
//   try {
//     const eventId = parseInt(req.params.id);
//     const eventResult = await pool.query('SELECT * FROM events WHERE id = $1', [eventId]);

//     if (eventResult.rowCount === 0) {
//       return res.status(404).json({ error: 'Event not found' });
//     }

//     const usersResult = await pool.query(
//       'SELECT u.id, u.name, u.email FROM users u JOIN registrations r ON u.id = r.user_id WHERE r.event_id = $1',
//       [eventId]
//     );

//     res.json({ ...eventResult.rows[0], registeredUsers: usersResult.rows });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Register user for event
// export const registerUser = async (req, res) => {
//   const validated = registrationSchema.safeParse(req.body);
//   if (!validated.success) {
//     return res.status(400).json({ error: 'Invalid registration data', details: validated.error.errors });
//   }

//   const eventId = parseInt(req.params.id);
//   const { userId } = validated.data;

//   try {
//     const event = await pool.query('SELECT * FROM events WHERE id = $1', [eventId]);
//     if (event.rowCount === 0)
//       return res.status(404).json({ error: 'Event not found' });

//     if (new Date(event.rows[0].date_time) < new Date())
//       return res.status(400).json({ error: 'Cannot register for past event' });

//     const dupCheck = await pool.query(
//       'SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2',
//       [userId, eventId]
//     );
//     if (dupCheck.rowCount > 0)
//       return res.status(400).json({ error: 'User already registered' });

//     const countResult = await pool.query(
//       'SELECT COUNT(*) FROM registrations WHERE event_id = $1',
//       [eventId]
//     );
//     if (parseInt(countResult.rows[0].count) >= event.rows[0].capacity)
//       return res.status(400).json({ error: 'Event is full' });

//     await pool.query(
//       'INSERT INTO registrations (user_id, event_id) VALUES ($1, $2)',
//       [userId, eventId]
//     );

//     res.json({ message: 'Registered successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Cancel event registration
// export const cancelRegistration = async (req, res) => {
//   const validated = registrationSchema.safeParse(req.body);
//   if (!validated.success) {
//     return res.status(400).json({ error: 'Invalid cancel data', details: validated.error.errors });
//   }

//   const eventId = parseInt(req.params.id);
//   const { userId } = validated.data;

//   try {
//     const check = await pool.query(
//       'SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2',
//       [userId, eventId]
//     );
//     if (check.rowCount === 0)
//       return res.status(400).json({ error: 'User not registered' });

//     await pool.query(
//       'DELETE FROM registrations WHERE user_id = $1 AND event_id = $2',
//       [userId, eventId]
//     );

//     res.json({ message: 'Registration cancelled' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // List upcoming events
// export const listUpcomingEvents = async (_req, res) => {
//   try {
//     const result = await pool.query(
//       `SELECT * FROM events WHERE date_time > NOW() ORDER BY date_time ASC, location ASC`
//     );
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get stats for an event
// export const getEventStats = async (req, res) => {
//   try {
//     const eventId = parseInt(req.params.id);

//     const event = await pool.query('SELECT capacity FROM events WHERE id = $1', [eventId]);
//     if (event.rowCount === 0)
//       return res.status(404).json({ error: 'Event not found' });

//     const capacity = event.rows[0].capacity;

//     const reg = await pool.query(
//       'SELECT COUNT(*) FROM registrations WHERE event_id = $1',
//       [eventId]
//     );

//     const total = parseInt(reg.rows[0].count);
//     const remaining = capacity - total;
//     const percentUsed = ((total / capacity) * 100).toFixed(2);

//     res.json({
//       totalRegistrations: total,
//       remainingCapacity: remaining,
//       percentUsed
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


export const createEvent = async (req,res)=>{
    try{
        const client = await pool.connect();
        const validateEvents = eventSchema.safeParse(req.body);
        if(!validateEvents.success){
            return res.status(400).json({
                error : "Invalid inputs"
            });
        }
        const {title,date_time,location,capacity} = validateEvents.data;

        try{
             const event = await client.query(`
            INSERT INTO events(title,date_time,location,capacity) VALUES($1,$2,$3,$4) RETURNING *`,[title,date_time,location,capacity]);

            res.status(201).json({message : "Event created",event:event.rows[0]})
        }finally{
            client.release();
        }
       

    }catch(error){
        console.log("failed to create events")
    }
}


export const getEventDetails = async (req,res)=>{
    try{
        const client = await pool.connect();
        try{
            const eventDetails = await client.query(`SELECT * FROM events`);
            res.status(201).json(
                {
                    message : "Upcoming events",
                    eventDetails: eventDetails.rows, })
            }finally{client.release()}
    }catch(error){}

}

// Register Users

export const registerUser = async (req,res)=>{
    try{
        const client = await pool.connect();
        const validateUser = registrationSchema.safeParse(req.body);
        if(!validateUser.success){
            return res.status(400).json({massage:"Invalid inputs",error: validateUser.error.errors});
        }
        console.log(validateUser.data.user_id);
        const {user_id} = validateUser.data;
        const eventId = parseInt(req.params.id);
        console.log(user_id,eventId);

        try{
            //check if event exits or not
            const event = await client.query(`SELECT * FROM events WHERE id = $1`,[eventId])
            
            if(event.rowCount===0){
                return res.status(400).json({message :"Event does not exits"})
            }

            // checking for past event 

            if(new Date(event.rows[0].date_time)< new Date()){
                return res.status(400).json({message : "Does not register for past events"})
            }
            //checking for capacity
            const maxCapacity = event.rows[0].capacity
            console.log("maxCapacity",maxCapacity);

            const capacity = await client.query(`SELECT COUNT(*) FROM registrations WHERE event_id = $1`,[eventId]);
            const count = parseInt(capacity.rows[0].count); 
            if (count >= maxCapacity) {
               return res.status(400).json({ error: 'Event is full' });
             }
            
            

            //
            const registration = await client.query(`
                INSERT INTO registrations(user_id,event_id) VALUES($1,$2)RETURNING *`,[user_id,eventId]) 
                res.status(201).json({message:"Registration successfull",registration:registration.rows[0]})
        }catch(err){
            if(err.code==='23505'){
                return res.status(400).json({error:"User is already register for event",err:err})
            }
        }finally{client.release();}


    }catch(err){
        res.status(400).json({message:"Falied to register for event",err:err})

    }
}


 export const allRegistration = async (req,res)=>{
    try{
        const client = await pool.connect();
        const allRegistration = await client.query(`SELECT COUNT(*) FROM registrations WHERE user_id = 1`);
        res.status(400).json({registrations : allRegistration.rows[0].count})
    }catch(err){}finally{client.release()}
}
import { pool } from '../db/schema.js';
import { z } from 'zod';

const validateUser = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.email("Email must be valid")
});

// Create users

 export const createUsers = async (req, res) => {
  try {
    const parsed = validateUser.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid inputs",
        details: parsed.error.errors,
      });
    }

    const { name, email } = parsed.data;

    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *`,
        [name, email]
      );

      res.status(201).json({
        message: "User created successfully",
        user: result.rows[0],
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Failed creating user:", error);

    // check if their email is already registered
    if (error.code === '23505') {
      return res.status(409).json({ error: "Email already exists" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};





//All users

export const getAllUsers = async (req, res) => {
    try{
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM users');
            res.status(200).json(result.rows);
        } finally {
            client.release();
        }
    }catch(error){}
}

// Get user by ID
export const getUsersById = async (req,res)=>{
    try{
        const client = await pool.connect();
        const id = req.params.id;
        try{
            const user = await client.query(`SELECT * FROM users WHERE id = $1`, [id]);
            if(user.rows.length === 0){
                return res.status(404).json({ error: "User not found" });
            }
            res.status(200).json(user.rows[0]);
        }finally {
            client.release();
        }

    }catch(error){
        console.error("Failed to get user by ID:", error);
        res.status(500).json({ error: "Internal server error" });

    }
}

// Delete user by ID

 export const deleteUserById = async (req, res) => {
  try {
    const client = await pool.connect();
    const id = req.params.id;

    try {
      const result = await client.query(`DELETE FROM users WHERE id = $1`, [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "User deleted successfully"
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error("Failed to delete user", error);
    res.status(500).json({
      err: error,
      errorMessage: "Internal server error"
    });
  }
}
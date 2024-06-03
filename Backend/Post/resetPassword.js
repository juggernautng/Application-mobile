import express from "express";
import { pool } from "../createPool.js";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";


const router = express.Router();
router.post("/:email", async (req, res) => {
  try {
    const { email } = req.params
    const { password, verificationCode } = req.body;
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT * FROM Utilisateurs WHERE email = ?",
      [email]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }  

    
    const connection2 = await pool.getConnection();
    const [result] = await connection.query(
      "SELECT code FROM Utilisateurs WHERE email = ?",
      [email]
    );
    connection2.release();
    const code = result[0].code
   

    
     if (verificationCode !== code) {
      return res.status(400).json({ error: "Code de vérification invalide" });
    }
    

    const hashedPassword = await bcrypt.hash(password, 10);

    const updateResult = await pool.query(
      'UPDATE Utilisateurs SET mdp = ? WHERE email = ?',
      [hashedPassword, email]
    );

    await pool.query(
      'ALTER TABLE Utilisateurs DROP COLUMN code',
      [hashedPassword, email]
    );
      res.status(201).json({ message: "done Verified" });
    } catch (error) {
      console.error(":", error);
      res.status(500).json({ error: "not done" });
    }
  });

export default router;

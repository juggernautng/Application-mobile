import express from "express";
import { pool } from "../createPool.js";
import bcrypt from "bcrypt";
import { Alert } from "react-native-web";
import jwt from 'jsonwebtoken'; 
import env from '../../env.js';
const {JWT_LIFETIME, JWT_SECRET} = env

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT * FROM Utilisateurs WHERE email = ?",
      [email]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = rows[0];

    
    const isMatch = await bcrypt.compare(password, user.mdp)
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const token = jwt.sign({userTel:user.num_tel, name:user.nom}, JWT_SECRET,{
      expiresIn:JWT_LIFETIME,
    })
    res.status(200).json({
      message: "Login successful",
      user: {email: user.email, id_uti: user.id_uti, nom: user.nom, prenom: user.prenom },
      token,
    });

  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

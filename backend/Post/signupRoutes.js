import express from "express";
import { pool } from "../createPool.js"; 
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import env from '../../env.js';
const {JWT_LIFETIME, JWT_SECRET} = env
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      nom,
      prenom,
      mdp,
      num_tel,
      photo,
      email,
      est_certifie,
      certificat,
      genre, naissance
    } = req.body;

    if (!nom || !prenom || !mdp || !email || !num_tel || naissance==="") {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const connection = await pool.getConnection();
    const [existingUsers] = await connection.query(
      "SELECT * FROM Utilisateurs WHERE email = ? OR num_tel = ?",
      [email, num_tel]
    );
    connection.release();

    if (existingUsers.length > 0) {
      return res
        .status(400)
        .json({ error: "Email or phone number already in use" });
    }

    // hash password 

    const hashedPassword = await bcrypt.hash(mdp, 10)

    const currentYear = new Date().getFullYear();
    const birthYear = currentYear-parseInt(naissance);
    const insertConnection = await pool.getConnection();
    const [result] = await insertConnection.query(
      "INSERT INTO Utilisateurs (nom, prenom, mdp, num_tel, photo, email, est_certifie, certificat, genre, naissance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [nom, prenom, hashedPassword, num_tel, photo, email, est_certifie, certificat, genre, birthYear]
    );
    insertConnection.release();

    const connectionn = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT * FROM Utilisateurs WHERE email = ?",
      [email]
    );
    connectionn.release();
    const user = rows[0];


    const token = jwt.sign({ userTel: num_tel, name: nom }, JWT_SECRET, {
      expiresIn: JWT_LIFETIME,
    })

    res.status(200).json({
      message: "Login successful",
      user: {email: user.email, id_uti: user.id_uti, nom: user.nom, prenom: user.prenom },
      token,
    });

  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

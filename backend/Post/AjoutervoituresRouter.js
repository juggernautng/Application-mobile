import express from "express";
import { pool } from "../createPool.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      id_prop,
      matricule,
      modele,
      couleur,
      voiture_est_certifie,
      voiture_certificat,
    } = req.body;

    if (!matricule || !modele || !couleur) {
      return res
        .status(400)
        .json({ error: "Matricule, modele, and couleur are required." });
    }

    const matriculeExistsQuery = "SELECT * FROM voitures WHERE matricule = ?";
    const [existingCar] = await pool.query(matriculeExistsQuery, [matricule]);
    if (existingCar.length > 0) {
      return res.status(400).json({ error: "Matricule already exists." });
    }

    const insertQuery =
      "INSERT INTO voitures (matricule, id_prop, modele, couleur, voiture_est_certifie, voiture_certificat) VALUES (?, ?, ?, ?, ?, ?)";
    const insertParams = [
      matricule,
      id_prop,
      modele,
      couleur,
      voiture_est_certifie,
      voiture_certificat,
    ];

    const connection = await pool.getConnection();
    await connection.query(insertQuery, insertParams);
    connection.release();

    res.status(201).json({ message: "Car added successfully." });
  } catch (error) {
    console.error("Error adding car:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

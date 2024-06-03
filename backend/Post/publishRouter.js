import express from "express";
import { pool } from "../createPool.js"; 

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      depart,
      arrivee,
      timestamp,
      nbr_place,
      prix,
      id_conducteur,
      id_voiture,
      details,
      timestamp2
    } = req.body;

    const connection = await pool.getConnection();
    try {
      if (timestamp2 == null) {
        const [result] = await connection.query(
          "INSERT INTO trajets (depart, arrivee, timestamp, nbr_place, prix, id_conducteur, id_voiture, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [depart, arrivee, timestamp, nbr_place, prix, id_conducteur, id_voiture, JSON.stringify(details)]
        );
      } else {
        let currentDate = new Date(timestamp);
        const endDate = new Date(timestamp2);

        while (currentDate <= endDate) {
          await connection.query(
            "INSERT INTO trajets (depart, arrivee, timestamp, nbr_place, prix, id_conducteur, id_voiture, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [depart, arrivee, currentDate, nbr_place, prix, id_conducteur, id_voiture, JSON.stringify(details)]
          );
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
      res.status(201).json({ message: "Journey published successfully" });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error publishing journey:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

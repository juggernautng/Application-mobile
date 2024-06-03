import express from "express";
import { pool } from "../createPool.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { id_trajet } = req.query;
    console.log(id_trajet)

    let query = `
      SELECT utilisateurs.*,reservations.nbr_place, reservations.id_reservation
      FROM utilisateurs
      JOIN reservations ON utilisateurs.id_uti = reservations.id_reserveur
      WHERE reservations.id_trajet = ?
    `;
    let queryParams = [id_trajet];

    const connection = await pool.getConnection();
    const [participants] = await connection.query(query, queryParams);
    connection.release();
    console.log(participants)
    res.status(200).json(participants);
  } catch (error) {
    console.error("Error fetching participants information:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

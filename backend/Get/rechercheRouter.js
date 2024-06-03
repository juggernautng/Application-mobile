import express from "express";
import { pool } from "../createPool.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { depart, arrivee, timestamp, passengers, isDatePicked, isTimePicked, userId } = req.query;
    console.log(depart, arrivee, timestamp, passengers, isDatePicked, isTimePicked, userId);

    let query = `
      SELECT *
      FROM trajets 
      JOIN utilisateurs ON trajets.id_conducteur = utilisateurs.id_uti
      JOIN voitures ON trajets.id_voiture = voitures.matricule
      WHERE trajets.depart = ? AND trajets.arrivee = ?`;

    const queryParams = [depart, arrivee];

    // If both isDatePicked and isTimePicked are true, search for rides with the exact timestamp
    if (isDatePicked && isTimePicked) {
      query += ` AND trajets.timestamp = ?`;
      queryParams.push(timestamp);
    } else {
      // If only isDatePicked is true, search for rides with the same date and ignore the time
      if (isDatePicked) {
        query += ` AND DATE(trajets.timestamp) = ?`;
        queryParams.push(timestamp.split('T')[0]);
      }
      
      if (isTimePicked) {
        query += ` AND TIME(trajets.timestamp) = ?`;
        queryParams.push(timestamp.split('T')[1]);
      }
    }

    query += ` AND CURDATE() <= DATE(trajets.timestamp)`;

    if (userId) {
      query += ` AND utilisateurs.id_uti != ?`;
      query += ` AND trajets.id_trajet NOT IN (SELECT id_trajet FROM reservations WHERE id_reserveur = ?)`;
      queryParams.push(userId, userId);
    }

    query += ` ORDER BY trajets.timestamp`;

    const connection = await pool.getConnection();

    const [trajets] = await connection.query(query, queryParams);

    connection.release();
    console.log("trajets:", trajets);

    const filteredTrajets = trajets.filter((trajet) => {
      return trajet.nbr_place >= passengers;
    });

    console.log("filtered trajets:", filteredTrajets);
    res.status(200).json(filteredTrajets);

  } catch (error) {
    console.error("Error fetching trajets:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

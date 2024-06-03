import express from "express";
import { pool } from "../createPool.js";
import moment from 'moment';
const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { id_trajet, id_reserveur, nbr_place } = req.body;

    if (!id_trajet || !id_reserveur || !nbr_place ) {
      return res.status(400).json({
        error: "id_trajet, id_reserveur, nbr_places, and userToken are required.",
      });
    }

    // Check available seats
    const availableSeatsQuery = "SELECT nbr_place FROM trajets WHERE id_trajet = ?";
    const availableSeatsParams = [id_trajet];

    const connection = await pool.getConnection();
    const [result] = await connection.query(availableSeatsQuery, availableSeatsParams);
    connection.release();

    if (result.length === 0) {
      return res.status(404).json({ error: "Trajet not found." });
    }

    const availableSeats = result[0].nbr_place;

    if (nbr_place > availableSeats) {
      return res.status(400).json({ error: "Not enough available seats." });
    }

    // Update available seats in trajets table
    const updateSeatsQuery = "UPDATE trajets SET nbr_place = nbr_place - ? WHERE id_trajet = ?";
    const updateSeatsParams = [nbr_place, id_trajet];

    const updateConnection = await pool.getConnection();
    await updateConnection.query(updateSeatsQuery, updateSeatsParams);
    updateConnection.release();

    // Insert reservation
    const insertReservationQuery = "INSERT INTO reservations (id_trajet, id_reserveur, nbr_place) VALUES (?, ?, ?)";
    const insertReservationParams = [id_trajet, id_reserveur, nbr_place];

    const insertConnection = await pool.getConnection();
    await insertConnection.query(insertReservationQuery, insertReservationParams);
    insertConnection.release();

    const connection3 = await pool.getConnection();
    const [conducteurID] = await connection3.query(
      `SELECT t.id_conducteur 
   FROM trajets t
   INNER JOIN reservations r ON t.id_trajet = r.id_trajet
   WHERE r.id_reserveur = ? AND r.id_trajet = ?`,
      [id_reserveur, id_trajet]
    );
    connection3.release();
    const id = conducteurID[0].id_conducteur;
    console.log("conducteur", id);
    console.log("reserveur", id_reserveur);
  
    const getRide = await pool.getConnection()
    const[rideResult] = await getRide.query(
      `SELECT depart, arrivee, timestamp
        FROM trajets where
        id_trajet = ?
      `, [id_trajet]
    )
    const departTrajet = rideResult[0].depart
    const destinationTrajet = rideResult[0].arrivee
    const temps = rideResult[0].timestamp
    getRide.release()
    const formattedTime = moment(temps).format('YYYY-MM-DD HH:mm');

    // add a notification
    const message = `Vous avez une nouvelle réservation pour votre trajet: ${nbr_place} places réservées. Trajet: ${departTrajet} vers ${destinationTrajet} à ${formattedTime}.`;
    const connection2 = await pool.getConnection();
    await connection2.query(
      'INSERT INTO notifications (id_uti, id_sender, titre, body, time) VALUES (?, ?, ?, ?, ?)',
      [id, id_reserveur, "Reservation", message, currentTime] 
    );
    connection2.release();

    res.status(201).json({ message: "Reservation made successfully." });
  } catch (error) {
    console.error("Error making reservation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

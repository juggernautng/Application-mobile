import express from "express";
import { pool } from "../createPool.js";
import moment from 'moment';

const router = express.Router();

router.delete("/:reservationId", async (req, res) => {
  try {
    const { reservationId } = req.params;
    const {key} = req.body;
    console.log(key)

    const reservationQuery = "SELECT id_trajet, nbr_place, id_reserveur FROM reservations WHERE id_reservation = ?";
    const reservationParams = [reservationId];

    const connection = await pool.getConnection();
    const [reservationResult] = await connection.query(reservationQuery, reservationParams);

    if (reservationResult.length === 0) {
      connection.release();
      return res.status(404).json({ error: "Reservation not found." });
    }

    const { id_trajet, nbr_place } = reservationResult[0];
    const senderId = reservationResult[0].id_reserveur;

      const connection3 = await pool.getConnection();
      const [conducteurID] = await connection3.query(
        `SELECT id_conducteur 
         FROM trajets t
         INNER JOIN reservations r ON t.id_trajet = r.id_trajet
         WHERE r.id_reserveur = ? AND r.id_trajet = ?`,
        [senderId, id_trajet]
      );
      connection3.release();

    // Delete reservation
    const deleteReservationQuery = "DELETE FROM reservations WHERE id_reservation = ?";
    const deleteReservationParams = [reservationId];

    await connection.query(deleteReservationQuery, deleteReservationParams);

    // Update available seats in trajets table
    const updateSeatsQuery = "UPDATE trajets SET nbr_place = nbr_place + ? WHERE id_trajet = ?";
    const updateSeatsParams = [nbr_place, id_trajet];

    await connection.query(updateSeatsQuery, updateSeatsParams);

    connection.release();
    console.log("idCond avan");
    console.log("issender ", senderId);

  

    if (conducteurID.length === 0) {
      return res.status(404).json({ error: "Conducteur not found." });
    }

    const idConducteur = conducteurID[0].id_conducteur;
    console.log("idCond", idConducteur);
    console.log("issender", senderId);

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

    // Add a notification
    const currentTime = moment().format('YYYY-MM-DD HH:mm');
    const message1 = `Annuler pour participer à ce voyage. Trajet: ${departTrajet} vers ${destinationTrajet} à ${formattedTime}.`;
    const message2 = `Vous avez été retiré de son voyage. Trajet: ${departTrajet} vers ${destinationTrajet} à ${formattedTime}.`;
    const connection2 = await pool.getConnection();
    if (key == 'req'){
      await connection2.query(
        'INSERT INTO notifications (id_uti, id_sender, titre, body, time) VALUES (?, ?, ?, ?, ?)',
        [idConducteur, senderId, "Annuler Reservation", message1, currentTime]
      );
    }else{
      await connection2.query(
        'INSERT INTO notifications (id_uti, id_sender, titre, body, time) VALUES (?, ?, ?, ?, ?)',
        [senderId, idConducteur, "Retiré", message2, currentTime]
      );
    }

    connection2.release();

    res.status(200).json({ message: "Reservation canceled successfully." });
  } catch (error) {
    console.error("Error canceling reservation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

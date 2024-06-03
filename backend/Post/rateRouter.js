import express from "express";
import { pool } from "../createPool.js";
import moment from 'moment';

const router = express.Router();

router.put("/:userId/:emailSender/:idReservation", async (req, res) => {
  const { userId, emailSender, idReservation } = req.params;
  const { newRating } = req.body;

  try {

    const connection3 = await pool.getConnection();
    const [senderIdResult] = await connection3.query(
      `SELECT id_uti 
       FROM utilisateurs 
       WHERE email = ?`,
      [emailSender]
    );
    if (senderIdResult.length === 0) {
      return res.status(404).json({ error: "Sender not found" });
    }
    const senderId = senderIdResult[0].id_uti;
    connection3.release();


    const isRated = await pool.getConnection();
    const [rateResult] = await connection3.query(
      `SELECT rated 
       FROM reservations 
       WHERE id_reservation = ? and id_reserveur= ?`,
      [idReservation, senderId]
    );
    if (rateResult.length === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    const rated = rateResult[0].rated;
    isRated.release();

    if (rated) {
      
      return res.status(400).json({
        error: "Vous avez déjà noté le trajet !",
      });
      
    }

    const userConnection = await pool.getConnection();
    await userConnection.query(
      `UPDATE utilisateurs 
      SET 
        total_rating = CASE 
                         WHEN num_ratings = 0 THEN ? 
                         ELSE ((total_rating * num_ratings) + ?) / (num_ratings + 1)
                       END,
        num_ratings = CASE 
                        WHEN num_ratings = 0 THEN 1 
                        ELSE num_ratings + 1 
                      END
      WHERE id_uti = ?`,
      [newRating, newRating, userId]
    );
    userConnection.release();

    const checkRate = await pool.getConnection()
    await checkRate.query(
      `UPDATE reservations
        set rated = true where
        id_reservation = ? and id_reserveur = ?
      `, [idReservation, senderId]
    )
    checkRate.release()
    
    const checkRide = await pool.getConnection()
    const[idTrajet]=await checkRide.query(
      `SELECT id_trajet
        FROM reservations where
        id_reservation = ? and id_reserveur = ?
      `, [idReservation, senderId]
    )
    const idRide = idTrajet[0].id_trajet;
    checkRide.release()
    


    const getRide = await pool.getConnection()
    const[rideResult] = await getRide.query(
      `SELECT depart, arrivee, timestamp
        FROM trajets where
        id_trajet = ?
      `, [idRide]
    )
    const departTrajet = rideResult[0].depart
    const destinationTrajet = rideResult[0].arrivee
    const temps = rideResult[0].timestamp
    getRide.release()
    const formattedTime = moment(temps).format('YYYY-MM-DD HH:mm');
    

    // Add a notification
    const currentTime = moment().format('YYYY-MM-DD HH:mm');
    const message = `Vous avez reçu une nouvelle note de: ${newRating} étoiles. Trajet: ${departTrajet} vers ${destinationTrajet} à ${formattedTime}.`;
    const connection2 = await pool.getConnection();
    await connection2.query(
      'INSERT INTO notifications (id_uti, id_sender, titre, body, time) VALUES (?, ?, ?, ?, ?)',
      [userId, senderId, "Rating", message, currentTime]
    );
    connection2.release();

    console.log(message);

    res.status(200).json({ message: "User rating updated successfully", rated: true });
  } catch (error) {
    console.error("Error updating user rating:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

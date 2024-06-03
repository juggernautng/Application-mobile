import express from "express";
import { pool } from "../createPool.js"; 

const router = express.Router();

router.delete("/:carId", async (req, res) => {
  const { carId } = req.params;

  try {
    console.log(carId)

    const traietsCnt = await pool.getConnection();
    await traietsCnt.query(`
      DELETE reservations
      FROM reservations
      JOIN trajets ON trajets.id_trajet = reservations.id_trajet
      WHERE trajets.id_voiture = ?
    `, [carId]);
    
    await traietsCnt.query("DELETE FROM trajets WHERE id_voiture = ?", [carId]);
    traietsCnt.release();

    // Delete the car
    const carConnection = await pool.getConnection();
    const [deleteResult] = await carConnection.query(
      "DELETE FROM voitures WHERE matricule = ?",
      [carId]
    );
    carConnection.release();

    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

import express from "express";
import { pool } from "../createPool.js"; 

const router = express.Router();

router.get("/:id_prop", async (req, res) => {
  const { id_prop } = req.params;

  try {
    
    const carsConnection = await pool.getConnection();
    const [cars] = await carsConnection.query(
      "SELECT * FROM voitures WHERE id_prop = ?",
      [id_prop]
    );
    carsConnection.release();


    res.status(200).json(cars);
  } catch (error) {
    console.error("Error retrieving user information:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

import express from "express";
import { pool } from "../createPool.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const connection = await pool.getConnection();

    try {
      const result = await connection.query(
        "SELECT SignalerUserID, TargetUserID, Description FROM signalements"
      );

      console.log(result[0]);
      const result0 = result[0];
      res.status(200).json({ result0 });
    } catch (error) {
      console.error("Error retrieving:", error);
      res.status(500).json({ error: "Failed to retrieve" });
    }
  } catch (error) {
    console.error("Error retrieving:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

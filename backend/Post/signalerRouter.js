import express from "express";
import { pool } from "../createPool.js";

const router = express.Router();

router.use(express.json());

router.post("/", async (req, res) => {
  const { SignalerUserID, TargetUserID, Description } = req.body;

  try {
    const connection = await pool.getConnection();

    await connection.beginTransaction();

    try {
      await connection.query(
        "INSERT INTO Signalements (SignalerUserID, TargetUserID, Description) VALUES (?, ?, ?)",
        [SignalerUserID, TargetUserID, JSON.stringify(Description)]
      );

      await connection.commit();

      connection.release();

      res.status(200).json({ message: "User reported successfully" });
    } catch (error) {
      await connection.rollback();

      connection.release();

      console.error("Error reporting user:", error);
      res.status(500).json({ error: "Failed to report user" });
    }
  } catch (error) {
    console.error("Error reporting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

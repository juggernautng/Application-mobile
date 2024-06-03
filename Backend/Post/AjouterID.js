import express from "express";
import { pool } from "../createPool.js";

const router = express.Router();

router.post("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const { uri } = req.body

        const connection = await pool.getConnection();
        const [rows] = await connection.query(
            "SELECT * FROM Utilisateurs WHERE id_uti = ?",
            [id]
        );
        connection.release();

        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = rows[0]


        const connection1 = await pool.getConnection();
        await connection.query(
          "UPDATE Utilisateurs SET idCard = ? WHERE id_uti = ?",
          [uri, id]
        );
        connection1.release();
    
        res.status(200).json({
          message: "Card Scanned",
          user: { email: rows[0].email, est_certifie: user.est_certifie },
        });
    } catch (error) {
        console.error("Error Scanning ID Card:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;

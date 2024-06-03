import express from "express";
import { pool } from "../createPool.js";

const router = express.Router();

router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, prenom, email: newEmail, photo, num_tel } = req.body;
  console.log(name, prenom, newEmail, num_tel); 

  try {
    // Update user information
    const userConnection = await pool.getConnection();
    console.log(`UPDATE Utilisateurs SET nom = ? WHERE id_uti = ?`,
    [name, id]);
    if (name) {
      await userConnection.query(
        `UPDATE Utilisateurs SET nom = ? WHERE id_uti = ?`,
        [name, id]
      );
    }

     if (prenom) {
      await userConnection.query(
        `UPDATE Utilisateurs SET prenom = ? WHERE id_uti = ?`,
        [prenom, id]
      );
    }

     if (newEmail) {
      const emailCheckConnection = await pool.getConnection();
      const [existingUserWithEmail] = await emailCheckConnection.query(
        "SELECT * FROM Utilisateurs WHERE email = ? AND id_uti != ?",
        [newEmail, id]
      );
      emailCheckConnection.release();

      if (existingUserWithEmail.length > 0) {
        return res.status(400).json({ error: "Email already in use" });
      }
      await userConnection.query(
        `UPDATE Utilisateurs SET email = ? WHERE id_uti = ?`,
        [newEmail, id]
      );
    }

     if (photo) {
      await userConnection.query(
        `UPDATE Utilisateurs SET photo = ? WHERE id_uti = ?`,
        [photo, id]
      );
    }

     if (num_tel) {
      const phoneCheckConnection = await pool.getConnection();
      const [existingUserWithPhone] = await phoneCheckConnection.query(
        "SELECT * FROM Utilisateurs WHERE num_tel = ? AND id_uti != ?",
        [num_tel, id]
      );
      phoneCheckConnection.release();

      if (existingUserWithPhone.length > 0) {
        return res.status(400).json({ error: "Phone already in use" });
      }

      await userConnection.query(
        `UPDATE Utilisateurs SET num_tel = ? WHERE id_uti = ?`,
        [num_tel, id]
      );
    }

    userConnection.release();

    res.status(200).json({ message: "User information updated successfully" });
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


  

export default router;

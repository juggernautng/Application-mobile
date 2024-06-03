import express from "express";
import { pool } from "../createPool.js"; 

const router = express.Router();

router.get("/:email/:read", async (req, res) => {
    const { email, read } = req.params;
    
    

    try {
        const userConnection = await pool.getConnection();
        const [userData] = await userConnection.query(
            "SELECT * FROM Utilisateurs WHERE email = ?",
            [email]
        );
        userConnection.release();

        if (userData.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Get user ID
        const userId = userData[0].id_uti;

        if (read === "true") {
            const notificationsConnection3 = await pool.getConnection();
            await notificationsConnection3.query(
                "UPDATE notifications SET clicked = true WHERE id_uti = ?",
                [userId]
            );
            notificationsConnection3.release();
        }


        // Get notifications along with sender name
        const notificationsConnection = await pool.getConnection();
        const [notifications] = await notificationsConnection.query(
            `SELECT notifications.*, senders.nom as sender_name, senders.prenom as sender_prenom, senders.photo as pdp
             FROM notifications 
             JOIN Utilisateurs as senders ON notifications.id_sender = senders.id_uti 
             WHERE notifications.id_uti = ?
             ORDER BY time DESC`,
            [userId]
        );
        notificationsConnection.release();
        const notificationIds = notifications.map(notification => notification.id_notification);
        // Get the number of notifications 
        const [rows] = await pool.query(
            `SELECT COUNT(id_notification) AS notifications_count, GROUP_CONCAT(id_notification) AS new_notification_ids
             FROM notifications
             WHERE id_uti = ? AND clicked = false`,
            [userId]
        );
        const nbr_notifications = rows[0].notifications_count || 0;
        const newNotificationIds = rows[0].new_notification_ids ? rows[0].new_notification_ids.split(',').map(Number) : [];
        console.log("IDS :",newNotificationIds);

        res.status(200).json({ notifications, notificationIds, nbr_notifications, newNotificationIds }); 
    } catch (error) {
        console.error("Error retrieving user Notifications :", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;

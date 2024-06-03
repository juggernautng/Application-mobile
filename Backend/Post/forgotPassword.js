import express from "express";
import { pool } from "../createPool.js"; 
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import nodemailer from 'nodemailer'
import { USER, APP_PASSWORD, EMAIL_RECEIVER } from '../../env.js';





const router = express.Router();
    let created = false

function generateVerificationCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let verificationCode = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        verificationCode += characters[randomIndex];
    }
    return verificationCode;
}

router.post("/", async (req, res) => {
    try {
        const { email } = req.body;

        const connection = await pool.getConnection();
        const [rows] = await connection.query(
            "SELECT * FROM Utilisateurs WHERE email = ?",
            [email]
        );
        connection.release();

        if (rows.length === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }



        const user = rows[0];

        const secret = process.env.JWT_SECRET + user.mdp
        const token = jwt.sign({ email: email, id: user.id_uti }, secret, { expiresIn: "5m" })

        const code = generateVerificationCode()
        console.log("THIS IS VERIFICATION CODE CHECK EMAIL:", code);


        if (!created) {
            try {
                const connection3 = await pool.getConnection();
                await connection.query(
                    "ALTER TABLE Utilisateurs ADD COLUMN code varchar(30)",
                );
                created = true; 
                connection3.release();
            } catch (error) {
                console.error('Column code already exists');
            }
        }
        


        const connection2 = await pool.getConnection();
        const updateResult = await connection2.query(
            "UPDATE Utilisateurs SET code = ? WHERE email = ?",
            [code, email]
        );
    
        connection2.release();
        


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com', 
            port: 587, 
            secure: false, 
            auth: {
                user: USER,
                pass: APP_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: {
                name: 'ShareWheelsApp',
                address: USER,
            },
            to: EMAIL_RECEIVER,
            subject: 'Password Reset',
            text: `This is your verification code : ${code}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                res.status(500).json({ error: 'Failed to send reset link' });
            } else {
                console.log('Email sent:', info.response);
                res.status(200).json({ message: 'Reset link sent successfully' });
            }
        });


        res.status(200).json({
            message: "User found",
            code,
            email: email
        });
    } catch (error) {
        console.error(":", error);
        res.status(500).json({ error: "" });
    }
});

export default router;

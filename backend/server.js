import express from "express";
import signupRoutes from "./Post/signupRoutes.js";
import loginRouter from "./Post/loginRouter.js";
import publishRouter from "./Post/publishRouter.js";
import rechercheRouter from "./Get/rechercheRouter.js";
import voituresRouter from "./Post/AjoutervoituresRouter.js";
import reserverRouter from "./Post/reserverRouter.js";
import getUserDataRouter from "./Get/getUserDataRouter.js";
import EditUserRouter from './Get/EditUserRouter.js';
import deleteUserRouter from './Delete/deleteUserRouter.js';
import deleteTrajetRouter from './Delete/deleteTrajetRouter.js';
import rateRouter from './Post/rateRouter.js';
import getSignalmentsRouter from './Get/getSignalmentsRouter.js';
import signalerRouter from './Post/signalerRouter.js';
import getIncomingRidesRouter from './Get/getIncomingRidesRouter.js';
import getPassedRidesRouter from './Get/getPassedRidesRouter.js';
import getPostedRidesRouter from './Get/getPostedRidesRouter.js';
import getParticipatedRouter from './Get/getParticipatedRouter.js';
import annulerTrajetRouter from './Delete/annulerTrajetRouter.js';
import forgotPassword from './Post/forgotPassword.js'
import resetPassword from './Post/resetPassword.js'
import EditPassword from './Post/EditPassword.js'
import AjouterID from './Post/AjouterID.js'
import getCarsRouter from './Get/getCarsRouter.js'
import deleteCarRouter from './Delete/deleteCarRouter.js'
import GetNotifications from './Get/GetNotifications.js'


const app = express();
const port = 3000;

app.use(express.json());

app.use("/api/publish", publishRouter);
app.use("/api/signup", signupRoutes);
app.use("/api/login", loginRouter);
app.use("/api/getUserData", getUserDataRouter);
app.use("/api/recherche", rechercheRouter);
app.use("/api/voitures", voituresRouter);
app.use("/api/reserver", reserverRouter);
app.use("/api/EditUser", EditUserRouter);
app.use("/api/DeleteUser", deleteUserRouter);
app.use("/api/DeleteTrajet", deleteTrajetRouter);
app.use("/api/Rate", rateRouter);
app.use("/api/getSignalments", getSignalmentsRouter);
app.use("/api/signaler", signalerRouter);
app.use("/api/getIncomingRides", getIncomingRidesRouter);
app.use("/api/getPassedRides", getPassedRidesRouter);
app.use("/api/getPostedRides", getPostedRidesRouter);
app.use("/api/getParticipated", getParticipatedRouter);
app.use("/api/annulerTrajet", annulerTrajetRouter);
app.use("/api/getCars", getCarsRouter);
app.use("/api/deleteCars", deleteCarRouter);
app.use("/api/forgotPassword", forgotPassword);
app.use("/api/resetPassword", resetPassword);
app.use("/api/EditPassword", EditPassword)
app.use("/api/AjouterID", AjouterID)
app.use("/api/GetNotifications", GetNotifications)




app.listen(port, () => {
  console.log(`Server is running on http://192.168.1.107:${port}`);
});

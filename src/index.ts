import express from 'express';
import dotenv from "dotenv";
import userRoutes from "./routes/userRoute.js";
import absenceRoutes from "./routes/absenceRoute.js";
import planningRoutes from "./routes/planningRoute.js";





dotenv.config();
const app = express();
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/absences", absenceRoutes);
app.use("/api/planning", planningRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});

// process.on("uncaughtException", (err) => {
//     console.error("Uncaught Exception:", err);
//   });
  
//   process.on("unhandledRejection", (reason) => {
//     console.error("Unhandled Rejection:", reason);
//   });

import express from 'express';
import candidatRoutes from "../src/routes/candidatRoute.js"
import moduleRoute from "../src/routes/moduleRoute.js";
import examenRoute from "./routes/examRoute.js";
import noteRoute from "./routes/noteRoute.js";
import niveauRoute from "./routes/niveauRoute.js";
import salleRoutes from "./routes/salleRoute.js";
import filiereRoutes from "./routes/filiereRoute.js";
import coursRoutes from "./routes/coursRoute.js";
import planningRoutes from "./routes/planningRoute.js";
import groupeRoutes from "./routes/groupRoute.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoute";
import twoFactorRoutes from "./routes/TwoFactorRoute";
import roleRoutes from "../src/routes/roleRoute.js";
import permissionRoutes from "../src/routes/permissionRoute.js";
import rolePermissionRoutes from "../src/routes/rolepermissionRoute.js";
import userRoutes from "./routes/userRoute.js";
import absenceRoutes from "./routes/absenceRoute.js";

const app = express();
const PORT = process.env.PORT || 8081;

app.use(express.json());
app.use(cookieParser());

app.use("/api/candidatures", candidatRoutes)
app.use("/api/modules", moduleRoute);
app.use("/api/examens", examenRoute);
app.use("/api/notes", noteRoute);
app.use("/api/niveaux", niveauRoute);
app.use("/api/salles", salleRoutes);
app.use("/api/filieres", filiereRoutes);
app.use("/api/cours", coursRoutes);
app.use("/api/plannings", planningRoutes);
app.use("/api/groupes", groupeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/2fa", twoFactorRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/role-permissions", rolePermissionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/absences", absenceRoutes);

app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});

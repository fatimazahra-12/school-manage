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

const app = express();
app.use(express.json());

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

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});









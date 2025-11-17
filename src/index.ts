import express from 'express';
import candidatRoutes from "../src/routes/candidatRoute.js"
import moduleRoute from "../src/routes/moduleRoute.js";
import examenRoute from "./routes/examRoute.js";
import noteRoute from "./routes/noteRoute.js";

const app = express();
app.use(express.json());

app.use("/api/candidatures", candidatRoutes)
app.use("/api/modules", moduleRoute);
app.use("/api/examens", examenRoute);
app.use("/api/notes", noteRoute);

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});









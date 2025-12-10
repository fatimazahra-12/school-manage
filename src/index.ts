import express from 'express';
import moduleRoute from "./routes/moduleRoute.js";
import noteRoute from "./routes/noteRoute.js";
import examenRoute from "./routes/examenRoute.js";

const app = express();
app.use(express.json());

// Module routes
app.use("/api/modules", moduleRoute);

// Note routes
app.use("/api/notes", noteRoute);

// Examen routes
app.use("/api/examens", examenRoute);

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
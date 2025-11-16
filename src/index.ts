import express from 'express';
import candidatRoutes from "../src/routes/candidatRoute.js"

const app = express();
app.use(express.json());

app.use("/api/candidatures", candidatRoutes)

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
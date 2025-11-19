import express from 'express';
import moduleRoute from "./routes/moduleRoute.js";
import candidatRoutes from "../src/routes/candidatRoute.js"

const app = express();
app.use(express.json());

// Module routes
app.use("/api/modules", moduleRoute);
app.use("/api/candidatures", candidatRoutes)

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});









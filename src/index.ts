import express from 'express';
import noteRoute from "./routes/noteRoute.js";


const app = express();
app.use(express.json());

app.use("/api/notes", noteRoute);

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});
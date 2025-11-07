import express from 'express';
// import moduleRoute from "./routes/moduleRoute.js";
import examenRoute from "./routes/examRoute.js";




const app = express();
app.use(express.json());

// Module routes
//app.use("/api/modules", moduleRoute);

// Examen routes
app.use("/api/examens", examenRoute);

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});









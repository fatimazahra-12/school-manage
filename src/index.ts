import express from 'express';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});